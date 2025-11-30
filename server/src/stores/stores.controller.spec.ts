/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Store } from '../database/entities/store.entity';
import { StoreDto } from './dto/create-store.dto';
import { PaginatedQueryDto } from '../shared/dto/paginated-query.dto';

const mockStoresService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addProductToStore: jest.fn(),
  deleteProductFromStore: jest.fn(),
  getAggregatedStockQuantity: jest.fn(),
};

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: mockStoresService,
        },
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a paginated list of stores', async () => {
      const result = {
        results: [{ id: 1, name: 'Test Store', products: [] }] as any[],
        meta: { total: 1, limit: 10, offset: 0 },
      } as any;
      const queryDto: PaginatedQueryDto = { limit: 10, offset: 0 };

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAll(queryDto)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(10, 0);
    });
  });

  describe('getOneById', () => {
    it('should return a single store by ID', async () => {
      const result: Store = { id: 1, name: 'Test Store', products: [] } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.getOneById(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new store', async () => {
      const createDto: StoreDto = { name: 'New Store' };
      const result: Store = { id: 2, ...createDto, products: [] } as any;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing store', async () => {
      const updateDto: StoreDto = { name: 'Updated Name' };
      const result: Store = {
        id: 1,
        name: 'Updated Name',
        products: [],
      } as any;
      const storeId = 1;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(storeId, updateDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(storeId, updateDto);
    });
  });

  describe('deleteOneById', () => {
    it('should delete a store by ID', async () => {
      const result: Store = {
        id: 1,
        name: 'Deleted Store',
        products: [],
      } as any;

      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.deleteOneById(1)).toBe(result);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('addProductToStore', () => {
    it('should add a product to a store', async () => {
      const storeId = 1;
      const productId = 101;
      const result = {
        id: productId,
        name: 'Test Product',
        price: 10,
      } as any;

      jest.spyOn(service, 'addProductToStore').mockResolvedValue(result);

      expect(await controller.addProductToStore(storeId, productId)).toBe(
        result,
      );
      expect(service.addProductToStore).toHaveBeenCalledWith(
        storeId,
        productId,
      );
    });
  });

  describe('deleteProductFromStore', () => {
    it('should delete a product from a store', async () => {
      const storeId = 1;
      const productId = 101;
      const result = {
        id: productId,
        name: 'Test Product',
        price: 10,
      } as any;

      jest.spyOn(service, 'deleteProductFromStore').mockResolvedValue(result);

      expect(await controller.deleteProductFromStore(storeId, productId)).toBe(
        result,
      );
      expect(service.deleteProductFromStore).toHaveBeenCalledWith(
        storeId,
        productId,
      );
    });
  });

  describe('getTotalProductsQuantity', () => {
    it('should return the total quantity wrapped in an object', async () => {
      const storeId = 1;
      const totalQty = 150;

      jest
        .spyOn(service, 'getAggregatedStockQuantity')
        .mockResolvedValue(totalQty);

      const result = await controller.getTotalProductsQuantity(storeId);

      expect(result).toEqual({ totalQty });
      expect(service.getAggregatedStockQuantity).toHaveBeenCalledWith(storeId);
    });
  });
});
