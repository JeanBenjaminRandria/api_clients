import { IsString, MaxLength, IsNumber, Matches } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ClientMinDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @Expose()
  @MaxLength(13)
  @Matches(/^[JGVEP][-][0-9]{9}[-][0-9]{1}$/)
  rif: string;
}
