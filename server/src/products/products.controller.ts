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
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ApiOkResponsePaginated } from '../shared/decorators/api-ok-response-paginated';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProductsQueryDto } from './dto/paginated-products-query.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ description: 'Get all products' })
  @ApiOkResponsePaginated(Product)
  @Get()
  async getAll(@Query() query: PaginatedProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @ApiOperation({ description: 'Get product by id' })
  @ApiOkResponse({ type: Product })
  @Get('/:id')
  async getOneById(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ description: 'Create product' })
  @ApiCreatedResponse({ type: Product })
  @Post()
  async create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @ApiOperation({ description: 'Update product' })
  @ApiOkResponse({ type: Product })
  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @ApiOperation({ description: 'Delete product by id' })
  @ApiAcceptedResponse()
  @Delete('/:id')
  async deleteOneById(@Param('id') id: number) {
    return this.productsService.delete(id);
  }
}
