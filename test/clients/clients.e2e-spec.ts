import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
import { ClientEntity } from '../../src/clients/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientDto, ClientReadDto } from '../../src/clients/dtos';
import { Client } from '../../src/clients/client.interface';
import { plainToClass } from 'class-transformer';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let clientRepository: Repository<ClientEntity>
  let client: Client;
  let clientCreate: ClientDto = {
    name: 'Client 1',
    rif: 'J-040518160-5'
  }
  let clientToClient: Client;
  let clientToClientCreate: ClientDto = {
    name: 'Client 2',
    rif: 'J-040518160-0'
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    clientRepository = moduleFixture.get(getRepositoryToken(ClientEntity))
    await clientRepository.query(
      'TRUNCATE TABLE clients RESTART IDENTITY CASCADE',
    );
    await app.init();

    client = await clientRepository.save(clientCreate);
    clientToClientCreate.referrerId = client.id;
    
    clientToClient = await clientRepository.save(clientToClientCreate);
  });



  beforeAll(() => {
    clientRepository.manager.connection.close();
  })

  it('/client (GET)', done => {
    request(app.getHttpServer())
      .get('/clients')
      .expect(200)
      .expect(({body})=>{
        const clients: ClientReadDto[] = body;
        expect(clients.length).toBe(2);
        expect(client[0]).toEqual(plainToClass(ClientReadDto, client))
        expect(client[1]).toEqual(plainToClass(ClientReadDto, clientToClient))
      });
    done();
  });

  describe('/clients/:id (GET)', ()=>{
    it('Id no exist', done => {
      request(app.getHttpServer())
        .get('/clients/1000')
        .expect(404)
        .expect(({body})=>{
          expect(body.message).toEqual('Client does not exist')
        });
      done();
    });

    it('client exist', done => {
      request(app.getHttpServer())
        .get(`/clients/${clientToClient.id}`)
        .expect(200)
        .expect(({body})=>{
          const clientObt: ClientReadDto = body
          expect(clientObt).toEqual(plainToClass(ClientReadDto, clientToClient))
        });
      done();
    });
  })

});
