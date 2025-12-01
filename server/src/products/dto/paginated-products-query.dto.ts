import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { PaginatedQueryDto } from '../../shared/dto/paginated-query.dto';

export enum FilterBy {
  StoreId = 'StoreId',
}

export enum SortBy {
  ID = 'ID',
  Name = 'Name',
  Category = 'Category',
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
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

  @ApiProperty({ required: false, examples: SortBy })
  @IsEnum(SortBy)
  @ValidateIf(({ sortDirection }) => Boolean(sortDirection))
  sortBy?: SortBy;

  @ApiProperty({ required: false })
  @IsString()
  @ValidateIf(({ sortBy }) => Boolean(sortBy))
  sortDirection?: SortDirection;
}
