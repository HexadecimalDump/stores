import api from './axios';
import {
  Store,
  PaginatedResponse,
  PaginationParams,
  StoreDto,
  Product,
} from './models';

export const getStores = async (
  params: PaginationParams,
): Promise<PaginatedResponse<Store>> => {
  const response = await api.get('/stores', { params });
  return response.data;
};

export const getStoreById = async (id: number): Promise<Store> => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

export const createStore = async (data: StoreDto): Promise<Store> => {
  const response = await api.post('/stores', data);
  return response.data;
};

export const updateStore = async (
  id: number,
  data: StoreDto,
): Promise<Store> => {
  const response = await api.put(`/stores/${id}`, data);
  return response.data;
};

export const getStoreProductQuantity = async (id: number): Promise<number> => {
  const response = await api.get(`/stores/${id}/products-quantity`);
  return response.data.totalQty;
};

export const addProductToStore = async (
  storeId: number,
  productId: number,
): Promise<Product> => {
  const response = await api.post(`/stores/${storeId}/products/${productId}`);
  return response.data;
};

export const deleteProductFromStore = async (
  storeId: number,
  productId: number,
): Promise<Product> => {
  const response = await api.delete(`/stores/${storeId}/products/${productId}`);
  return response.data;
}; // Ensure Product and PaginatedResponse are imported

// ... (existing functions: getStores, getStoreById, createStore, updateStore, getStoreProductQuantity, addProductToStore, deleteProductFromStore) ...

export const getAvailableProductsForStore = async (
  storeId: number,
  params: PaginationParams = {},
): Promise<PaginatedResponse<Product>> => {
  // Uses the new specific endpoint
  const response = await api.get(`/stores/${storeId}/available-products`, {
    params,
  });
  return response.data;
};
