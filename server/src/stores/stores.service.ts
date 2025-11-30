import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';
import { StoreDto } from './dto/create-store.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(limit: number, offset: number) {
    const [results, total] = await this.storesRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return { limit, offset, total, results };
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storesRepository.findOneBy({ id });

    if (!store) throw new NotFoundException('Could not find store');

    return store;
  }

  async create(body: StoreDto) {
    const store = this.storesRepository.create(body);

    await this.storesRepository.save(store);

    return store;
  }

  async update(id: number, body: StoreDto) {
    const store = await this.findOne(id);

    store.name = body.name;

    const updatedStore = await this.storesRepository.save(store);

    return updatedStore;
  }

  async delete(id: number) {
    const store = await this.findOne(id);

    await this.storesRepository.delete({ id });

    return store;
  }

  async addProductToStore(storeId: number, productId: number) {
    const store = await this.findOne(storeId);

    const product = await this.productsService.findOne(productId);

    const productInStore = await this.productsService.getProductInStore(
      product.id,
      store.id,
    );

    if (productInStore) return productInStore;

    await this.storesRepository
      .createQueryBuilder()
      .relation(Store, 'products')
      .of(storeId)
      .add(productId);

    return product;
  }

  async deleteProductFromStore(storeId: number, productId: number) {
    const store = await this.findOne(storeId);

    const product = await this.productsService.findOne(productId);

    const productInStore = await this.productsService.getProductInStore(
      product.id,
      store.id,
    );

    if (!productInStore)
      throw new BadRequestException('Product is not assigned to store');

    await this.storesRepository
      .createQueryBuilder()
      .relation(Store, 'products')
      .of(storeId)
      .remove(productId);

    return product;
  }

  async getAggregatedStockQuantity(storeId: number): Promise<number> {
    await this.findOne(storeId);

    const result = await this.storesRepository
      .createQueryBuilder('store')
      .leftJoin('store.products', 'product')
      .select('store.*')
      .addSelect('SUM(product.qty)', 'totalQty')
      .where('store.id = :storeId', { storeId })
      .groupBy('store.id')
      .getRawOne<{ totalQty: string }>();

    const totalQty = Number(result?.totalQty) || 0;

    return totalQty;
  }
}
