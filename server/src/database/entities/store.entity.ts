import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Store extends BaseEntity {
  @Column()
  name: string;
}
