import { Test, TestingModule } from '@nestjs/testing';
import { FindOperator, Like, Raw, Repository } from 'typeorm';
import { Client } from '../client.interface';
import { ClientsRepository } from '../clients.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientEntity } from '../client.entity';
import {
  clientDto,
  clientDtoSaved,
  idNoExist,
  updateRes,
  referrer,
  referrerDtoSaved,
} from './data-test';
import { ClientDto, ClientUpdateDto } from '../dtos';
import { Status } from '../status.enum';

describe('Clients Repository', () => {
  let repository: Repository<Client>;
  let clientsRepository: ClientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsRepository,
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

    clientsRepository = module.get<ClientsRepository>(ClientsRepository);
    repository = module.get<Repository<Client>>(
      getRepositoryToken(ClientEntity),
    );
  });

  describe('Save new client', () => {
    it('save ', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved); //find referrer id
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined); //find rif
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(clientDtoSaved); // fin client saved
      const createSpy = jest.spyOn(repository, 'create');
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(clientDtoSaved);
      const result = await clientsRepository.create(clientDto).toPromise();
      expect(repository.findOne).toHaveBeenCalledTimes(3);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('save client without referrer ', async () => {
      const clientWithoutDto: ClientDto = {
        name: 'client test',
        rif: 'J-30997933-1',
      };

      jest.spyOn(repository, 'findOne');
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined); //find rif
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(clientDtoSaved); // fin client saved
      const createSpy = jest.spyOn(repository, 'create');
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(clientDtoSaved);
      const result = await clientsRepository
        .create(clientWithoutDto)
        .toPromise();
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('error trying to save with a referrer that does not exist  ', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-2',
        referrerId: idNoExist,
      };
      jest.spyOn(repository, 'findOne');
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined); // find referrer id
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined); //find rif
      const createSpy = jest.spyOn(repository, 'create');
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(clientDtoSaved);
      try {
        await clientsRepository.create(createClient).toPromise();
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(2);
        expect(createSpy).not.toBeCalled();
        expect(saveSpy).not.toBeCalled();
        expect(e.message).toEqual('Referrer does not exist');
      }
    });

    it('error trying to save with rif exist  ', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-3',
        referrerId: referrer.id,
      };
      jest.spyOn(repository, 'findOne');
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(clientDtoSaved); //find referrer id
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(clientDtoSaved); //find rif
      const createSpy = jest.spyOn(repository, 'create');
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(clientDtoSaved);
      try {
        await clientsRepository.create(createClient).toPromise();
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(2);
        expect(createSpy).not.toBeCalled();
        expect(saveSpy).not.toBeCalled();
        expect(e.message).toEqual('Client already exist');
      }
    });
  });

  describe('get', () => {
    it('return one result', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved);
      const foundClient = await clientsRepository
        .get(clientDtoSaved.id)
        .toPromise();
      expect(foundClient).toEqual(clientDtoSaved);
      expect(repository.findOne).lastCalledWith({
        where: { id: clientDtoSaved.id },
        relations: ['referrer'],
      });
      expect(repository.findOne).toBeCalledTimes(1);
    });

    it('return a null result', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await clientsRepository.get(idNoExist).toPromise();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('getAll', () => {
    it('return one result', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([clientDtoSaved]);
      const foundClient = await clientsRepository.getAll().toPromise();
      expect(foundClient).toEqual([clientDtoSaved]);
      expect(repository.find).lastCalledWith({
        where: { status: Status.ACTIVE },
        relations: ['referrer'],
      });
      expect(repository.find).toBeCalledTimes(1);
    });
  });

  describe('getAllByReferrerName', () => {
    it('return all result', async () => {
      const name = referrer.name.slice(0, -3);
      jest.spyOn(repository, 'find').mockResolvedValue([referrerDtoSaved]);
      const foundClient = await clientsRepository
        .getAllByReferrer(name)
        .toPromise();
      expect(foundClient).toEqual([referrerDtoSaved]);
      expect(repository.find).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('return one result', async () => {
      const clientUp: ClientUpdateDto = {
        name: 'client updated',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved);
      jest.spyOn(repository, 'update').mockResolvedValue(updateRes);
      await clientsRepository.update(clientDtoSaved.id, clientUp).toPromise();
      expect(repository.findOne).lastCalledWith({
        relations: ['referrer'],
        where: { id: clientDtoSaved.id },
      });
      expect(repository.findOne).toBeCalledTimes(2);
      expect(repository.update).lastCalledWith(clientDtoSaved.id, clientUp);
      expect(repository.update).toBeCalledTimes(1);
    });

    it('return a null result', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await clientsRepository.update(100, clientDto).toPromise();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('Delete', () => {
    it('Delete with id no found', async () => {
      const find = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(undefined);
      const saved = jest.spyOn(repository, 'save').mockResolvedValue(undefined);
      let foundClient;
      clientsRepository.delete(1).subscribe({
        next: x => {
          foundClient = x;
        },
      });
      // const foundClient = await clientsRepository.delete(1).toPromise();
      expect(foundClient).toEqual(undefined);
      expect(find).toHaveBeenCalledTimes(1);
      expect(saved).not.toBeCalled();
    });

    it('return result delete', async () => {
      const find = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(clientDtoSaved);
      const saved = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(clientDtoSaved);
      // clientsRepository.delete(1).subscribe()
      const foundClient = await clientsRepository.delete(1).toPromise();
      expect(foundClient).toEqual({ message: 'success' });
      expect(find).toHaveBeenCalledTimes(1);
      expect(saved).toHaveBeenCalledTimes(1);
    });
  });
});
