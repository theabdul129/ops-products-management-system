'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TablePaginationProps {
  loading: boolean
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const delta = 2
  const range: number[] = []
  const output: (number | 'ellipsis')[] = []
  let previous: number | undefined

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i)
    }
  }

  for (const number of range) {
    if (previous !== undefined && number - previous > 1) output.push('ellipsis')
    output.push(number)
    previous = number
  }

  return output
}

export function TablePagination({
  loading,
  total,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
}: TablePaginationProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 border-t border-border bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  if (total === 0) return null

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, total)
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex flex-col gap-4 border-t border-border bg-muted/20 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <p className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
        Showing{' '}
        <span className="font-medium text-foreground">{start}</span> to{' '}
        <span className="font-medium text-foreground">{end}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span> results
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-end">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-wrap items-center justify-center gap-0.5">
          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-muted-foreground"
              >
                {'\u2026'}
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                className={cn('h-9 w-9 min-w-9 shrink-0', currentPage === page && 'shadow-primary-glow')}
                onClick={() => onPageChange(page)}
                aria-label={currentPage === page ? `Page ${page}, current page` : `Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Button>
            ),
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
