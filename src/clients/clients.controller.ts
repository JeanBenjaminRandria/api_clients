import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import {
  ClientDto,
  ClientUpdateDto,
  ClientReadDto,
  ClientReadExDto,
  PaginationClientsReadDto,
  PaginationOutReferrersDto,
} from './dtos';
import { MessageDto } from '../shared';

@ApiTags('Client')
@Controller('clients')
export class ClientsController {
  constructor(private readonly _service: ClientsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ClientReadDto,
  })
  postCreate(@Body() clientProspec: ClientDto): Observable<ClientReadDto> {
    return this._service.create(clientProspec);
  }

  @ApiParam({ name: 'take', required: false })
  @ApiParam({ name: 'skip', required: false })
  @Get('all/:take?/:skip?')
  @ApiCreatedResponse({
    description: 'Get all clients actives',
    type: [PaginationClientsReadDto],
  })
  getAllClients(
    @Param('take') take?: number,
    @Param('skip') skip?: number,
  ): Observable<PaginationClientsReadDto> {
    return this._service.getAll({ take, skip });
  }

  @Get('/referrer/:name/:take?/:skip?')
  @ApiParam({ name: 'take', required: false })
  @ApiParam({ name: 'skip', required: false })
  @ApiParam({ name: 'name', required: true })
  @ApiCreatedResponse({
    description: 'Get all clients actives by referrer',
    type: [PaginationOutReferrersDto],
  })
  getAllByReferrer(
    @Param('name') name: string,
    @Param('take') take?: number,
    @Param('skip') skip?: number,
  ): Observable<PaginationOutReferrersDto> {
    return this._service.getAllByReferrer(name, { take, skip });
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiCreatedResponse({
    description:
      'Get one client by id, if it does not find a NoFOUND error will be returned',
    type: ClientReadExDto,
  })
  get(@Param('id', ParseIntPipe) id: number): Observable<ClientReadExDto> {
    return this._service.get(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiBody({
    description: 'List of cats',
    type: ClientUpdateDto,
    required: true,
  })
  @ApiCreatedResponse({
    description:
      'modify client by id, only name rif or referrerId, if it does not find a NoFOUND error will be returned',
    type: ClientReadExDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() clientProspect: Partial<ClientUpdateDto>,
  ): Observable<ClientReadExDto> {
    return this._service.update(id, clientProspect);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiCreatedResponse({
    description: 'modify status client by id',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  delete(@Param('id', ParseIntPipe) id: number): Observable<MessageDto> {
    return this._service.delete(id);
  }
}
