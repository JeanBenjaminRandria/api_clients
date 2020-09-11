import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { Observable, of, EMPTY } from 'rxjs';
import { Client } from './client.interface';
import { ClientDto } from './dtos';
import { UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(private readonly _repository: ClientsRepository) {}

  create(clientProspec: ClientDto): Observable<Client>{
    return this._repository.create(clientProspec);
  } 

  getAll(): Observable<Client[]> {
    return this._repository.getAll();
  }

  get(id: number): Observable<Client>{
    return this._repository.get(id)
  }

  update(id: number, clientProspect: ClientDto): Observable<UpdateResult>{
     return this._repository.update(id, clientProspect)
     
  }

  delete(id: number): Observable<DeleteResult>{
    return this._repository.delete(id);
  }


}
