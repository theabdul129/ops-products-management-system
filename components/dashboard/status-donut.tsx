'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { StatusCount } from '@/lib/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatusDonutProps {
  data: StatusCount[]
}

export function StatusDonut({ data }: StatusDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const filtered = data.filter((d) => d.value > 0)
  if (filtered.length === 0) {
    return (
      <Card className="min-w-0 gap-3 py-4 sm:py-5">
        <CardHeader className="px-4 pb-1 sm:px-5">
          <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">Products by status</CardTitle>
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
        <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">Products by status</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5">
        <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_132px] 2xl:items-center">
          <div className="flex h-[220px] w-full items-center justify-center sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
              <Pie
                data={filtered}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="52%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={2}
                stroke="transparent"
                startAngle={50}
                endAngle={-310}
              >
                {filtered.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name: string, item: { payload?: { name?: string }; name?: string }) => {
                  const pct = total ? ((Number(value) / total) * 100).toFixed(1) : '0'
                  const label = item.name ?? item.payload?.name ?? ''
                  return [`${label}: ${value} (${pct}%)`, '']
                }}
                contentStyle={{
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-elevated)',
                }}
                itemStyle={{ color: 'var(--card-foreground)' }}
                labelStyle={{ color: 'var(--card-foreground)', fontWeight: 600 }}
              />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 2xl:grid-cols-1">
            {filtered.map((item) => {
              const percent = total ? Math.round((item.value / total) * 100) : 0
              return (
                <div key={item.name} className="rounded-xl border border-border/70 bg-background/25 px-3 py-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{percent}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
