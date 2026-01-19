import { prisma } from '../prisma.js';
import type { ProductStatus } from '@prisma/client';

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

export async function listProducts(params: ListProductsParams) {
  const {
    q,
    sku,
    ownerId,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10
  } = params;

  const where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } }
    ];
  }

  if (sku) {
    where.sku = { contains: sku, mode: 'insensitive' };
  }

  if (ownerId) {
    where.ownerId = ownerId;
  }

  if (status) {
    where.status = status;
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { owner: true },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take
    }),
    prisma.product.count({ where })
  ]);

  return {
    items,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { owner: true }
  });
}

export async function createProduct(data: {
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status?: ProductStatus;
  imageUrl?: string | null;
  ownerId: string;
}) {
  // Ensure owner exists
  await prisma.productOwner.findUniqueOrThrow({ where: { id: data.ownerId } });

  return prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      price: data.price,
      inventory: data.inventory,
      status: data.status ?? 'ACTIVE',
      imageUrl: data.imageUrl ?? null,
      ownerId: data.ownerId
    },
    include: { owner: true }
  });
}

export async function updateProduct(id: string, data: Partial<{
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: ProductStatus;
  imageUrl: string | null;
  ownerId: string;
}>) {
  if (data.ownerId) {
    await prisma.productOwner.findUniqueOrThrow({ where: { id: data.ownerId } });
  }

  return prisma.product.update({
    where: { id },
    data,
    include: { owner: true }
  });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}
