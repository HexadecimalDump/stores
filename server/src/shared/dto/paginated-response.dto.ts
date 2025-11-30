import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty({ isArray: true })
  readonly results: T[];

  constructor(props) {
    Object.assign(this, props);
  }
}
