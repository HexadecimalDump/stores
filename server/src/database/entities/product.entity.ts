import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from './store.entity';

@Entity()
export class Product extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  category: string;

  @Column('real')
  @ApiProperty()
  price: number;

  @Column('integer')
  @ApiProperty()
  qty: number;

  @ManyToMany(() => Store, (store) => store.products)
  stores: Store[];
}
