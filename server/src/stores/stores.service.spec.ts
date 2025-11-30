/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access  */
import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from '../database/entities/store.entity';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StoreDto } from './dto/create-store.dto';
import { ProductsService } from '../products/products.service';

type MockRepository = Partial<Record<keyof Repository<Store>, jest.Mock>>;

const createMockRepository = (): MockRepository => ({
  findOneBy: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockProductsService = {
  findOne: jest.fn(),
  getProductInStore: jest.fn(),
};

describe('StoresService', () => {
  let service: StoresService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(Store),
          useValue: createMockRepository(),
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    repository = module.get<MockRepository>(getRepositoryToken(Store));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a store if found', async () => {
      const store: Store = { id: 1, name: 'Test Store', products: [] } as any;
      repository.findOneBy.mockResolvedValue(store);

      expect(await service.findOne(1)).toEqual(store);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw a NotFoundException if store is not found', async () => {
      repository.findOneBy.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const mockStores: Store[] = [{ id: 1, name: 'S1', products: [] }] as any;
    const mockCount = 1;

    it('should return paginated results', async () => {
      repository.findAndCount.mockResolvedValue([mockStores, mockCount]);
      const query = { limit: 10, offset: 0 };

      const result = await service.findAll(query.limit, query.offset);

      expect(result).toEqual({
        limit: 10,
        offset: 0,
        total: 1,
        results: mockStores,
      });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe('create', () => {
    it('should successfully create a store', async () => {
      const createDto: StoreDto = { name: 'New Store' };
      const store: Store = { id: 1, ...createDto, products: [] } as any;

      repository.create.mockReturnValue(store);
      repository.save.mockResolvedValue(store);

      expect(await service.create(createDto)).toEqual(store);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(store);
    });
  });

  describe('update', () => {
    it('should update an existing store', async () => {
      const existingStore: Store = {
        id: 1,
        name: 'Old Name',
        products: [],
      } as any;
      const updateDto: StoreDto = { name: 'New Name' };
      const updatedStore: Store = { ...existingStore, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingStore);
      repository.save.mockResolvedValue(updatedStore);

      expect(await service.update(1, updateDto)).toEqual(updatedStore);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedStore),
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing store and return the found store', async () => {
      const store: Store = { id: 1, name: 'Test Store', products: [] } as any;
      const deleteResult: DeleteResult = { affected: 1, raw: {} };

      jest.spyOn(service, 'findOne').mockResolvedValue(store);
      repository.delete.mockResolvedValue(deleteResult);

      expect(await service.delete(1)).toEqual(store);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('addProductToStore', () => {
    it('should add a product to a store if not already present', async () => {
      const storeId = 1;
      const productId = 101;
      const mockStore = {
        id: storeId,
        name: 'Test Store',
        products: [],
      } as any;
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockStore);
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockProductsService.getProductInStore.mockResolvedValue(undefined);

      const mockQueryBuilder = {
        relation: jest.fn().mockReturnThis(),
        of: jest.fn().mockReturnThis(),
        add: jest.fn().mockResolvedValue(undefined),
      };
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.addProductToStore(storeId, productId);

      expect(result).toEqual(mockProduct);
      expect(mockProductsService.getProductInStore).toHaveBeenCalledWith(
        productId,
        storeId,
      );
      expect(mockQueryBuilder.add).toHaveBeenCalledWith(productId);
    });

    it('should return the existing product if already in the store', async () => {
      const storeId = 1;
      const productId = 101;
      const mockStore = {
        id: storeId,
        name: 'Test Store',
        products: [],
      } as any;
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockStore);
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockProductsService.getProductInStore.mockResolvedValue(mockProduct);

      const result = await service.addProductToStore(storeId, productId);

      expect(result).toEqual(mockProduct);
      expect(repository.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('deleteProductFromStore', () => {
    it('should remove a product from a store', async () => {
      const storeId = 1;
      const productId = 101;
      const mockStore = {
        id: storeId,
        name: 'Test Store',
        products: [],
      } as any;
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockStore);
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockProductsService.getProductInStore.mockResolvedValue(mockProduct);

      const mockQueryBuilder = {
        relation: jest.fn().mockReturnThis(),
        of: jest.fn().mockReturnThis(),
        remove: jest.fn().mockResolvedValue(undefined),
      };
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.deleteProductFromStore(storeId, productId);

      expect(result).toEqual(mockProduct);
      expect(mockQueryBuilder.remove).toHaveBeenCalledWith(productId);
    });

    it('should throw BadRequestException if product is not assigned to store', async () => {
      const storeId = 1;
      const productId = 101;
      const mockStore = {
        id: storeId,
        name: 'Test Store',
        products: [],
      } as any;
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockStore);
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      mockProductsService.getProductInStore.mockResolvedValue(undefined);

      await expect(
        service.deleteProductFromStore(storeId, productId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAggregatedStockQuantity', () => {
    it('should return the total aggregated stock quantity', async () => {
      const storeId = 1;
      const mockStore = {
        id: storeId,
        name: 'Test Store',
        products: [],
      } as any;
      const rawQueryResult = { totalQty: '150' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockStore);

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(rawQueryResult),
      };
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAggregatedStockQuantity(storeId);

      expect(result).toBe(150);
      expect(service.findOne).toHaveBeenCalledWith(storeId);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'store.id = :storeId',
        { storeId },
      );
    });

    it('should return 0 if totalQty is null/undefined', async () => {
      const storeId = 1;
      const mockStore = {
        id: storeId,
        name: 'Test Store',
        products: [],
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockStore);

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      };
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAggregatedStockQuantity(storeId);

      expect(result).toBe(0);
    });
  });
});
