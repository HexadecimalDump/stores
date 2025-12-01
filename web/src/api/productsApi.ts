// src/api/productsApi.ts

import api from './axios';
import {
  Product,
  PaginatedResponse,
  PaginationParams,
  CreateProductDto,
  UpdateProductDto,
} from './models';

export type ApiSortDirection = 'ASC' | 'DESC';

interface GetProductsParams extends PaginationParams {
  filterBy?: string;
  filterValue?: string;
  sortBy?: string;
  sortDirection?: ApiSortDirection;
}

export const getProducts = async (
  params: GetProductsParams,
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const createProduct = async (
  data: CreateProductDto,
): Promise<Product> => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductDto,
): Promise<Product> => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};
