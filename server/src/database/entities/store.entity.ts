import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class Store extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @ManyToMany(() => Product, (product) => product.stores)
  @JoinTable()
  products: Product[];
}
