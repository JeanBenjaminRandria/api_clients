import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
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
} from './data-test';
import { ClientDto, ClientUpdateDto } from '../dtos';
import { EMPTY, of } from 'rxjs';
import { Status } from '../status.enum';

describe('UserService', () => {
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
      const validateRif = jest
        .spyOn(clientsRepository, 'validateDontExistRifDb')
        .mockReturnValueOnce(EMPTY);
      const validateReferrerId = jest
        .spyOn(clientsRepository, 'validateDontExistIdDb')
        .mockReturnValueOnce(EMPTY);
      jest.spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved);
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(clientDtoSaved);
      const createSpy = jest.spyOn(repository, 'create');

      const result = await clientsRepository.create(clientDto).toPromise();
      expect(validateRif).toHaveBeenCalledTimes(1);
      expect(validateRif).toHaveBeenCalledWith(clientDto.rif);
      expect(validateReferrerId).toHaveBeenCalledTimes(1);
      expect(validateReferrerId).toHaveBeenCalledWith(clientDto.referrerId);
      expect(createSpy).toBeCalledWith({ ...clientDto });
      expect(saveSpy).toBeCalledTimes(1);
      expect(createSpy).toBeCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('save client without referrer ', async () => {
      const clientWithoutDto: ClientDto = {
        name: 'client test',
        rif: 'J-30997933-1',
      };
      const validateRif = jest
        .spyOn(clientsRepository, 'validateDontExistRifDb')
        .mockReturnValueOnce(EMPTY);
      const validateReferrerId = jest
        .spyOn(clientsRepository, 'validateDontExistIdDb')
        .mockReturnValueOnce(EMPTY);
      jest.spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved);
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(clientDtoSaved);
      const createSpy = jest.spyOn(repository, 'create');

      const result = await clientsRepository
        .create(clientWithoutDto)
        .toPromise();
      expect(validateRif).toHaveBeenCalledTimes(1);
      expect(validateRif).toHaveBeenCalledWith(clientWithoutDto.rif);
      expect(validateReferrerId).not.toHaveBeenCalled();
      expect(createSpy).toBeCalledWith({ ...clientWithoutDto });
      expect(saveSpy).toBeCalledTimes(1);
      expect(createSpy).toBeCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('error trying to save with a referrer that does not exist  ', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-2',
        referrerId: idNoExist,
      };
      jest
        .spyOn(clientsRepository, 'validateDontExistRifDb')
        .mockReturnValueOnce(EMPTY);
      const validateReferrerId = jest
        .spyOn(clientsRepository, 'validateDontExistIdDb')
        .mockReturnValueOnce(of(false));
      const saveSpy = jest.spyOn(repository, 'save');
      const createSpy = jest.spyOn(repository, 'create');
      try {
        await clientsRepository.create(createClient).toPromise();
      } catch (e) {
        expect(validateReferrerId).toHaveBeenCalledWith(
          createClient.referrerId,
        );
        expect(createSpy).not.toHaveBeenCalled();
        expect(saveSpy).not.toHaveBeenCalled();
        expect(e).toBeDefined();
        expect(e.message).toEqual('Referrer does not exist');
      }
    });

    it('error trying to save with rif exist  ', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-3',
        referrerId: referrer.id,
      };
      const validate = jest
        .spyOn(clientsRepository, 'validateDontExistRifDb')
        .mockReturnValueOnce(of(false));
      jest
        .spyOn(clientsRepository, 'validateDontExistIdDb')
        .mockReturnValueOnce(EMPTY);
      const saveSpy = jest.spyOn(repository, 'save');
      const createSpy = jest.spyOn(repository, 'create');
      try {
        await clientsRepository.create(createClient).toPromise();
      } catch (e) {
        expect(validate).toHaveBeenCalledWith(createClient.rif);
        expect(createSpy).not.toHaveBeenCalled();
        expect(saveSpy).not.toHaveBeenCalled();
        expect(e).toBeDefined();
        expect(e.message).toEqual('Client already exist');
      }
    });
  });

  describe(' validate rif client', () => {
    it('Rif dont exist', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-4',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      await clientsRepository.validateRif(createClient).toPromise();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenLastCalledWith({
        rif: createClient.rif,
      });
    });

    it('Rif exist', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-5',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(clientDtoSaved);
      try {
        await clientsRepository.validateRif(createClient).toPromise();
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenLastCalledWith({
          rif: createClient.rif,
        });
        expect(e).toBeDefined();
        expect(e.message).toEqual('Client already exist');
      }
    });
  });

  describe('validate referrer', () => {
    it('client without referrer id', () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-6',
      };
      jest.spyOn(repository, 'findOne');
      clientsRepository.ValidateReferrerId(createClient).toPromise();
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('client with referrer id exist db', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-7',
        referrerId: 123,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(clientDtoSaved);
      await clientsRepository.ValidateReferrerId(createClient).toPromise();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenLastCalledWith(
        createClient.referrerId,
      );
    });

    it('client with referrer id not exist db', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-30997933-8',
        referrerId: 123,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      try {
        await clientsRepository.ValidateReferrerId(createClient).toPromise();
      } catch (e) {
        expect(e).toBeDefined();
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenLastCalledWith(
          createClient.referrerId,
        );
        expect(e.message).toEqual('Referrer does not exist');
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
      // clientsRepository.delete(1).subscribe({
      //   next: x => console.log('Ok', x),
      //   error: e => console.log('error Ok', e),
      //   complete: () => console.log(' OK complete')
      // })
      const foundClient = await clientsRepository.delete(1).toPromise();
      expect(foundClient).toEqual({ message: 'success' });
      expect(find).toHaveBeenCalledTimes(1);
      expect(saved).toHaveBeenCalledTimes(1);
    });
  });
});
