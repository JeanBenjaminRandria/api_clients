import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ClientEntity } from '../../model/client.entity';

@Exclude()
export class PaginationClientsDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  count: number;

  @ApiProperty()
  @Expose()
  @Type(() => ClientEntity)
  clients: ClientEntity[];
}
