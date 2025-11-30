import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  findAll() {
    return this.storesRepository.find();
  }

  findOne(id: number): Promise<Store | null> {
    return this.storesRepository.findOneBy({ id });
  }
}
