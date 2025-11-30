import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  FilterBy,
  PaginatedProductsQueryDto,
} from './dto/paginated-products-query.dto';

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

  private getValueByFilterBy(filterBy: FilterBy, filterValue: string) {
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
  }: PaginatedProductsQueryDto) {
    const [results, total] =
      filterBy && filterValue
        ? await this.productsRepository
            .createQueryBuilder('product')
            .innerJoin('product.stores', 'store')
            .where(`${this.getColumnByFilterBy(filterBy)} = :filterValue`, {
              filterValue: this.getValueByFilterBy(filterBy, filterValue),
            })
            .skip(offset)
            .take(limit)
            .getManyAndCount()
        : await this.productsRepository.findAndCount({
            skip: offset,
            take: limit,
          });

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
}
