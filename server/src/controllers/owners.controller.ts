import type { Request, Response } from 'express';
import { listOwners } from '../services/owners.service.js';

export async function getOwners(_req: Request, res: Response) {
  const owners = await listOwners();
  res.json({ items: owners });
}
