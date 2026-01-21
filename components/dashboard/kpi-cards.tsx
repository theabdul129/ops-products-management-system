import { Card } from '@/components/ui/card'
import {
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

interface KpiCardsProps {
  stats: DashboardStats
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Total products',
      value: stats.totalProducts,
      icon: Package,
      className: 'bg-primary/10 text-primary',
    },
    {
      label: 'Product owners',
      value: stats.totalOwners,
      icon: Users,
      className: 'bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active products',
      value: stats.activeProducts,
      icon: CheckCircle,
      className: 'bg-green-100/50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'Low stock items',
      value: stats.lowInventoryCount,
      icon: AlertTriangle,
      className: 'bg-amber-100/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Total inventory value',
      value: `${stats.totalInventoryValue.toFixed(2)}`,
      icon: DollarSign,
      className: 'bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
  ] as const

  return (
    <section>
      <h2 className="sr-only">Key metrics</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, className }) => (
          <li key={label} className="h-full">
            <Card className="h-full min-h-[112px] p-4 sm:p-5">
              <div className="flex h-full items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-sm">
                    {label}
                  </p>
                  <p className="mt-1 truncate text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                    {value}
                  </p>
                </div>
                <div className={`shrink-0 rounded-2xl p-2.5 shadow-sm ring-1 ring-white/20 sm:p-3 ${className}`}>
                  <Icon className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
