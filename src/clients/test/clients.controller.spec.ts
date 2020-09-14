import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../clients.service';
import { ClientsRepository } from '../clients.repository';
import { clientDtoSaved, clientDto, deleteRes } from './data-test';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientEntity } from '../client.entity';
import { of } from 'rxjs';
import { ClientsController } from '../clients.controller';
import { plainToClass } from 'class-transformer';
import { ClientReadDto } from '../dtos/client-read.dto';

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

  describe('find one Client', () => {
    it('get one client exist ', async () => {
      const getSpy = jest
        .spyOn(service, 'get')
        .mockReturnValue(of(plainToClass(ClientReadDto, clientDtoSaved)));
      controller.get(clientDtoSaved.id).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadDto, clientDtoSaved));
      });
      expect(getSpy).toBeCalledWith(clientDtoSaved.id);
      expect(getSpy).toBeCalledTimes(1);
    });
  });

  describe('Update one Client', () => {
    it('Update one client exist ', async () => {
      const updateSpy = jest
        .spyOn(service, 'update')
        .mockReturnValue(of(plainToClass(ClientReadDto, clientDtoSaved)));
      controller.update(clientDtoSaved.id, clientDto).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadDto, clientDtoSaved));
      });
      expect(updateSpy).toBeCalledWith(clientDtoSaved.id, clientDto);
      expect(updateSpy).toBeCalledTimes(1);
    });
  });

  describe('delete one Client', () => {
    it('get one client exist ', async () => {
      const getSpy = jest
        .spyOn(service, 'delete')
        .mockReturnValue(of(deleteRes));
      controller.delete(clientDtoSaved.id).subscribe(res => {
        expect(res).toEqual(deleteRes);
      });
      expect(getSpy).toBeCalledWith(clientDtoSaved.id);
      expect(getSpy).toBeCalledTimes(1);
    });
  });
});
