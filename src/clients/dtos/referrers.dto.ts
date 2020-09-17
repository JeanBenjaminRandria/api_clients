import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ClientMinDto } from './client-min.dto';

@Exclude()
export class ReferrersDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @Type(() => ClientMinDto)
  referrers?: ClientMinDto[];
}
