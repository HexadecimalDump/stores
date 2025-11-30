import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Matches, Min } from 'class-validator';
import {
  NAME_REGEXP,
  NAME_REGEXP_VALIDATION_MESSAGE,
} from '../../shared/constants/validation';

export class CreateProductDto {
  @IsString()
  @Matches(NAME_REGEXP, { message: NAME_REGEXP_VALIDATION_MESSAGE })
  @ApiProperty()
  name: string;

  @IsString()
  @Matches(NAME_REGEXP, { message: NAME_REGEXP_VALIDATION_MESSAGE })
  @ApiProperty()
  category: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  qty: number;
}
