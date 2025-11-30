import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Store extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;
}
