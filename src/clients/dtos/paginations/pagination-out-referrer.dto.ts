import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ClientReadReferrersDto } from '../clients/client-referrers.dto';

@Exclude()
export class PaginationOutReferrersDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  count: number;

  @ApiProperty()
  @Expose()
  @Type(() => ClientReadReferrersDto)
  clients: ClientReadReferrersDto[];
}
