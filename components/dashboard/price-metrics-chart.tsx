'use client'

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { ProductPriceMetric } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PriceMetricsChartProps {
  data: ProductPriceMetric[]
}

export function PriceMetricsChart({ data }: PriceMetricsChartProps) {
  const formatMetric = (value: number, unit: ProductPriceMetric['unit']) =>
    unit === 'currency' ? `$${value.toFixed(2)}` : `${value.toFixed(0)} units`

  if (!data.length) {
    return (
      <Card className="min-w-0 gap-3 py-4 sm:py-5">
        <CardHeader className="px-4 pb-1 sm:px-5">
          <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">Price spotlight</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center px-4 text-sm text-muted-foreground sm:h-[280px] sm:px-5">
          No data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="min-w-0 gap-3 py-4 sm:py-5">
      <CardHeader className="px-4 pb-1 sm:px-5">
        <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">Price spotlight</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5">
        <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_168px] 2xl:items-center">
          <div className="flex h-[220px] w-full min-w-0 items-center justify-center sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="description"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={3}
                  stroke="transparent"
                >
                  {data.map((entry) => (
                    <Cell key={entry.description} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--gradient-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-elevated)',
                  }}
                  itemStyle={{ color: 'var(--card-foreground)' }}
                  labelStyle={{ color: 'var(--card-foreground)', fontWeight: 600 }}
                  formatter={(value: number, _name: string, item: { payload?: ProductPriceMetric }) => {
                    const metric = item.payload
                    return [
                      formatMetric(Number(value), metric?.unit ?? 'currency'),
                      metric?.name ?? '',
                    ]
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 2xl:grid-cols-1">
            {data.map((item) => (
              <div key={item.description} className="rounded-xl border border-border/70 bg-background/25 px-3 py-2">
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{formatMetric(Number(item.value), item.unit)}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
