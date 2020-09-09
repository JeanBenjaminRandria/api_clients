import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { Client } from './client.interface';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly _repository: Repository<ClientEntity>,
  ) {}

  getAll(): Observable<Client[]> {
    return from(this._repository.find());
  }
}
