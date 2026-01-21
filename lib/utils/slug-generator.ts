import { SLUG_CONSTANTS } from '@/lib/constants/slug'
import type { PrismaLike } from '@/lib/types'

export function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(SLUG_CONSTANTS.SLUG_PATTERN, '-')
    .replace(SLUG_CONSTANTS.INVALID_CHARS_PATTERN, '')
    .replace(SLUG_CONSTANTS.MULTIPLE_HYPHENS_PATTERN, '-')
    .replace(SLUG_CONSTANTS.EDGE_HYPHENS_PATTERN, '')
  return slug || SLUG_CONSTANTS.DEFAULT_SLUG
}

async function checkSlugExists(
  prisma: PrismaLike,
  slug: string,
  type: 'product' | 'owner',
  excludeId?: number
): Promise<boolean> {
  if (type === 'product') {
    const existing = await prisma.product.findUnique({ where: { slug } })
    return existing != null && (excludeId == null || existing.id !== excludeId)
  } else {
    const existing = await prisma.productOwner.findUnique({ where: { slug } })
    return existing != null
  }
}

async function generateUniqueSlug(
  prisma: PrismaLike,
  baseSlug: string,
  type: 'product' | 'owner',
  excludeId?: number
): Promise<string> {
  let slug = baseSlug
  let counter = 2
  let iterations = 0

  while (iterations < SLUG_CONSTANTS.MAX_ITERATIONS) {
    iterations += 1
    const exists = await checkSlugExists(prisma, slug, type, excludeId)
    if (!exists) return slug
    slug = `${baseSlug}-${counter}`
    counter += 1
  }

  return `${baseSlug}-${Date.now()}`
}

export async function uniqueProductSlug(
  prisma: PrismaLike,
  baseSlug: string,
  excludeId?: number
): Promise<string> {
  return generateUniqueSlug(prisma, baseSlug, 'product', excludeId)
}

export async function uniqueOwnerSlug(
  prisma: PrismaLike,
  baseSlug: string
): Promise<string> {
  return generateUniqueSlug(prisma, baseSlug, 'owner')
}
