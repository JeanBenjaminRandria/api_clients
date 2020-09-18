import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

@Exclude()
export class PaginationInDto {
  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  @IsOptional()
  take?: number;

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  @IsOptional()
  skip?: number;
}

export const paginationIntDefault: PaginationInDto = {
  take: 10,
  skip: 0,
};
