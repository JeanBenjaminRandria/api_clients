import { Exclude } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';
import { ClientMinDto } from './client-min.dto';
import { ReferrerDto } from '../referrers/referrer.dto';

@Exclude()
export class ClientReadDto extends IntersectionType(
  ClientMinDto,
  ReferrerDto,
) {}
