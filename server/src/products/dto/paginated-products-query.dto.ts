import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { PaginatedQueryDto } from 'src/shared/dto/paginated-query.dto';

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
}
