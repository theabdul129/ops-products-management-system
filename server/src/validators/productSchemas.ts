import { z } from 'zod';

export const productStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']);

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(64),
  price: z.number().nonnegative(),
  inventory: z.number().int().nonnegative(),
  status: productStatusEnum.optional(),
  imageUrl: z.string().url().optional().nullable(),
  ownerId: z.string().uuid()
});

export const updateProductSchema = createProductSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: 'At least one field must be provided' }
);

export const listProductsQuerySchema = z.object({
  q: z.string().optional(),
  sku: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  status: productStatusEnum.optional(),
  sortBy: z.enum(['name', 'price', 'inventory', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});
