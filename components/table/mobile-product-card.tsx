'use client'

import Link from 'next/link'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PRODUCT_STATUS_LABELS } from '@/lib/constants'
import { formatPrice } from '@/lib/currency'
import { ProductImage } from '@/components/table/product-image'
import type { ProductTableRow } from '@/lib/types'

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ACTIVE': return 'default'
    case 'INACTIVE': return 'secondary'
    case 'DISCONTINUED': return 'destructive'
    default: return 'outline'
  }
}

interface MobileProductCardProps {
  product: ProductTableRow
  onDelete: (id: number) => void
}

export function MobileProductCard({ product, onDelete }: MobileProductCardProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <ProductImage imageUrl={product.imageUrl} name={product.name} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground" title={product.name}>
            {product.name}
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground" title={product.sku}>
            {product.sku}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(product.status)} className="text-xs">
              {PRODUCT_STATUS_LABELS[product.status as keyof typeof PRODUCT_STATUS_LABELS] ?? product.status}
            </Badge>
            <span className="text-sm font-medium tabular-nums text-foreground">
              ${formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              {'\u00b7'} {product.inventory} in stock
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2" asChild>
              <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}>
                <Eye className="h-3.5 w-3.5" />
                View
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2" asChild>
              <Link href={`/products/${product.id}/edit`} aria-label={`Edit ${product.name}`}>
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(product.id)}
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
