import { prisma } from '@/lib/db'
import type { ProductWithOwner } from '@/lib/types'

export type { ProductWithOwner }

export async function getProduct(idValue: string): Promise<ProductWithOwner | null> {
  try {
    const id = parseInt(idValue, 10)
    if (Number.isNaN(id)) return null
    // TODO: Remove this artificial delay (for skeleton/loading testing only)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return await prisma.product.findUnique({
      where: { id },
      include: { owner: true },
    })
  } catch {
    return null
  }
}
