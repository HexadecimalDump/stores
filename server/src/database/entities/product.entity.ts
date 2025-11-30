import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

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
}
