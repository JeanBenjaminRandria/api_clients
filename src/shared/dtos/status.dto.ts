import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Status } from '../status.enum';

@Exclude()
export class StatusDto {
  @ApiProperty({ enum: ['Active', 'Inactive'] })
  @Expose()
  @IsEnum(Status)
  status: string;
}
