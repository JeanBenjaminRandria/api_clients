import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Observable } from 'rxjs';
import { ClientDto } from './dtos';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ClientReadDto } from './dtos/client-read.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly _service: ClientsService) {}

  @Post()
  postCreate(@Body() clientProspec: ClientDto): Observable<ClientReadDto>{
    return this._service.create(clientProspec);
  } 

  @Get()
  getAllClients(): Observable<ClientReadDto[]> {
    return this._service.getAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe)id: number): Observable<ClientReadDto>{
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
