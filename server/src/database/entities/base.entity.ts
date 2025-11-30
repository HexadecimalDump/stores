import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  deletedAt!: Date;
}
