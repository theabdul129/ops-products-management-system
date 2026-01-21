'use client'

import { ArrowDown, ArrowUp } from 'lucide-react'
import { TableHead } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SortField, SortOrder } from '@/lib/types'

interface SortableHeadProps {
  label: string
  sortKey: SortField
  currentSortBy: SortField
  currentSortOrder: SortOrder
  onSort: (sortBy: SortField, sortOrder: SortOrder) => void
  align?: 'center'
  widthClass: string
}

export function SortableHead({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
  align,
  widthClass,
}: SortableHeadProps) {
  const isActive = currentSortBy === sortKey

  return (
    <TableHead
      className={cn(widthClass, align === 'center' && 'text-center')}
      aria-sort={isActive ? (currentSortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 font-semibold uppercase tracking-[0.08em] text-foreground/80 hover:bg-muted/80 hover:text-foreground',
          align === 'center' ? 'mx-auto' : '-ml-2',
        )}
        onClick={() => onSort(sortKey, isActive && currentSortOrder === 'asc' ? 'desc' : 'asc')}
        aria-label={`Sort by ${label} ${isActive && currentSortOrder === 'desc' ? 'ascending' : 'descending'}`}
      >
        {label}
        <span className="ml-1 flex items-center -space-x-0.5">
          <ArrowUp
            className={cn(
              'h-3.5 w-3 shrink-0',
              isActive && currentSortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50',
            )}
          />
          <ArrowDown
            className={cn(
              'h-3.5 w-3 shrink-0',
              isActive && currentSortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50',
            )}
          />
        </span>
      </Button>
    </TableHead>
  )
}
