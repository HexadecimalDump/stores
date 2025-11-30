import { Controller, Get, Param } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('stores')
@ApiTags('Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @ApiOperation({ description: 'Get all stores' })
  @Get()
  async getAll() {
    return this.storesService.findAll();
  }

  @ApiOperation({ description: 'Get store by id' })
  @Get('/:id')
  async getOneById(@Param('id') id: number) {
    return this.storesService.findOne(id);
  }
}
