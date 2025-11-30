import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { PaginatedQueryDto } from '../../shared/dto/paginated-query.dto';

export enum FilterBy {
  StoreId = 'StoreId',
}

export class PaginatedProductsQueryDto extends PaginatedQueryDto {
  @ApiProperty({ required: false, examples: FilterBy })
  @IsEnum(FilterBy)
  @ValidateIf(({ filterValue }) => Boolean(filterValue))
  filterBy?: FilterBy;

  @ApiProperty({ required: false })
  @IsString()
  @ValidateIf(({ filterBy }) => Boolean(filterBy))
  filterValue?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;

    return false;
  })
  @ValidateIf(({ filterBy }) => Boolean(filterBy))
  @IsOptional()
  filterInequality?: boolean;
}
