import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ClientDto } from './client.dtos';

@Exclude()
export class ClientUpdateDto extends PartialType(ClientDto) {}
