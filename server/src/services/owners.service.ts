import { prisma } from '../prisma.js';

export async function listOwners() {
  return prisma.productOwner.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getOwnerById(id: string) {
  return prisma.productOwner.findUnique({ where: { id } });
}
