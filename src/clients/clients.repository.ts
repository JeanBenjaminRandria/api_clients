import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { Injectable,  NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Observable, from,  of, EMPTY } from 'rxjs';
import { throwIfEmpty, flatMap } from "rxjs/operators";
import { Client } from './client.interface';
import { ClientDto } from './dtos';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly _repository: Repository<ClientEntity>,
  ) { }

  getAll(): Observable<Client[]> {
    return from(this._repository.find())
      
  }

  get(id: number): Observable<Client> {
    return from(this._repository.findOne(id)).pipe(
      flatMap(
        (p) => (p ? of(p) : EMPTY)),
        throwIfEmpty(() => new NotFoundException(`Client was not found`)),
    )
  }

  create(clientProspect: ClientDto): Observable<Client> {
    const client = this._repository.create(clientProspect);
    return from(this._repository.save(client))
  }

  update(id: number, clientProspect: ClientDto): Observable<UpdateResult> {
     return this.get(id).pipe(
      flatMap(() => {
        return from(this._repository.update(id, clientProspect))
        })
    )
  }

  delete(id: number): Observable<DeleteResult> {
    return from(this._repository.delete(id));
  }


}
