import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(limit: number, offset: number) {
    const [results, total] = await this.productsRepository.findAndCount({
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
}
