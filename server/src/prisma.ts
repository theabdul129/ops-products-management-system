import { PrismaClient } from '@prisma/client';

// Prevent multiple Prisma instances in dev (hot reload)
// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
