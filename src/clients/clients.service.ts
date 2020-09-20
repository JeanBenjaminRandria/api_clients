import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { concat, from, merge, Observable, of, throwError } from 'rxjs';
import { distinct, filter, map, mergeMap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ClientsRepository } from './clients.repository';
import {
  ClientDto,
  ClientUpdateDto,
  ClientReadDto,
  ClientReadExDto,
  ClientReadReferrersDto,
  PaginationClientsReadDto,
  PaginationOutReferrersDto,
  PaginationInDto,
} from './dtos';
import { Client } from './model/client.interface';
import { Status, MessageDto } from '../shared';
import { ErrorMessage } from './errors.enum';

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
    return this._repository.getAllByReferrer(name, pagination).pipe(
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
    ).pipe(map(client => plainToClass(ClientReadExDto, client)));
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
            new BadRequestException(ErrorMessage.REFERRER_NOT_FOUND),
          ),
        ),
      );
  }

  private validateRif(client: ClientDto): Observable<any> {
    return this.validate(
      from(this._repository.findOne(client.rif)),
      new BadRequestException(ErrorMessage.CLIENT_ALREADY_EXIST),
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
      .pipe(mergeMap(cli => this.get(cli.id)))
      .pipe(map(client => plainToClass(ClientReadDto, client)));
  }

  update(
    id: number,
    clientProspect: ClientUpdateDto,
  ): Observable<ClientReadExDto> {
    return this.validate(
      this._repository.findOne(id, false),
      undefined,
      new NotFoundException(ErrorMessage.CLIENT_NOT_FOUND),
    )
      .pipe(mergeMap(() => this._repository.update(id, clientProspect)))
      .pipe(mergeMap(() => this.get(id)));
  }

  delete(id: number): Observable<MessageDto> {
    const find = this._repository
      .findOne(id, false)
      .pipe(filter(cli => cli !== undefined))
      .pipe(
        map(cli => {
          cli.status = Status.INACTIVE;
          return cli;
        }),
      )
      .pipe(mergeMap(cli => from(this._repository.saveClient(cli))))
      .pipe(mergeMap(() => of({ message: 'success' })));

    return find;
  }
}
