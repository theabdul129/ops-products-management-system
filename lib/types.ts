import { Prisma } from '@prisma/client'

export interface ProductWithOwner {
  id: number
  sku: string
  name: string
  slug: string
  description: string | null
  price: Prisma.Decimal
  inventory: number
  imageUrl: string | null
  status: string
  ownerId: number
  createdAt: Date
  updatedAt: Date
  owner: {
    id: number
    name: string
    slug: string
    email: string
  }
}

export interface SerializedProduct {
  id: number
  sku: string
  name: string
  slug: string
  description: string | null
  price: string
  inventory: number
  imageUrl: string | null
  status: string
  ownerId: number
  createdAt: string
  updatedAt: string
  owner: {
    id: number
    name: string
    slug: string
    email: string
  }
}

export interface ProductTableRow {
  id: number
  slug: string
  name: string
  sku: string
  description: string | null
  price: string
  inventory: number
  imageUrl: string | null
  status: string
  owner: {
    id: number
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

export interface ProductOwnerItem {
  id: number
  name: string
  slug: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface OwnerWithCount {
  id: number
  name: string
  slug: string
  email: string
  createdAt: Date
  updatedAt: Date
  _count: {
    products: number
  }
}

export interface DashboardStats {
  totalProducts: number
  totalOwners: number
  activeProducts: number
  inactiveProducts: number
  discontinuedProducts: number
  lowInventoryCount: number
  totalInventoryValue: number
}

export interface StatusCount {
  name: string
  value: number
  fill: string
}

export interface ProductsOverTimePoint {
  period: string
  count: number
  fullDate: string
}

export interface ProductPriceMetric {
  name: string
  value: number
  description: string
  fill: string
  unit: 'currency' | 'count'
}

export interface LowStockProduct {
  id: number
  slug: string
  name: string
  sku: string
  inventory: number
  price: number
}

export interface RecentProduct {
  id: number
  slug: string
  name: string
  sku: string
  status: string
  ownerName: string
  createdAt: Date
}

export interface ProductsQueryParsed {
  page: number
  limit: number
  search: string | null | undefined
  statusList: string[]
  ownerParams: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  skip: number
}

export interface FilterState {
  status?: string
  owner?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type SortField = 'name' | 'sku' | 'price' | 'inventory' | 'status' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export type PriceLike = number | string | { toNumber(): number }

export interface PrismaLike {
  product: {
    findUnique: (args: { where: { slug: string } }) => Promise<{ id: number } | null>
  }
  productOwner: {
    findUnique: (args: { where: { slug: string } }) => Promise<{ id: number } | null>
  }
}
