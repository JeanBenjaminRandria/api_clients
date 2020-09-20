import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
import { ClientEntity } from '../../src/clients/model/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ClientDto,
  ClientUpdateDto,
  ClientReadExDto,
  ClientReadReferrersDto,
  PaginationClientsReadDto,
  ClientReadDto,
  PaginationOutReferrersDto,
} from '../../src/clients/dtos';
import { Client } from '../../src/clients/model/client.interface';

describe('CientsController (e2e)', () => {
  let app: INestApplication;
  let clientRepository: Repository<ClientEntity>;
  let client: Client;
  const clientCreate: ClientDto = {
    name: 'Client 1',
    rif: 'J-040518160-5',
  };
  let clientToClient: Client;
  const clientToClientCreate: ClientDto = {
    name: 'Client 2',
    rif: 'J-040518160-0',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    clientRepository = moduleFixture.get(getRepositoryToken(ClientEntity));
    await clientRepository.query(
      'TRUNCATE TABLE clients RESTART IDENTITY CASCADE',
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    client = await clientRepository.save(clientCreate);
    clientToClientCreate.referrerId = client.id;

    clientToClient = await clientRepository.save(clientToClientCreate);
  });

  afterAll(() => {
    clientRepository.manager.connection.close();
  });

  describe('Get All Clients ', () => {
    let clientRes: ClientReadDto;

    it('/client (GET)', async done => {
      await request(app.getHttpServer())
        .get('/clients/all')
        .expect(200)
        .expect(({ body }) => {
          const pagination: PaginationClientsReadDto = body;
          expect(pagination.count).toBe(2);
          expect(pagination.clients.length).toBe(2);
        });
      done();
    });

    it('/client/take (GET)', async done => {
      await request(app.getHttpServer())
        .get('/clients/all/1')
        .expect(200)
        .expect(({ body }) => {
          const pagination: PaginationClientsReadDto = body;
          expect(pagination.count).toBe(2);
          expect(pagination.clients.length).toBe(1);
          clientRes = pagination.clients[0];
        });
      done();
    });

    it('/client/take/skip (GET)', async done => {
      await request(app.getHttpServer())
        .get('/clients/all/1/1')
        .expect(200)
        .expect(({ body }) => {
          const pagination: PaginationClientsReadDto = body;
          expect(pagination.count).toBe(2);
          expect(pagination.clients.length).toBe(1);
          expect(pagination.clients[0]).not.toEqual(clientRes);
        });
      done();
    });
  });

  describe('Get Client By Refferer', () => {
    it('/client/referrer/:name (GET)', async done => {
      await request(app.getHttpServer())
        .get(`/clients/referrer/${client.name}`)
        .expect(200)
        .expect(({ body }) => {
          // console.log(body);

          const pagination: PaginationOutReferrersDto = body;
          expect(pagination.count).toBeGreaterThan(0);
          const clients: ClientReadReferrersDto[] = pagination.clients;
          expect(clients[0].referrers.length).toBeGreaterThan(0);
        });

      done();
    });

    it('/client/referrer/:name (GET)', async done => {
      const name = client.name.slice(0, -3);
      await request(app.getHttpServer())
        .get(`/clients/referrer/${name}`)
        .expect(200)
        .expect(({ body }) => {
          // console.log(body);

          const pagination: PaginationOutReferrersDto = body;
          expect(pagination.count).toBeGreaterThan(0);
          const clients: ClientReadReferrersDto[] = pagination.clients;
          expect(clients[0].referrers.length).toBeGreaterThan(0);
        });
      done();
    });
  });

  describe('/clients/:id (GET)', () => {
    it('Id no exist', async done => {
      await request(app.getHttpServer())
        .get('/clients/1000')
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toEqual('Client has not been found');
        });
      done();
    });

    it('client exist', async done => {
      await request(app.getHttpServer())
        .get(`/clients/${clientToClient.id}`)
        .expect(200)
        .expect(({ body }) => {
          const clientObt: ClientReadExDto = body;
          expect(clientObt.id).toEqual(clientToClient.id);
          expect(clientObt.name).toEqual(clientToClient.name);
          expect(clientObt.rif).toEqual(clientToClient.rif);
          expect(clientObt.status).toEqual(clientToClient.status);
          expect(clientObt.referrer.id).toEqual(client.id);
          expect(clientObt.referrer.rif).toEqual(client.rif);
          expect(clientObt.referrer.name).toEqual(client.name);
        });
      done();
    });
  });

  describe('/clients (POST)', () => {
    it('save ok without referrer', async done => {
      const newClient: ClientDto = {
        name: 'Client Create',
        rif: 'V-013149501-0',
      };
      await request(app.getHttpServer())
        .post('/clients')
        .type('application/json')
        .send(newClient)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.name).toEqual(newClient.name);
          expect(body.rif).toEqual(newClient.rif);
        });
      done();
    });

    it('save ok with referrer', async done => {
      const newClient: ClientDto = {
        name: 'Client Create 2',
        rif: 'V-013149501-1',
        referrerId: client.id,
      };
      await request(app.getHttpServer())
        .post('/clients')
        .type('application/json')
        .send(newClient)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.name).toEqual(newClient.name);
          expect(body.rif).toEqual(newClient.rif);
          expect(body.referrer.name).toEqual(client.name);
          expect(body.referrer.rif).toEqual(client.rif);
          expect(body.referrer.id).toEqual(client.id);
        });
      done();
    });

    it('save fail rif repete', async done => {
      const newClient: ClientDto = {
        name: 'Client Test',
        rif: 'V-013149501-0',
      };
      await request(app.getHttpServer())
        .post('/clients')
        .type('application/json')
        .send(newClient)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.message).toEqual('Client already exist');
        });
      done();
    });

    it('save fail referrer does not exist', async done => {
      const newClient: ClientDto = {
        name: 'Client Test',
        rif: 'V-013149501-8',
        referrerId: 100,
      };
      await request(app.getHttpServer())
        .post('/clients')
        .type('application/json')
        .send(newClient)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.message).toEqual('Referrer does not exist');
        });
      done();
    });
  
  });

  describe('/clients/:id (PATH)', () => {
    const clientUp: ClientUpdateDto = {
      name: 'Client Modificado',
    };
    it('Id no exist', async done => {
      await request(app.getHttpServer())
        .patch(`/clients/1000`)
        .type('application/json')
        .send(clientUp)
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toEqual('Client has not been found');
        });
      done();
    });

    it('client exist', async done => {
      const find = await request(app.getHttpServer()).get(
        `/clients/${clientToClient.id}`,
      );
      const clientOrigin: ClientReadExDto = find.body;
      clientOrigin.name = clientUp.name;
      await request(app.getHttpServer())
        .patch(`/clients/${clientOrigin.id}`)
        .type('application/json')
        .send(clientUp)
        .expect(200)
        .expect(({ body }) => {
          const clientReceived: ClientReadExDto = body;
          expect(clientReceived).toEqual(clientOrigin);
        });
      done();
    });
  });

  describe('clients/:id (DELETE)', () => {
    it('Delete id no found', async done => {
      await request(app.getHttpServer())
        .delete(`/clients/1000`)
        .expect(202);
      done();
    });

    it('Delete id no found', async done => {
      const getAllActive = await request(app.getHttpServer()).get(
        '/clients/all',
      );
      await request(app.getHttpServer())
        .delete(`/clients/${clientToClient.id}`)
        .expect(202);
      const getAllActiveNew = await request(app.getHttpServer()).get(
        '/clients/all',
      );

      const clientsAll: PaginationClientsReadDto = getAllActive.body;
      const clients: PaginationClientsReadDto = getAllActiveNew.body;
      expect(clientsAll.count).toBeGreaterThan(clients.count);

      done();
    });

  });

});
