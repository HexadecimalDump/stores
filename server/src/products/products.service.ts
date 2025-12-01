import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  FilterBy,
  PaginatedProductsQueryDto,
  SortBy,
  SortDirection,
} from './dto/paginated-products-query.dto';
import { PaginatedQueryDto } from 'src/shared/dto/paginated-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  private getColumnByFilterBy(filterBy: FilterBy) {
    switch (filterBy) {
      case FilterBy.StoreId:
        return 'store.id';
      default:
        throw new BadRequestException('Invalid product filterBy');
    }
  }

  private getFilterValueByFilterBy(filterBy: FilterBy, filterValue: string) {
    switch (filterBy) {
      case FilterBy.StoreId:
        return +filterValue;
      default:
        return filterValue;
    }
  }

  async findAll({
    limit = 10,
    offset = 0,
    filterBy,
    filterValue,
    sortBy = SortBy.ID,
    sortDirection = SortDirection.Asc,
  }: PaginatedProductsQueryDto) {
    let query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.stores', 'store');

    if (filterBy && filterValue)
      query = query.where(
        `${this.getColumnByFilterBy(filterBy)} = :filterValue`,
        {
          filterValue: this.getFilterValueByFilterBy(filterBy, filterValue),
        },
      );

    const [results, total] = await query
      .skip(offset)
      .take(limit)
      .orderBy(`product.${sortBy.toLowerCase()}`, sortDirection)
      .getManyAndCount();

    return { limit, offset, total, results };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Could not find product');

    return product;
  }

  async create(body: CreateProductDto) {
    const product = this.productsRepository.create(body);

    await this.productsRepository.save(product);

    return product;
  }

  async update(id: number, body: UpdateProductDto) {
    let product = await this.findOne(id);

    product = Object.assign(
      product,
      Object.fromEntries(
        Object.entries(body).filter(([, value]) => Boolean(value)),
      ),
    );

    const updatedProduct = await this.productsRepository.save(product);

    return updatedProduct;
  }

  async delete(id: number) {
    const product = await this.findOne(id);

    await this.productsRepository.delete({ id });

    return product;
  }

  async getProductInStore(productId: number, storeId: number) {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.stores', 'store')
      .where('product.id = :productId', { productId })
      .andWhere('store.id = :storeId', { storeId })
      .getOne();

    return product;
  }

  async findProductsNotInStore(
    storeId: number,
    { limit = 10, offset = 0 }: PaginatedQueryDto,
  ) {
    const assignedProductsSubquery = this.productsRepository
      .createQueryBuilder('product')
      .select('product.id')
      .innerJoin('product.stores', 'store', 'store.id = :storeId', { storeId });

    const [results, total] = await this.productsRepository
      .createQueryBuilder('product')
      .where(`product.id NOT IN (${assignedProductsSubquery.getQuery()})`)
      .setParameters(assignedProductsSubquery.getParameters())
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { limit, offset, total, results };
  }
}
