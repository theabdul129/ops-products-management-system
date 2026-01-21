import { prisma } from '@/lib/db'
import { DASHBOARD_CONSTANTS, CHART_COLORS, STATUS_CHART_CONFIG } from '@/lib/constants/dashboard'
import { decimalToNumber, toNumber, ensureMinimum } from '@/lib/utils/type-converter'
import type {
  DashboardStats,
  StatusCount,
  ProductsOverTimePoint,
  ProductPriceMetric,
  LowStockProduct,
  RecentProduct,
} from '@/lib/types'

export type {
  DashboardStats,
  StatusCount,
  ProductsOverTimePoint,
  ProductPriceMetric,
  LowStockProduct,
  RecentProduct,
}

const EMPTY_STATS: DashboardStats = {
  totalProducts: 0,
  totalOwners: 0,
  activeProducts: 0,
  inactiveProducts: 0,
  discontinuedProducts: 0,
  lowInventoryCount: 0,
  totalInventoryValue: 0,
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      totalProducts,
      totalOwners,
      activeProducts,
      inactiveProducts,
      discontinuedProducts,
      lowInventoryCount,
      inventoryValueResult,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.productOwner.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count({ where: { status: 'INACTIVE' } }),
      prisma.product.count({ where: { status: 'DISCONTINUED' } }),
      prisma.product.count({ where: { inventory: { lt: DASHBOARD_CONSTANTS.LOW_STOCK_THRESHOLD } } }),
      prisma.$queryRaw<[{ sum: unknown }]>`
        SELECT SUM(price * inventory) as sum FROM products
      `,
    ])

    const totalInventoryValue = toNumber(inventoryValueResult[0]?.sum)

    return {
      totalProducts,
      totalOwners,
      activeProducts,
      inactiveProducts,
      discontinuedProducts,
      lowInventoryCount,
      totalInventoryValue,
    }
  } catch (error) {
    console.error('getDashboardStats error:', error)
    return EMPTY_STATS
  }
}

export async function getStatusCounts(): Promise<StatusCount[]> {
  try {
    const [active, inactive, discontinued] = await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count({ where: { status: 'INACTIVE' } }),
      prisma.product.count({ where: { status: 'DISCONTINUED' } }),
    ])
    const counts = [active, inactive, discontinued]
    return STATUS_CHART_CONFIG.map((config, index) => ({
      name: config.name,
      value: counts[index],
      fill: config.fill,
    }))
  } catch (error) {
    console.error('getStatusCounts error:', error)
    return []
  }
}

export async function getProductsOverTime(
  months: number = DASHBOARD_CONSTANTS.PRODUCTS_OVER_TIME_MONTHS
): Promise<ProductsOverTimePoint[]> {
  try {
    const safeMonths = typeof months === 'number' && months >= 1 ? months : 1
    const since = new Date()
    since.setMonth(since.getMonth() - safeMonths)
    const rows = await prisma.$queryRaw<
      { month: Date; count: bigint }[]
    >`
      SELECT date_trunc('month', "createdAt")::date as month, COUNT(*)::bigint as count
      FROM products
      WHERE "createdAt" >= ${since}
      GROUP BY date_trunc('month', "createdAt")
      ORDER BY 1
    `
    return rows.map((r: { month: Date; count: bigint }) => ({
      period: new Date(r.month).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      count: Number(r.count),
      fullDate: new Date(r.month).toISOString().slice(0, 7),
    }))
  } catch (error) {
    console.error('getProductsOverTime error:', error)
    return []
  }
}

export async function getProductPriceMetrics(): Promise<ProductPriceMetric[]> {
  try {
    const [mostExpensive, cheapest, lowestStock, mostInventoryValue] = await Promise.all([
      prisma.product.findFirst({
        orderBy: { price: 'desc' },
        select: { name: true, price: true, inventory: true },
      }),
      prisma.product.findFirst({
        orderBy: { price: 'asc' },
        select: { name: true, price: true, inventory: true },
      }),
      prisma.product.findFirst({
        orderBy: { inventory: 'asc' },
        select: { name: true, price: true, inventory: true },
      }),
      prisma.$queryRaw<
        { name: string; inventory_value: unknown; inventory: number }[]
      >`
        SELECT name, (price * inventory) AS inventory_value, inventory
        FROM products
        ORDER BY inventory_value DESC
        LIMIT 1
      `,
    ])

    const metrics: ProductPriceMetric[] = []

    if (mostExpensive) {
      metrics.push({
        name: mostExpensive.name,
        value: decimalToNumber(mostExpensive.price),
        description: 'Most expensive',
        fill: CHART_COLORS.CHART_2,
        unit: 'currency',
      })
    }

    if (cheapest) {
      metrics.push({
        name: cheapest.name,
        value: ensureMinimum(decimalToNumber(cheapest.price), 0.01),
        description: 'Cheapest',
        fill: CHART_COLORS.CHART_3,
        unit: 'currency',
      })
    }

    if (lowestStock) {
      metrics.push({
        name: lowestStock.name,
        value: ensureMinimum(lowestStock.inventory, 0.01),
        description: 'Lowest stock',
        fill: CHART_COLORS.CHART_4,
        unit: 'count',
      })
    }

    if (mostInventoryValue[0]) {
      metrics.push({
        name: mostInventoryValue[0].name,
        value: ensureMinimum(toNumber(mostInventoryValue[0].inventory_value), 0.01),
        description: 'Highest inventory value',
        fill: CHART_COLORS.CHART_5,
        unit: 'currency',
      })
    }

    return metrics
  } catch (error) {
    console.error('getProductPriceMetrics error:', error)
    return []
  }
}

export async function getLowStockProducts(
  limit: number = DASHBOARD_CONSTANTS.LOW_STOCK_LIMIT
): Promise<LowStockProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { inventory: { lt: DASHBOARD_CONSTANTS.LOW_STOCK_THRESHOLD } },
      orderBy: { inventory: 'asc' },
      take: limit,
      select: { id: true, slug: true, name: true, sku: true, inventory: true, price: true },
    })
    return products.map((p) => ({
      ...p,
      price: decimalToNumber(p.price),
    }))
  } catch (error) {
    console.error('getLowStockProducts error:', error)
    return []
  }
}

export async function getRecentProducts(
  limit: number = DASHBOARD_CONSTANTS.RECENT_PRODUCTS_LIMIT
): Promise<RecentProduct[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        sku: true,
        status: true,
        createdAt: true,
        owner: { select: { name: true } },
      },
    })
    return products.map(
      (p: (typeof products)[number]): RecentProduct => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        status: p.status,
        ownerName: p.owner.name,
        createdAt: p.createdAt,
      })
    )
  } catch (error) {
    console.error('getRecentProducts error:', error)
    return []
  }
}
