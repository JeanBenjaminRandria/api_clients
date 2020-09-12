import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Client } from '../client.interface';
import { ClientsRepository } from '../clients.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientEntity } from '../client.entity';
import { clientDto, clientDtoSaved, idNoExist, updateRes, deleteRes, referrer } from './data-test'
import { ClientDto } from '../dtos';

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
            delete: jest.fn
          },
        }
      ],
    }).compile();

    clientsRepository = module.get<ClientsRepository>(ClientsRepository);
    repository = module.get<Repository<Client>>(getRepositoryToken(ClientEntity));
  });

  it('should be defined', () => {
    expect(clientsRepository).toBeDefined();
  });

  describe('Save new client', () => {
    it('save ', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(referrer)
      const createSpy = jest.spyOn(repository, 'create')
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(clientDtoSaved);
      const result = await clientsRepository.create(clientDto).toPromise();
      expect(repository.findOne).lastCalledWith(referrer.id);
      expect(repository.findOne).toBeCalledTimes(1);
      expect(createSpy).toBeCalledWith({ ...clientDto });
      expect(saveSpy).toBeCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('save client without referrer ', async () => {

      const clientWithoutDto: ClientDto = {
        name: 'client test',
        rif: 'J-3041933-7',
      }

      jest.spyOn(repository, 'findOne')
      const createSpy = jest.spyOn(repository, 'create')
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(clientDtoSaved);
      const result = await clientsRepository.create(clientWithoutDto).toPromise();
      expect(repository.findOne).not.toBeCalled()
      expect(createSpy).toBeCalledWith({ ...clientWithoutDto });
      expect(saveSpy).toBeCalledTimes(1);
      expect(result.id).toBeDefined();
    });

    it('error trying to save with a referrer that does not exist  ', async () => {
      const createClient = {
        name: 'client test',
        rif: 'J-3041933-7',
        referrerId: idNoExist
      }
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)
      try {
        const result = await clientsRepository.create(createClient).toPromise();
      } catch (e) {
        expect(e).toBeDefined();
        expect(repository.findOne).lastCalledWith(idNoExist);
        expect(repository.findOne).toBeCalledTimes(1);
      }
    });
  });

  describe('get', () => {
    it('return one result', async () => {

      jest
        .spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved)

      const foundClient = await clientsRepository.get(clientDtoSaved.id).toPromise();
      expect(foundClient).toEqual(clientDtoSaved);
      expect(repository.findOne).lastCalledWith(clientDtoSaved.id);
      expect(repository.findOne).toBeCalledTimes(1);
    });

    it('return a null result', async () => {
      jest
        .spyOn(repository, 'findOne').mockResolvedValue(null)

      try {
        const foundClient = await clientsRepository.get(idNoExist).toPromise();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('getAll', () => {
    it('return one result', async () => {
      jest
        .spyOn(repository, 'find').mockResolvedValue([clientDtoSaved])
      const foundClient = await clientsRepository.getAll().toPromise();
      expect(foundClient).toEqual([clientDtoSaved]);
      expect(repository.find).lastCalledWith();
      expect(repository.find).toBeCalledTimes(1);
    });
  });

  describe('update', () => {

    it('return one result', async () => {

      jest
        .spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved)

      jest.spyOn(repository, 'update').mockResolvedValue(updateRes)

      const foundClient = await clientsRepository.update(clientDtoSaved.id, clientDto).toPromise();
      expect(foundClient.affected).toBe(1);
      expect(repository.findOne).lastCalledWith(clientDtoSaved.id);
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.update).lastCalledWith(clientDtoSaved.id, clientDto);
      expect(repository.update).toBeCalledTimes(1);
    });

    it('return a null result', async () => {
      jest
        .spyOn(repository, 'findOne').mockResolvedValue(null)
      try {
        const foundClient = await clientsRepository.update(100, clientDto).toPromise()
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('Delete', () => {

    it('return result delete', async () => {
      jest
        .spyOn(repository, 'delete').mockResolvedValue(deleteRes)

      const foundClient = await clientsRepository.delete(1).toPromise();
      expect(foundClient).toEqual(deleteRes);
      expect(repository.delete).lastCalledWith(1);
      expect(repository.delete).toBeCalledTimes(1);
    });

    it('return result delete', async () => {
      deleteRes.affected = 0;
      jest
        .spyOn(repository, 'delete').mockResolvedValue(deleteRes)

      const foundClient = await clientsRepository.delete(100).toPromise();
      expect(foundClient).toEqual(deleteRes);
      expect(repository.delete).lastCalledWith(100);
      expect(repository.delete).toBeCalledTimes(1);
    });
  });


});