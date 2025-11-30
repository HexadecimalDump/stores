import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginatedQueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => +value)
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => +value)
  @IsInt()
  @IsOptional()
  offset?: number;
}
