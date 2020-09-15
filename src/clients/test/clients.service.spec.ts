import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../clients.service';
import { ClientsRepository } from '../clients.repository';
import { clientDtoSaved, clientDto } from './data-test';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientEntity } from '../client.entity';
import { of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ClientReadDto } from '../dtos/client-read.dto';
import { ClientReadExDto } from '../dtos/client-read-ex.dto';

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: ClientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
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

    repository = module.get<ClientsRepository>(ClientsRepository);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create one Client', () => {
    it('save ', async () => {
      const createSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValue(of(clientDtoSaved));
      service.create(clientDto).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadDto, clientDtoSaved));
      });
      expect(createSpy).toBeCalledWith({ ...clientDto });
      expect(createSpy).toBeCalledTimes(1);
    });
  });

  describe('find all Clients', () => {
    it('getAll ', async () => {
      const getAllSpy = jest
        .spyOn(repository, 'getAll')
        .mockReturnValue(of([clientDtoSaved]));
      service.getAll().subscribe(res => {
        expect(res).toEqual([plainToClass(ClientReadDto, clientDtoSaved)]);
      });
      expect(getAllSpy).toBeCalledWith();
      expect(getAllSpy).toBeCalledTimes(1);
    });
  });

  describe('find one Client', () => {
    it('get one client exist ', async () => {
      const getSpy = jest
        .spyOn(repository, 'get')
        .mockReturnValue(of(clientDtoSaved));
      service.get(clientDtoSaved.id).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadExDto, clientDtoSaved));
      });
      expect(getSpy).toBeCalledWith(clientDtoSaved.id);
      expect(getSpy).toBeCalledTimes(1);
    });
  });

  describe('Update one Client', () => {
    it('Update one client exist ', async () => {
      const updateSpy = jest
        .spyOn(repository, 'update')
        .mockReturnValue(of(clientDtoSaved));
      service.update(clientDtoSaved.id, clientDto).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadExDto, clientDtoSaved));
      });
      expect(updateSpy).toBeCalledWith(clientDtoSaved.id, clientDto);
      expect(updateSpy).toBeCalledTimes(1);
    });
  });

  describe('delete one Client', () => {
    it('get one client exist ', async () => {
      const getSpy = jest
        .spyOn(repository, 'delete')
        .mockReturnValue(of({ message: 'success' }));
      service.delete(clientDtoSaved.id).subscribe(res => {
        expect(res).toEqual({ message: 'success' });
      });
      expect(getSpy).toBeCalledWith(clientDtoSaved.id);
      expect(getSpy).toBeCalledTimes(1);
    });
  });
});
