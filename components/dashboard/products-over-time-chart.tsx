'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ProductsOverTimePoint } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProductsOverTimeChartProps {
  data: ProductsOverTimePoint[]
}

export function ProductsOverTimeChart({ data }: ProductsOverTimeChartProps) {
  if (!data.length) {
    return (
      <Card className="min-w-0 gap-3 py-4 sm:py-5">
        <CardHeader className="px-4 pb-1 sm:px-5">
          <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">Products created over time</CardTitle>
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
        <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">Products created over time</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5">
        <div className="h-[240px] w-full sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillProducts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-elevated)',
                }}
                itemStyle={{ color: 'var(--card-foreground)' }}
                labelStyle={{ color: 'var(--card-foreground)', fontWeight: 600 }}
                formatter={(value: number) => [`${value} products`, 'Added']}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Products added"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#fillProducts)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
