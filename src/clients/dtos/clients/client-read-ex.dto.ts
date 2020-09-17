import { Exclude } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';
import { ClientReadDto } from './client-read.dto';
import { StatusDto } from '../status.dto';

@Exclude()
export class ClientReadExDto extends IntersectionType(
  ClientReadDto,
  StatusDto,
) {}
