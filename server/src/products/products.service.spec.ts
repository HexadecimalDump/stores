/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterBy } from './dto/paginated-products-query.dto';
import { Product } from '../database/entities/product.entity';

// Type alias for the mocked repository
type MockRepository = Partial<Record<keyof Repository<Product>, jest.Mock>>;

// Create a mock repository object with jest spies
const createMockRepository = (): MockRepository => ({
  findOneBy: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<MockRepository>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = {
        id: 1,
        name: 'Test Product',
        price: 10,
      } as any;
      repository.findOneBy.mockResolvedValue(product);

      expect(await service.findOne(1)).toEqual(product);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw a NotFoundException if product is not found', async () => {
      repository.findOneBy.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'P1', price: 10 },
      { id: 2, name: 'P2', price: 20 },
    ] as any[];
    const mockCount = 2;

    it('should return paginated results without filters', async () => {
      repository.findAndCount.mockResolvedValue([mockProducts, mockCount]);
      const query = { limit: 2, offset: 0 };

      const result = await service.findAll(query);

      expect(result).toEqual({
        limit: 2,
        offset: 0,
        total: 2,
        results: mockProducts,
      });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
      });
    });

    it('should return paginated results with storeId filter', async () => {
      const query = {
        limit: 10,
        offset: 0,
        filterBy: FilterBy.StoreId,
        filterValue: '101',
        filterInequality: false,
      };

      // Mock the QueryBuilder chain
      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockProducts, mockCount]),
      };
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(query);

      expect(result).toEqual({
        limit: 10,
        offset: 0,
        total: 2,
        results: mockProducts,
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'product.stores',
        'store',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'store.id = :filterValue',
        { filterValue: 101 },
      );
    });
  });

  describe('create', () => {
    it('should successfully create a product', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        price: 50,
      } as any;
      const product: Product = { id: 1, ...createDto } as any;

      repository.create.mockReturnValue(product);
      repository.save.mockResolvedValue(product);

      expect(await service.create(createDto)).toEqual(product);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const existingProduct: Product = {
        id: 1,
        name: 'Old Name',
        price: 10,
      } as any;
      const updateDto: UpdateProductDto = { name: 'New Name' };
      const updatedProduct: Product = { ...existingProduct, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingProduct);
      repository.save.mockResolvedValue(updatedProduct);

      expect(await service.update(1, updateDto)).toEqual(updatedProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedProduct),
      );
    });

    it('should throw NotFoundException if product to update is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(999, { name: 'test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing product and return the found product', async () => {
      const product: Product = {
        id: 1,
        name: 'Test Product',
        price: 10,
      } as any;
      const deleteResult: DeleteResult = { affected: 1, raw: {} };

      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      repository.delete.mockResolvedValue(deleteResult);

      expect(await service.delete(1)).toEqual(product);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getProductInStore', () => {
    it('should return a product if found in the specified store', async () => {
      const productId = 1;
      const storeId = 101;
      const productInStore: Product = {
        id: productId,
        name: 'Test Product',
        price: 10,
      } as any;

      const mockQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(productInStore),
      };
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getProductInStore(productId, storeId);

      expect(result).toEqual(productInStore);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'product.id = :productId',
        { productId },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'store.id = :storeId',
        { storeId },
      );
    });
  });

  describe('Private Helpers', () => {
    it('getColumnByFilterBy should throw BadRequestException for invalid filterBy', () => {
      expect(() => service['getColumnByFilterBy']('invalid' as any)).toThrow(
        BadRequestException,
      );
    });

    it('getFilterValueByFilterBy should handle default string return for invalid filterBy', () => {
      expect(
        service['getFilterValueByFilterBy']('invalid' as any, 'value'),
      ).toEqual('value');
    });
  });
});
