import {
  getDashboardStats,
  getStatusCounts,
  getProductsOverTime,
  getProductPriceMetrics,
  getLowStockProducts,
  getRecentProducts,
} from '@/lib/dashboard'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { StatusDonut } from '@/components/dashboard/status-donut'
import { ProductsOverTimeChart } from '@/components/dashboard/products-over-time-chart'
import { PriceMetricsChart } from '@/components/dashboard/price-metrics-chart'
import { LowStockAlerts } from '@/components/dashboard/low-stock-alerts'
import { RecentProducts } from '@/components/dashboard/recent-products'

export const metadata = {
  title: 'Dashboard',
  description: 'Product management overview',
}

export default async function HomePage() {
  const [
    stats,
    statusCounts,
    productsOverTime,
    productPriceMetrics,
    lowStockProducts,
    recentProducts,
  ] = await Promise.all([
    getDashboardStats(),
    getStatusCounts(),
    getProductsOverTime(),
    getProductPriceMetrics(),
    getLowStockProducts(),
    getRecentProducts(),
  ])

  return (
    <div className="space-y-7 sm:space-y-8">
      <DashboardHeader />

      <KpiCards stats={stats} />

      <section className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <StatusDonut data={statusCounts} />
        <ProductsOverTimeChart data={productsOverTime} />
        <PriceMetricsChart data={productPriceMetrics} />
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <LowStockAlerts products={lowStockProducts} />
        <RecentProducts products={recentProducts} />
      </section>
    </div>
  )
}
