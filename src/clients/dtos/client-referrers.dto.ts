import { Exclude } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';
import { ClientMinDto } from './client-min.dto';
import { ReferrersDto } from './referrers.dto';

@Exclude()
export class ClientReadReferrersDto extends IntersectionType(
  ClientMinDto,
  ReferrersDto,
) {}
