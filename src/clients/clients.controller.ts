import { Controller, Get } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './client.interface';
import { Observable } from 'rxjs';

@Controller('clients')
export class ClientsController {
  constructor(private readonly _service: ClientsService) {}

  @Get()
  getAllClients(): Observable<Client[]> {
    return this._service.getAll();
  }
}
