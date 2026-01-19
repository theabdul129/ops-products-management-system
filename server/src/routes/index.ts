import { Router } from 'express';
import { getOwners } from '../controllers/owners.controller.js';
import { getProducts, getProduct, postProduct, putProduct, removeProduct } from '../controllers/products.controller.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));

router.get('/owners', getOwners);

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', postProduct);
router.put('/products/:id', putProduct);
router.delete('/products/:id', removeProduct);

export default router;
