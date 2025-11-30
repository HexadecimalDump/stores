/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProductsQueryDto } from './dto/paginated-products-query.dto';

// Mock implementation of the ProductsService
const mockProductsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a paginated list of products', async () => {
      const result = {
        results: [{ id: 1, name: 'Test Product', price: 10 }],
      } as any;
      const queryDto: PaginatedProductsQueryDto = { offset: 1, limit: 10 };

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAll(queryDto)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('getOneById', () => {
    it('should return a single product by ID', async () => {
      const result = { id: 1, name: 'Test Product', price: 10 } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.getOneById(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto = { name: 'New Product', price: 20 } as any;
      const result = { id: 2, ...createDto };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateDto: UpdateProductDto = { price: 25 };
      const result = { id: 1, name: 'Test Product', price: 25 } as any;
      const productId = 1;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(productId, updateDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(productId, updateDto);
    });
  });

  describe('deleteOneById', () => {
    it('should delete a product by ID', async () => {
      const result = { affected: 1 } as any;
      const productId = 1;

      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.deleteOneById(productId)).toBe(result);
      expect(service.delete).toHaveBeenCalledWith(productId);
    });
  });
});
