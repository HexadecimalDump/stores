import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';
import { StoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
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
}
