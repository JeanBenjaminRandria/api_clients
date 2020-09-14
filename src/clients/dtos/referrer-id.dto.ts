import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

@Exclude()
export class ReferrerIdDto {
  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  @IsOptional()
  referrerId?: number;
}
