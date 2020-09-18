import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ClientMinDto } from '../clients/client-min.dto';

@Exclude()
export class ReferrersDto {
  @ApiProperty()
  @Expose()
  // @IsOptional()
  @Type(() => ClientMinDto)
  referrers: ClientMinDto[];
}
