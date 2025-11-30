import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import {
  NAME_REGEXP,
  NAME_REGEXP_VALIDATION_MESSAGE,
} from '../../shared/constants/validation';

export class StoreDto {
  @IsString()
  @Matches(NAME_REGEXP, { message: NAME_REGEXP_VALIDATION_MESSAGE })
  @ApiProperty()
  name: string;
}
