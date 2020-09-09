import { Injectable } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { Observable } from 'rxjs';
import { Client } from './client.interface';

@Injectable()
export class ClientsService {
  constructor(private readonly _repository: ClientsRepository) {}

  getAll(): Observable<Client[]> {
    return this._repository.getAll();
  }
}
