import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  // Prisma known request errors (e.g., unique constraint)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Unique constraint violation', meta: err.meta });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    return res.status(400).json({ message: 'Database error', code: err.code, meta: err.meta });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Internal server error' });
}
