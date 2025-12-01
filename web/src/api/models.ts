export interface PaginatedResponse<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}

export interface Store {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
}

export type StoreDto = Omit<
  Store,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export interface Product {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  category: string;
  price: number;
  qty: number;
}

export type CreateProductDto = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdateProductDto = CreateProductDto;

export interface PaginationParams {
  limit?: number;
  offset?: number;
}
