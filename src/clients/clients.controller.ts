import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './client.interface';
import { Observable } from 'rxjs';
import { ClientDto } from './dtos';
import { UpdateResult, DeleteResult } from 'typeorm';

@Controller('clients')
export class ClientsController {
  constructor(private readonly _service: ClientsService) {}

  @Post()
  postCreate(@Body() clientProspec: ClientDto): Observable<Client>{
    return this._service.create(clientProspec);
  } 

  @Get()
  getAllClients(): Observable<Client[]> {
    return this._service.getAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe)id: number): Observable<Client>{
    return this._service.get(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() clientProspect: ClientDto): Observable<UpdateResult>{
    return this._service.update(id, clientProspect);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Observable<DeleteResult>{
    return this._service.delete(id);
  }
}
