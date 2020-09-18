import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ClientMinDto } from './client-min.dto';

@Exclude()
export class ClientMicroDto extends OmitType(ClientMinDto, ['id'] as const) {}
