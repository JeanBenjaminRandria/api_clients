import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { from, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ClientsService } from '../clients.service';
import { ClientsRepository } from '../clients.repository';
import {
  clientDtoSaved,
  clientDto,
  referrer,
  referrerDtoSaved, idNoExist, updateRes
} from './data-test';
import { ClientEntity } from '../model/client.entity';
import {
  ClientDto,
  ClientReadDto,
  ClientReadExDto,
  ClientReadReferrersDto,
  ClientUpdateDto,
} from '../dtos';

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
            saveClient: jest.fn,
            getAll: jest.fn(),
            getAllByReferrer: jest.fn(),
            findOne: jest.fn(),
            findOneRif: jest.fn(),
            update: jest.fn,
            delete: jest.fn,
          },
        },
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: {
            saveClient: jest.fn,
            findAndCount: jest.fn(),
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
      jest.spyOn(repository, 'findOne').mockReturnValueOnce(of(clientDtoSaved)); //find referrer id
      jest.spyOn(repository, 'findOneRif').mockReturnValueOnce(of(undefined)); //find rif
      jest.spyOn(repository, 'findOne').mockReturnValueOnce(of(clientDtoSaved)); // fin client saved
      const saveSpy = jest
        .spyOn(repository, 'saveClient')
        .mockReturnValueOnce(of(clientDtoSaved));
      const result = await service.create(clientDto).toPromise();
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(repository.findOneRif).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('save client without referrer ', async () => {
      const clientWithoutDto: ClientDto = {
        name: 'client test',
        rif: 'J-30997933-1',
      };
      jest.spyOn(repository, 'findOneRif').mockReturnValueOnce(of(undefined)); //find rif
      jest.spyOn(repository, 'findOne').mockReturnValueOnce(of(clientDtoSaved)); // fin client saved
      const saveSpy = jest
        .spyOn(repository, 'saveClient')
        .mockReturnValueOnce(of(clientDtoSaved));
      const result = await service.create(clientWithoutDto).toPromise();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('error trying to save with a referrer that does not exist  ', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-2',
        referrerId: idNoExist,
      };

      jest.spyOn(repository, 'findOne').mockReturnValueOnce(of(undefined)); //find referrer id
      jest.spyOn(repository, 'findOneRif').mockReturnValueOnce(of(undefined)); //find rif
      const saveSpy = jest
        .spyOn(repository, 'saveClient')
      try {
        const result = await service.create(createClient).toPromise();
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(saveSpy).not.toBeCalled()
        expect(e.message).toEqual('Referrer does not exist');
      }
    });

    it('error trying to save with rif exist  ', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-3',
        referrerId: referrer.id,
      };

      jest.spyOn(repository, 'findOne').mockReturnValueOnce(of(clientDtoSaved)); //find referrer id
      jest.spyOn(repository, 'findOneRif').mockReturnValueOnce(of(clientDtoSaved)); //find rif
      const saveSpy = jest.spyOn(repository, 'saveClient')
      try {
        const result = await service.create(createClient).toPromise();
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(saveSpy).not.toBeCalled()
        expect(e.message).toEqual('Client already exist');
      }
    });
  });

  describe('find all Clients', () => {
    it('getAll ', async () => {
      const getAllSpy = jest
        .spyOn(repository, 'getAll')
        .mockReturnValue(of([[clientDtoSaved], 1]));
      service.getAll().subscribe(res => {
        expect(res).toEqual({
          count: 1,
          clients: [plainToClass(ClientReadDto, clientDtoSaved)],
        });
      });
      expect(getAllSpy).toHaveBeenCalled();
      expect(getAllSpy).toBeCalledTimes(1);
    });
  });

  describe('find all Clients by referrer', () => {
    it('getAllByReferrer ', async () => {
      const name = referrer.name.slice(0, -3);
      const getAllSpy = jest
        .spyOn(repository, 'getAllByReferrer')
        .mockReturnValue(of([[referrerDtoSaved], 1]));
      service.getAllByReferrer(name).subscribe(res => {
        expect(res).toEqual({
          count: 1,
          clients: [plainToClass(ClientReadReferrersDto, referrerDtoSaved)],
        });
      });
      expect(getAllSpy).toBeCalledWith(name, undefined);
      expect(getAllSpy).toBeCalledTimes(1);
    });
  });

  describe('find one Client', () => {
    it('get one client exist ', async () => {
      const getSpy = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(of(clientDtoSaved));
      service.get(clientDtoSaved.id).subscribe(res => {
        expect(res).toEqual(plainToClass(ClientReadExDto, clientDtoSaved));
      });
      expect(getSpy).toBeCalledWith(clientDtoSaved.id);
      expect(getSpy).toBeCalledTimes(1);
    });
  });

  describe('Update one Client', () => {
    // it('Update one client exist ', async () => {
    //   const updateSpy = jest
    //     .spyOn(repository, 'update')
    //     .mockReturnValue(of(clientDtoSaved));
    //   service.update(clientDtoSaved.id, clientDto).subscribe(res => {
    //     expect(res).toEqual(plainToClass(ClientReadExDto, clientDtoSaved));
    //   });
    //   expect(updateSpy).toBeCalledWith(clientDtoSaved.id, clientDto);
    //   expect(updateSpy).toBeCalledTimes(1);
    // });

    it('return one result', async () => {
      const clientUp: ClientUpdateDto = {
        name: 'client updated',
      };
      jest.spyOn(repository, 'findOne').mockReturnValue(of(clientDtoSaved));
      jest.spyOn(repository, 'update').mockReturnValueOnce(of(updateRes));
      await service.update(clientDtoSaved.id, clientUp).toPromise();
      expect(repository.findOne).toBeCalledTimes(2);
      expect(repository.update).lastCalledWith(clientDtoSaved.id, clientUp);
      expect(repository.update).toBeCalledTimes(1);
    });

    it('return a null result', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(of(undefined));
      try {
        await service.update(100, clientDto).toPromise();
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toEqual('Client has not been found')
      }
    });
  });

  // describe('delete one Client', () => {
  //   it('get one client exist ', async () => {
  //     const getSpy = jest
  //       .spyOn(repository, 'delete')
  //       .mockReturnValue(of({ message: 'success' }));
  //     service.delete(clientDtoSaved.id).subscribe(res => {
  //       expect(res).toEqual({ message: 'success' });
  //     });
  //     expect(getSpy).toBeCalledWith(clientDtoSaved.id);
  //     expect(getSpy).toBeCalledTimes(1);
  //   });
  // });

  describe('Delete', () => {
    it('Delete with id no found', async () => {
      const find = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(of(undefined));
      const saved = jest.spyOn(repository, 'saveClient');
      let foundClient;
      service.delete(1).subscribe({
        next: x => {
          foundClient = x;
        },
      });
      // const foundClient = await clientsRepository.delete(1).toPromise();
      expect(foundClient).toEqual(undefined);
      expect(find).toHaveBeenCalledTimes(1);
      expect(repository.saveClient).not.toBeCalled();
    });

    it('return result delete', async () => {
      const find = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(of(clientDtoSaved));
      const saved = jest
        .spyOn(repository, 'saveClient')
        .mockReturnValue(of(clientDtoSaved));
      // clientsRepository.delete(1).subscribe()
      const foundClient = await service.delete(1).toPromise();
      expect(foundClient).toEqual({ message: 'success' });
      expect(find).toHaveBeenCalledTimes(1);
      expect(saved).toHaveBeenCalledTimes(1);
    });
  });
});
