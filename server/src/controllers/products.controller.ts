import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createProduct,
  deleteProduct,
  getProduct as getProductById,
  listProducts,
  updateProduct,
} from '../services/products.service.js';
import {
  CreateProductSchema,
  UpdateProductSchema,
  ListProductsQuerySchema,
} from '../validators/product.schemas.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const parsed = ListProductsQuerySchema.parse(req.query);
  const result = await listProducts(parsed as any);
  res.json(result);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  res.json(product);
});

export const postProduct = asyncHandler(async (req: Request, res: Response) => {
  const body = CreateProductSchema.parse(req.body);
  const created = await createProduct(body as any);
  res.status(201).json(created);
});

export const putProduct = asyncHandler(async (req: Request, res: Response) => {
  const body = UpdateProductSchema.parse(req.body);
  const updated = await updateProduct(req.params.id, body);
  res.json(updated);
});

export const removeProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await deleteProduct(req.params.id);
  res.status(204).send();
});
