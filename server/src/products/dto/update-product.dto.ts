import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import {
  NAME_REGEXP,
  NAME_REGEXP_VALIDATION_MESSAGE,
} from '../../shared/constants/validation';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @Matches(NAME_REGEXP, { message: NAME_REGEXP_VALIDATION_MESSAGE })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @Matches(NAME_REGEXP, { message: NAME_REGEXP_VALIDATION_MESSAGE })
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  qty?: number;
}
