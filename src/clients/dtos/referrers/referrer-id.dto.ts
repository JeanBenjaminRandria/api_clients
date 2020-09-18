import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

@Exclude()
export class ReferrerIdDto {
  @ApiPropertyOptional({
    description: 'id of the client that brings other clients',
  })
  @Expose()
  @IsNumber()
  @IsOptional()
  referrerId?: number;
}
