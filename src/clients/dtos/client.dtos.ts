import { Exclude } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';
import { ClientMicroDto } from './client-micro.dto';
import { ReferrerIdDto } from './referrer-id.dto';

@Exclude()
export class ClientDto extends IntersectionType(
  ClientMicroDto,
  ReferrerIdDto,
) {}
