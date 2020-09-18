import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Raw, Repository } from 'typeorm';
import { Observable, from, of, throwError, merge, concat } from 'rxjs';
import { map, mergeMap, filter, distinct, tap } from 'rxjs/operators';
import { Client } from './client.interface';
import {
  ClientDto,
  ClientUpdateDto,
  MessageDto,
  PaginationClientsDto,
  PaginationInDto,
  paginationIntDefault,
} from './dtos';
import { Status } from './status.enum';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly _repository: Repository<ClientEntity>,
  ) {}

  getAll(
    pagination: PaginationInDto = paginationIntDefault,
  ): Observable<PaginationClientsDto> {
    return from(
      this._repository.findAndCount({
        where: { status: Status.ACTIVE },
        order: { name: 'DESC' },
        take: pagination.take,
        skip: pagination.skip,
        relations: ['referrer'],
      }),
    ).pipe(
      map(value => {
        return { count: value[1], clients: value[0] };
      }),
    );
  }

  getAllByReferrer(
    name: string,
    pagination: PaginationInDto = paginationIntDefault,
  ): Observable<PaginationClientsDto> {
    name = name.toLowerCase();
    return from(
      this._repository.findAndCount({
        where: { name: Raw(alias => `LOWER(${alias}) like '%${name}%'`) },
        take: pagination.take,
        skip: pagination.skip,
        order: { name: 'ASC' },
        relations: ['referrers'],
      }),
    ).pipe(
      map(value => {
        return { count: value[1], clients: value[0] };
      }),
    );
  }

  get(id: number): Observable<Client> {
    return this.validate(
      this.findOne(id),
      undefined,
      new NotFoundException(`Client has not been found`),
    );
  }

  private findOne(
    id: number,
    isRelation = true,
    relations: string[] = ['referrer'],
  ): Observable<Client> {
    return isRelation
      ? from(this._repository.findOne({ where: { id }, relations }))
      : from(this._repository.findOne({ where: { id } }));
  }

  private ValidateReferrerId(client: ClientDto): Observable<ClientEntity> {
    return of(client)
      .pipe(map(cli => cli.referrerId))
      .pipe(filter(id => id !== undefined))
      .pipe(
        mergeMap(id =>
          this.validate(
            from(this.findOne(id, false)),
            undefined,
            new BadRequestException('Referrer does not exist'),
          ),
        ),
      );
  }

  private validateRif(client: ClientDto): Observable<any> {
    return this.validate(
      from(this._repository.findOne({ rif: client.rif })),
      new BadRequestException('Client already exist'),
      undefined,
    );
  }

  create(clientProspect: ClientDto): Observable<any> {
    return concat(
      this.ValidateReferrerId(clientProspect),
      this.validateRif(clientProspect),
    )
      .pipe(distinct())
      .pipe(filter(val => val === undefined))
      .pipe(mergeMap(() => this.saveClient(clientProspect)));
  }

  private saveClient(clientProspect: ClientDto): Observable<Client> {
    const client = this._repository.create(clientProspect);
    return from(this._repository.save(client)).pipe(
      mergeMap(cli => this.get(cli.id)),
    );
  }

  update(id: number, clientProspect: ClientUpdateDto): Observable<Client> {
    return this.validate(
      this.findOne(id, false),
      undefined,
      new NotFoundException('Client has not been found'),
    )
      .pipe(mergeMap(() => this._repository.update(id, clientProspect)))
      .pipe(mergeMap(() => this.get(id)));
  }

  private validate<T>(
    obs: Observable<T>,
    errorFull?: HttpException,
    errorEmpty?: HttpException,
  ): Observable<any> {
    const exeption$ = errorFull
      ? throwError(errorFull)
      : throwError(errorEmpty);
    const empty = obs.pipe(filter(x => x === undefined));
    const full = obs.pipe(filter(x => x !== undefined));
    return merge(
      errorFull ? full.pipe(mergeMap(() => exeption$)) : full,
      errorEmpty ? empty.pipe(mergeMap(() => exeption$)) : empty,
    );
  }

  delete(id: number): Observable<MessageDto> {
    const find = this.findOne(id, false)
      .pipe(filter(cli => cli !== undefined))
      .pipe(
        map(cli => {
          cli.status = Status.INACTIVE;
          return cli;
        }),
      )
      .pipe(mergeMap(cli => from(this._repository.save(cli))))
      .pipe(mergeMap(() => of({ message: 'success' })));

    return find;
  }
}
