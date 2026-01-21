'use client'

import { Search, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PRODUCT_STATUSES, PRODUCT_STATUS_LABELS } from '@/lib/constants'
import { ActiveFilterBadges } from '@/components/products/active-filter-badges'
import type { ProductOwnerItem } from '@/lib/types'
import type { FilterState } from '@/components/products-filters'

interface ProductsFilterBarProps {
  query: string
  filters: FilterState
  owners: ProductOwnerItem[]
  ownersLoading: boolean
  total: number
  onQueryChange: (value: string) => void
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
}

export function ProductsFilterBar({
  query,
  filters,
  owners,
  ownersLoading,
  total,
  onQueryChange,
  onFiltersChange,
  onReset,
}: ProductsFilterBarProps) {
  const activeStatusCount = filters.status?.length ?? 0
  const activeOwnerCount = filters.owner?.length ?? 0
  const activeFilterCount = activeStatusCount + activeOwnerCount

  function toggleStatus(status: string, checked: boolean) {
    const next = new Set(filters.status ?? [])
    if (checked) next.add(status)
    else next.delete(status)
    onFiltersChange({ ...filters, status: next.size ? [...next] : undefined })
  }

  function toggleOwner(slug: string, checked: boolean) {
    const next = new Set(filters.owner ?? [])
    if (checked) next.add(slug)
    else next.delete(slug)
    onFiltersChange({ ...filters, owner: next.size ? [...next] : undefined })
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-2 sm:p-3 backdrop-blur-sm shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, SKU, or description..."
              className="h-10 w-full rounded-xl border-transparent bg-background/60 pl-9 focus-visible:bg-background"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Search products by name, SKU, or description"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 min-w-[140px] justify-between rounded-xl bg-background/40 hover:bg-background/80">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Status
                    {activeStatusCount ? <Badge className="px-2 py-0.5">{activeStatusCount}</Badge> : null}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {PRODUCT_STATUSES.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.status?.includes(status) ?? false}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) => toggleStatus(status, checked)}
                  >
                    {PRODUCT_STATUS_LABELS[status]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 min-w-[140px] justify-between rounded-xl bg-background/40 hover:bg-background/80"
                  disabled={ownersLoading}
                >
                  <span className="flex items-center gap-2">
                    Owner
                    {activeOwnerCount ? <Badge className="px-2 py-0.5">{activeOwnerCount}</Badge> : null}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[280px] w-52 overflow-y-auto">
                {owners.map((owner) => (
                  <DropdownMenuCheckboxItem
                    key={owner.id}
                    checked={filters.owner?.includes(owner.slug) ?? false}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) => toggleOwner(owner.slug, checked)}
                  >
                    {owner.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              className="h-10 justify-center rounded-xl sm:justify-start"
              onClick={onReset}
              disabled={!activeFilterCount}
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </Button>
          </div>
        </div>

        <ActiveFilterBadges total={total} filters={filters} owners={owners} />
      </div>
    </div>
  )
}
