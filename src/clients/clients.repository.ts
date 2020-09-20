import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './model/client.entity';
import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { Client } from './model/client.interface';
import {
  ClientDto,
  ClientUpdateDto,
  PaginationInDto,
  paginationIntDefault,
} from './dtos';
import { Status } from '../shared/status.enum';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly _repository: Repository<ClientEntity>,
  ) {}

  getAll(
    pagination: PaginationInDto = paginationIntDefault,
  ): Observable<[Client[], number]> {
    return from(
      this._repository.findAndCount({
        where: { status: Status.ACTIVE },
        order: { name: 'DESC' },
        take: pagination.take,
        skip: pagination.skip,
        relations: ['referrer'],
      }),
    );
  }

  getAllByReferrer(
    name: string,
    pagination: PaginationInDto = paginationIntDefault,
  ): Observable<[Client[], number]> {
    name = name.toLowerCase();
    return from(
      this._repository
        .createQueryBuilder('c')
        .where(`LOWER("c"."name") like '%${name}%' `)
        .innerJoinAndSelect('c.referrers', 'refer')
        .offset(pagination.skip || 0)
        .limit(pagination.take || 10)
        .orderBy('"c"."name"')
        .getManyAndCount(),
    );
  }

  findOne(
    value: string | number,
    isRelation = true,
    relations: string[] = ['referrer'],
  ): Observable<Client> {
    const where = typeof value === 'string' ? { rif: value } : { id: value };
    return isRelation
      ? from(this._repository.findOne({ where: where, relations }))
      : from(this._repository.findOne({ where: where }));
  }

  saveClient(clientProspect: ClientDto): Observable<Client> {
    const client = this._repository.create(clientProspect);
    return from(this._repository.save(client));
  }

  update(
    id: number,
    clientProspect: ClientUpdateDto,
  ): Observable<UpdateResult> {
    return from(this._repository.update(id, clientProspect));
  }
}
