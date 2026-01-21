'use client'

import Link from 'next/link'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PRODUCT_STATUS_LABELS } from '@/lib/constants'
import { TABLE_CONSTANTS, COLUMN_LAYOUT, SORTABLE_COLUMNS } from '@/lib/constants/table'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/currency'
import { SortableHead } from '@/components/table/sortable-head'
import { SkeletonRow } from '@/components/table/skeleton-row'
import { ProductImage } from '@/components/table/product-image'
import type { ProductTableRow, SortField, SortOrder } from '@/lib/types'

const LOW_STOCK_THRESHOLD = 20

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ACTIVE': return 'default'
    case 'INACTIVE': return 'secondary'
    case 'DISCONTINUED': return 'destructive'
    default: return 'outline'
  }
}

interface DesktopTableProps {
  products: ProductTableRow[]
  loading: boolean
  sortBy: SortField
  sortOrder: SortOrder
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void
  onDelete: (id: number) => void
}

export function DesktopTable({
  products,
  loading,
  sortBy,
  sortOrder,
  onSortChange,
  onDelete,
}: DesktopTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <Table className="table-fixed w-full min-w-[900px]">
        <TableHeader>
          <TableRow className="border-border bg-[linear-gradient(180deg,rgba(12,151,98,0.1),rgba(250,255,127,0.03))] hover:bg-[linear-gradient(180deg,rgba(12,151,98,0.1),rgba(250,255,127,0.03))]">
            <TableHead className={cn(COLUMN_LAYOUT[0].width, 'font-semibold uppercase tracking-[0.08em] text-muted-foreground')}>
              Image
            </TableHead>
            {SORTABLE_COLUMNS.slice(0, 2).map((column, index) => (
              <SortableHead
                key={column.key}
                label={column.label}
                sortKey={column.key}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
                align={column.align}
                widthClass={COLUMN_LAYOUT[index + 1].width}
              />
            ))}
            <TableHead className={cn(COLUMN_LAYOUT[3].width, 'font-semibold uppercase tracking-[0.08em] text-muted-foreground')}>
              Owner
            </TableHead>
            {SORTABLE_COLUMNS.slice(2).map((column, index) => (
              <SortableHead
                key={column.key}
                label={column.label}
                sortKey={column.key}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
                align={column.align}
                widthClass={COLUMN_LAYOUT[index + 4].width}
              />
            ))}
            <TableHead className={cn(COLUMN_LAYOUT[8].width, 'text-center font-semibold uppercase tracking-[0.08em] text-muted-foreground')}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: TABLE_CONSTANTS.SKELETON_ROW_COUNT }).map((_, i) => (
              <SkeletonRow key={i} />
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={TABLE_CONSTANTS.COLUMN_COUNT} className="h-32 text-center text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="border-border transition-colors hover:bg-primary/6">
                <TableCell className={cn(COLUMN_LAYOUT[0].width, 'py-3')}>
                  <ProductImage imageUrl={product.imageUrl} name={product.name} size="sm" />
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[1].width, 'truncate py-3 font-medium text-foreground')} title={product.name}>
                  {product.name}
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[2].width, 'truncate py-3 font-mono text-sm text-muted-foreground')} title={product.sku}>
                  {product.sku}
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[3].width, 'truncate py-3 text-sm text-muted-foreground')} title={product.owner.name}>
                  {product.owner.name}
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[4].width, 'py-3 text-center font-medium tabular-nums')}>
                  ${formatPrice(product.price)}
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[5].width, 'py-3 text-center tabular-nums')}>
                  <span className={product.inventory < LOW_STOCK_THRESHOLD ? 'font-medium text-destructive' : 'text-muted-foreground'}>
                    {product.inventory}
                  </span>
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[6].width, 'py-3 text-center')}>
                  <Badge variant={getStatusVariant(product.status)} className="font-medium">
                    {PRODUCT_STATUS_LABELS[product.status as keyof typeof PRODUCT_STATUS_LABELS] ?? product.status}
                  </Badge>
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[7].width, 'py-3 text-center text-sm text-muted-foreground')}>
                  {new Date(product.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className={cn(COLUMN_LAYOUT[8].width, 'py-3 text-center')}>
                  <div className="flex justify-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                      <Link href={`/products/${product.id}`} title="View" aria-label={`View product ${product.name}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                      <Link href={`/products/${product.id}/edit`} title="Edit" aria-label={`Edit product ${product.name}`}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(product.id)}
                      title="Delete"
                      aria-label={`Delete product ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
