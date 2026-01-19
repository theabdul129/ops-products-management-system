import { z } from 'zod';

export const ProductStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']);

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(200),
  sku: z.string().min(2).max(50),
  price: z.number().nonnegative(),
  inventory: z.number().int().nonnegative(),
  status: ProductStatusSchema.default('ACTIVE'),
  imageUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  ownerId: z.string().uuid(),
});

export const UpdateProductSchema = CreateProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required to update a product' },
);

export const ListProductsQuerySchema = z.object({
  q: z.string().optional(),
  sku: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  status: ProductStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'price', 'inventory', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
