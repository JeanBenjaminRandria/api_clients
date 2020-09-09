import { BaseEntity } from '../database/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('varchar', { unique: true, length: 15, nullable: false })
  rif: string;
}
