import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

@Injectable()
export class ClientsService {
  constructor(private readonly _repository: ClientsRepository) {}

  create(clientProspec: ClientDto): Observable<ClientReadDto> {
    return this._repository
      .create(clientProspec)
      .pipe(map(client => plainToClass(ClientReadDto, client)));
  }

  getAll(pagination?: PaginationInDto): Observable<PaginationClientsReadDto> {
    return this._repository.getAll(pagination).pipe(
      map((value: PaginationClientsDto) => {
        return {
          count: value.count,
          clients: value.clients.map(cli => plainToClass(ClientReadDto, cli)),
        };
      }),
    );
  }

  getAllByReferrer(
    name: string,
    pagination?: PaginationInDto,
  ): Observable<PaginationOutReferrersDto> {
    return this._repository.getAllByReferrer(name, pagination).pipe(
      map((value: PaginationClientsDto) => {
        return {
          count: value.count,
          clients: value.clients.map(cli =>
            plainToClass(ClientReadReferrersDto, cli),
          ),
        };
      }),
    );
  }

  get(id: number): Observable<ClientReadExDto> {
    return this._repository
      .get(id)
      .pipe(map(client => plainToClass(ClientReadExDto, client)));
  }

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
