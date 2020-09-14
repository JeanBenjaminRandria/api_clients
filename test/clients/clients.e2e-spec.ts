import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
import { ClientEntity } from '../../src/clients/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ClientDto,
  ClientReadDto,
  ClientUpdateDto,
} from '../../src/clients/dtos';
import { Client } from '../../src/clients/client.interface';

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
    await app.init();

    client = await clientRepository.save(clientCreate);
    clientToClientCreate.referrerId = client.id;

    clientToClient = await clientRepository.save(clientToClientCreate);
  });

  afterAll(() => {
    clientRepository.manager.connection.close();
  });

  it('/client (GET)', async done => {
    await request(app.getHttpServer())
      .get('/clients')
      .expect(200)
      .expect(({ body }) => {
        const clients: ClientReadDto[] = body;
        expect(clients.length).toBe(2);
      });
    done();
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
          const clientObt: ClientReadDto = body;
          expect(clientObt.id).toEqual(clientToClient.id);
          expect(clientObt.name).toEqual(clientToClient.name);
          expect(clientObt.rif).toEqual(clientToClient.rif);
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
        name: 'Client Test',
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
        name: 'Client Test',
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

  describe('/clients/:id (PUT)', () => {
    const clientUp: ClientUpdateDto = {
      name: 'Client Modificado',
    };
    it('Id no exist', async done => {
      await request(app.getHttpServer())
        .put(`/clients/1000`)
        .type('application/json')
        .send(clientUp)
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toEqual('Client has not been found');
        });
      done();
    });

    it('client exist', async done => {
      await request(app.getHttpServer())
        .put(`/clients/${clientToClient.id}`)
        .type('application/json')
        .send(clientUp)
        .expect(200)
        .expect(({ body }) => {
          expect(body.affected).toBe(1);
        });
      done();
    });
  });
});
