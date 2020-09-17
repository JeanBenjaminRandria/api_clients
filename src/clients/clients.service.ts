import { Injectable } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { Observable } from 'rxjs';
import {
  ClientDto,
  ClientUpdateDto,
  ClientReadDto,
  ClientReadExDto,
  MessageDto,
  ClientReadReferrersDto,
} from './dtos';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ClientsService {
  constructor(private readonly _repository: ClientsRepository) {}

  create(clientProspec: ClientDto): Observable<ClientReadDto> {
    return this._repository
      .create(clientProspec)
      .pipe(map(client => plainToClass(ClientReadDto, client)));
  }

  getAll(): Observable<ClientReadDto[]> {
    return this._repository
      .getAll()
      .pipe(map(client => plainToClass(ClientReadDto, client)));
  }

  getAllByReferrer(name: string): Observable<ClientReadReferrersDto[]> {
    return this._repository
      .getAllByReferrer(name)
      .pipe(map(client => plainToClass(ClientReadReferrersDto, client)));
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
