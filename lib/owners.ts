import { prisma } from '@/lib/db'
import type { OwnerWithCount } from '@/lib/types'

export type { OwnerWithCount }

export async function getOwners(): Promise<OwnerWithCount[]> {
  return prisma.productOwner.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
}
