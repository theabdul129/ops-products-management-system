import { api } from './http';
import type { Paginated, Product, ProductOwner, ProductStatus } from '../types';

export type ListProductsParams = {
  q?: string;
  sku?: string;
  ownerId?: string;
  status?: ProductStatus;
  sortBy?: 'name' | 'price' | 'inventory' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export async function getOwners() {
  const { data } = await api.get<ProductOwner[]>('/owners');
  return data;
}

export async function listProducts(params: ListProductsParams) {
  const { data } = await api.get<Paginated<Product>>('/products', { params });
  return data;
}

export async function getProduct(id: string) {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export type ProductInput = {
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: ProductStatus;
  imageUrl?: string | null;
  ownerId: string;
};

export async function createProduct(body: ProductInput) {
  const { data } = await api.post<Product>('/products', body);
  return data;
}

export async function updateProduct(id: string, body: Partial<ProductInput>) {
  const { data } = await api.put<Product>(`/products/${id}`, body);
  return data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}
