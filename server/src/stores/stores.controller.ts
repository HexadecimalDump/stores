import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Store } from 'src/database/entities/store.entity';
import { ApiOkResponsePaginated } from 'src/shared/decorators/api-ok-response-paginated';
import { PaginatedQueryDto } from 'src/shared/dto/paginated-query.dto';
import { StoreDto } from './dto/create-store.dto';
import { Product } from 'src/database/entities/product.entity';

@Controller('stores')
@ApiTags('Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @ApiOperation({ description: 'Get all stores' })
  @ApiOkResponsePaginated(Store)
  @Get()
  async getAll(@Query() { limit = 10, offset = 0 }: PaginatedQueryDto) {
    return this.storesService.findAll(limit, offset);
  }

  @ApiOperation({ description: 'Get store by id' })
  @ApiOkResponse({ type: Store })
  @Get('/:id')
  async getOneById(@Param('id') id: number): Promise<Store> {
    return this.storesService.findOne(id);
  }

  @ApiOperation({ description: 'Create store' })
  @ApiCreatedResponse({ type: Store })
  @Post()
  async create(@Body() body: StoreDto) {
    return this.storesService.create(body);
  }

  @ApiOperation({ description: 'Update store' })
  @ApiOkResponse({ type: Store })
  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: StoreDto) {
    return this.storesService.update(id, body);
  }

  @ApiOperation({ description: 'Delete store by id' })
  @ApiOkResponse({ type: Store })
  @Delete('/:id')
  async deleteOneById(@Param('id') id: number) {
    return this.storesService.delete(id);
  }

  @ApiOperation({ description: 'Add product ot store' })
  @ApiOkResponse({ type: Product })
  @Post('/:storeId/products/:productId')
  async addProductToStore(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
  ) {
    return this.storesService.addProductToStore(storeId, productId);
  }

  @ApiOperation({ description: 'Add product ot store' })
  @ApiOkResponse({ type: Product })
  @Delete('/:storeId/products/:productId')
  async deleteProductFromStore(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
  ) {
    return this.storesService.deleteProductFromStore(storeId, productId);
  }
}
