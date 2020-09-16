import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ClientMinDto } from './client-min.dto';

@Exclude()
export class ReferrersDto {
  @Expose()
  @IsOptional()
  @Type(() => ClientMinDto)
  referrers?: ClientMinDto[];
}
