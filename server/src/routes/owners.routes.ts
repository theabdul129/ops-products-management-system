import { Router } from 'express';
import { listOwners } from '../services/owners.service.js';

export const ownersRouter = Router();

ownersRouter.get('/', async (_req, res, next) => {
  try {
    const owners = await listOwners();
    res.json(owners);
  } catch (e) {
    next(e);
  }
});
