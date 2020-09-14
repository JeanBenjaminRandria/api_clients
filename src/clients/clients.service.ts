import { Injectable } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { Observable } from 'rxjs';
import { ClientDto, ClientUpdateDto, ClientReadDto } from './dtos';
import { UpdateResult, DeleteResult } from 'typeorm';
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

  get(id: number): Observable<ClientReadDto> {
    return this._repository
      .get(id)
      .pipe(map(client => plainToClass(ClientReadDto, client)));
  }

  update(
    id: number,
    clientProspect: ClientUpdateDto,
  ): Observable<UpdateResult> {
    return this._repository.update(id, clientProspect);
  }

  delete(id: number): Observable<DeleteResult> {
    return this._repository.delete(id);
  }
}
