import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { of } from 'rxjs';
import { ClientEntity } from '../client.entity';
import {
  ClientReadDto,
  ClientReadExDto,
  ClientReadReferrersDto,
} from '../dtos';
import { ClientsController } from '../clients.controller';
import { ClientsService } from '../clients.service';
import { ClientsRepository } from '../clients.repository';
import {
  clientDtoSaved,
  clientDto,
  referrer,
  referrerDtoSaved,
} from './data-test';

describe('ClientsController', () => {
  let service: ClientsService;
  let controller: ClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        ClientsService,
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn,
            getAll: jest.fn(),
            getAllByReferrer: jest.fn(),
            get: jest.fn(),
            update: jest.fn,
            delete: jest.fn,
          },
        },
        {
          provide: ClientsRepository,
          useValue: {
            create: jest.fn,
            getAll: jest.fn(),
            getAllByReferrer: jest.fn(),
            get: jest.fn(),
            update: jest.fn,
            delete: jest.fn,
          },
        },
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: {
            create: jest.fn,
            save: jest.fn,
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn,
            delete: jest.fn,
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create one Client', () => {
    it('save ', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockReturnValue(of(plainToClass(ClientReadDto, clientDtoSaved)));
      controller.postCreate(clientDto).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadDto, clientDtoSaved));
      });
      expect(createSpy).toBeCalledWith({ ...clientDto });
      expect(createSpy).toBeCalledTimes(1);
    });
  });

  describe('find all Clients', () => {
    it('getAll ', async () => {
      const getAllSpy = jest
        .spyOn(service, 'getAll')
        .mockReturnValue(of([plainToClass(ClientReadDto, clientDtoSaved)]));
      controller.getAllClients().subscribe(res => {
        expect(res).toEqual([plainToClass(ClientReadDto, clientDtoSaved)]);
      });
      expect(getAllSpy).toBeCalledWith();
      expect(getAllSpy).toBeCalledTimes(1);
    });
  });

  describe('find all Clients by referrer', () => {
    it('getAllByReferrer ', async () => {
      const name = referrer.name.slice(0, -3);
      const data = plainToClass(ClientReadReferrersDto, referrerDtoSaved);
      const getAllSpy = jest
        .spyOn(service, 'getAllByReferrer')
        .mockReturnValue(of([data]));
      controller.getAllByReferrer(name).subscribe(res => {
        expect(res).toEqual([data]);
      });
      expect(getAllSpy).toBeCalledWith(name);
      expect(getAllSpy).toBeCalledTimes(1);
    });
  });

  describe('find one Client', () => {
    it('get one client exist ', async () => {
      const getSpy = jest
        .spyOn(service, 'get')
        .mockReturnValue(of(plainToClass(ClientReadExDto, clientDtoSaved)));
      controller.get(clientDtoSaved.id).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadExDto, clientDtoSaved));
      });
      expect(getSpy).toBeCalledWith(clientDtoSaved.id);
      expect(getSpy).toBeCalledTimes(1);
    });
  });

  describe('Update one Client', () => {
    it('Update one client exist ', async () => {
      const updateSpy = jest
        .spyOn(service, 'update')
        .mockReturnValue(of(plainToClass(ClientReadExDto, clientDtoSaved)));
      controller.update(clientDtoSaved.id, clientDto).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadExDto, clientDtoSaved));
      });
      expect(updateSpy).toBeCalledWith(clientDtoSaved.id, clientDto);
      expect(updateSpy).toBeCalledTimes(1);
    });
  });

  describe('delete one Client', () => {
    it('get one client exist ', async () => {
      const getSpy = jest
        .spyOn(service, 'delete')
        .mockReturnValue(of({ message: 'success' }));
      controller.delete(clientDtoSaved.id);
      expect(getSpy).toBeCalledWith(clientDtoSaved.id);
      expect(getSpy).toBeCalledTimes(1);
    });
  });
});
