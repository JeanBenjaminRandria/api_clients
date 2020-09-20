import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { concat, from, merge, Observable, of, throwError } from 'rxjs';
import { distinct, filter, map, mergeMap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ClientsRepository } from './clients.repository';
import {
  ClientDto,
  ClientUpdateDto,
  ClientReadDto,
  ClientReadExDto,
  MessageDto,
  ClientReadReferrersDto,
  PaginationClientsReadDto,
  PaginationOutReferrersDto,
  PaginationClientsDto,
  PaginationInDto,
} from './dtos';
import { Client } from './model/client.interface';

@Injectable()
export class ClientsService {
  constructor(private readonly _repository: ClientsRepository) {}

  

  getAll(pagination?: PaginationInDto): Observable<PaginationClientsReadDto> {
    return this._repository.getAll(pagination).pipe(
      map(([clients, count]) => {
        return {
          count: count,
          clients: clients.map(cli => plainToClass(ClientReadDto, cli)),
        };
      }),
    );
  }

  getAllByReferrer(
    name: string,
    pagination?: PaginationInDto,
  ): Observable<PaginationOutReferrersDto> {
    return this._repository.getAllByReferrer(name, pagination)
    .pipe(
      map(([clients, count]) => {
        return {
          count: count,
          clients: clients.map(cli =>
            plainToClass(ClientReadReferrersDto, cli),
          ),
        };
      }),
    );
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

  get(id: number): Observable<ClientReadExDto> {

    return this.validate(
      this._repository.findOne(id),
      undefined,
      new NotFoundException(`Client has not been found`),
    )
    .pipe(map(client => plainToClass(ClientReadExDto, client)));

    // return this._repository
    //   .get(id)
    //   .pipe(map(client => plainToClass(ClientReadExDto, client)));
  }

  private ValidateReferrerId(client: ClientDto): Observable<Client> {
    return of(client)
      .pipe(map(cli => cli.referrerId))
      .pipe(filter(id => id !== undefined))
      .pipe(
        mergeMap(id =>
          this.validate(
            from(this._repository.findOne(id, false)),
            undefined,
            new BadRequestException('Referrer does not exist'),
          ),
        ),
      );
  }

  private validateRif(client: ClientDto): Observable<any> {
    return this.validate(
      from(this._repository.findOneRif(client.rif)),
      new BadRequestException('Client already exist'),
      undefined,
    );
  }

  create(clientProspect: ClientDto): Observable<ClientReadDto> {
    return concat(
      this.ValidateReferrerId(clientProspect),
      this.validateRif(clientProspect),
    )
      .pipe(distinct())
      .pipe(filter(val => val === undefined))
      .pipe(mergeMap(() => this._repository.saveClient(clientProspect)))
      .pipe( mergeMap(cli => this.get(cli.id)))
      .pipe(map(client => plainToClass(ClientReadDto, client)));
  }

  // create(clientProspec: ClientDto): Observable<ClientReadDto> {
  //   return this._repository
  //     .create(clientProspec)
  //     .pipe(map(client => plainToClass(ClientReadDto, client)));
  // }

  update(
    id: number,
    clientProspect: ClientUpdateDto,
  ): Observable<ClientReadExDto> {
    return this._repository
      .update(id, clientProspect)
      .pipe(map(cli => plainToClass(ClientReadExDto, cli)));
  }

  delete(id: number): Observable<MessageDto> {
    return this._repository.delete(id);
  }
}
