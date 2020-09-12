import { BaseEntity } from '../database/entities/base.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('varchar', { unique: true, length: 15, nullable: false })
  rif: string;

  @OneToMany(type => ClientEntity, client => client.referrer)
  referrers?: ClientEntity[];

  @Column()
  referrerId: number;

  @ManyToOne( type => ClientEntity, client => client.referrers, {eager: true})
  @JoinColumn({name: 'referrerId'})
  referrer?: ClientEntity;

}
