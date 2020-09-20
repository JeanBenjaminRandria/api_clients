import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../model/client.interface';
import { ClientsRepository } from '../clients.repository';
import { ClientEntity } from '../model/client.entity';
import {
  clientDto,
  clientDtoSaved,
  idNoExist,
  updateRes,
  referrer,
  referrerDtoSaved,
} from './data-test';
import { ClientUpdateDto } from '../dtos';
import { Status } from '../../shared/status.enum';

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
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn,
            delete: jest.fn,
            createQueryBuilder: jest.fn(() => ({
              innerJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getManyAndCount: jest
                .fn()
                .mockResolvedValue([[referrerDtoSaved], 1]),
            })),
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
      jest.spyOn(repository, 'create')
      jest.spyOn(repository, 'save').mockResolvedValueOnce(clientDtoSaved);
      const result = await clientsRepository.saveClient(clientDto).toPromise();
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result.id).toBeDefined();
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
    it('return all clients', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([[clientDtoSaved], 1]);
      const [clientsGet, count] = await clientsRepository.getAll().toPromise();
      expect(count).toBe(1);
      expect(clientsGet).toEqual([clientDtoSaved]);
      expect(repository.findAndCount).lastCalledWith({
        where: { status: Status.ACTIVE },
        order: { name: 'DESC' },
        take: 10,
        skip: 0,
        relations: ['referrer'],
      });
      expect(repository.findAndCount).toBeCalledTimes(1);
    });
  });

  describe('getAllByReferrerName', () => {
    it('return all referrers result', async () => {
      const name = referrer.name.slice(0, -3);
      jest.spyOn(repository, 'createQueryBuilder');
      const [clientsGet, count] = await clientsRepository
        .getAllByReferrer(name)
        .toPromise();
      expect(count).toBe(1);
      expect(clientsGet).toEqual([referrerDtoSaved]);
      expect(repository.createQueryBuilder).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('return one result', async () => {
      const clientUp: ClientUpdateDto = {
        name: 'client updated',
      };
      // jest.spyOn(repository, 'findOne').mockResolvedValue(clientDtoSaved);
      jest.spyOn(repository, 'update').mockResolvedValue(updateRes);
      await clientsRepository.update(clientDtoSaved.id, clientUp).toPromise();
      // expect(repository.findOne).lastCalledWith({
      //   relations: ['referrer'],
      //   where: { id: clientDtoSaved.id },
      // });
      // expect(repository.findOne).toBeCalledTimes(2);
      expect(repository.update).lastCalledWith(clientDtoSaved.id, clientUp);
      expect(repository.update).toBeCalledTimes(1);
    });

    // it('return a null result', async () => {
    //   jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
    //   try {
    //     await clientsRepository.update(100, clientDto).toPromise();
    //   } catch (e) {
    //     expect(e).toBeDefined();
    //   }
    // });
  });

  // describe('Delete', () => {
  //   it('Delete with id no found', async () => {
  //     const find = jest
  //       .spyOn(repository, 'findOne')
  //       .mockResolvedValue(undefined);
  //     const saved = jest.spyOn(repository, 'save').mockResolvedValue(undefined);
  //     let foundClient;
  //     clientsRepository.delete(1).subscribe({
  //       next: x => {
  //         foundClient = x;
  //       },
  //     });
  //     // const foundClient = await clientsRepository.delete(1).toPromise();
  //     expect(foundClient).toEqual(undefined);
  //     expect(find).toHaveBeenCalledTimes(1);
  //     expect(saved).not.toBeCalled();
  //   });

  //   it('return result delete', async () => {
  //     const find = jest
  //       .spyOn(repository, 'findOne')
  //       .mockResolvedValue(clientDtoSaved);
  //     const saved = jest
  //       .spyOn(repository, 'save')
  //       .mockResolvedValue(clientDtoSaved);
  //     // clientsRepository.delete(1).subscribe()
  //     const foundClient = await clientsRepository.delete(1).toPromise();
  //     expect(foundClient).toEqual({ message: 'success' });
  //     expect(find).toHaveBeenCalledTimes(1);
  //     expect(saved).toHaveBeenCalledTimes(1);
  //   });
  // });
});
