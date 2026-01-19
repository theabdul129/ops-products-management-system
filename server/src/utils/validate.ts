import type { Request } from 'express';
import type { ZodSchema } from 'zod';

export function validateBody<T>(req: Request, schema: ZodSchema<T>): T {
  return schema.parse(req.body);
}

export function validateQuery<T>(req: Request, schema: ZodSchema<T>): T {
  return schema.parse(req.query);
}
