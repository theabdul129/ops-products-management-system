import { Router } from 'express';
import { z } from 'zod';
import { validateBody, validateQuery } from '../utils/validate.js';
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from '../validators/productSchemas.js';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../services/products.service.js';

export const productsRouter = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

productsRouter.get('/', async (req, res, next) => {
  try {
    const query = validateQuery(req, listProductsQuerySchema);
    const result = await listProducts({
      q: query.q,
      sku: query.sku,
      ownerId: query.ownerId,
      status: query.status as any,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page,
      pageSize: query.pageSize
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const product = await getProduct(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

productsRouter.post('/', async (req, res, next) => {
  try {
    const body = validateBody(req, createProductSchema);
    const product = await createProduct(body);
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});

productsRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const body = validateBody(req, updateProductSchema);
    const updated = await updateProduct(id, body as any);
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

productsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    await deleteProduct(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
