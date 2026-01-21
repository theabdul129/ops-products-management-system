'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PRODUCT_STATUS_LABELS } from '@/lib/constants'
import { STATUS_STYLES } from '@/lib/constants/products'
import { formatPrice } from '@/lib/currency'
import { ProductDetailSkeleton } from '@/components/product-detail/product-detail-skeleton'
import { ProductDetailImage } from '@/components/product-detail/product-detail-image'
import { useProduct } from '@/hooks/use-product'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params)
  const { product, loading } = useProduct(id)

  if (loading) return <ProductDetailSkeleton />
  if (!product) notFound()

  const statusStyle = STATUS_STYLES[product.status] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'

  return (
    <div className="space-y-6 sm:space-y-8">
      <Link href="/products" className="inline-block">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to products
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-6">
        <Card className="border-border overflow-hidden p-0 lg:col-span-4 h-[320px] sm:h-[420px] lg:h-auto lg:self-stretch">
          <div className="relative h-full w-full min-h-[320px] sm:min-h-[420px]">
            <ProductDetailImage imageUrl={product.imageUrl} name={product.name} />
            {product.imageUrl && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent" />
            )}
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-6">
          <Card className="border-border space-y-5 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Product profile</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{product.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>
              <Badge className={cn('w-fit shrink-0', statusStyle)}>
                {PRODUCT_STATUS_LABELS[product.status as keyof typeof PRODUCT_STATUS_LABELS] ?? product.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background/35 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Price</p>
                <p className="mt-1 text-2xl font-bold text-foreground">${formatPrice(product.price)}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/35 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Inventory</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{product.inventory} units</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Description</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
                {product.description?.trim() || 'No description added for this product yet.'}
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border-border p-5">
              <h3 className="text-sm font-semibold text-foreground">Product owner</h3>
              <div className="mt-3 space-y-1">
                <p className="text-base font-medium text-foreground">{product.owner.name}</p>
                <p className="break-all text-sm text-muted-foreground">{product.owner.email}</p>
              </div>
            </Card>

            <Card className="border-border p-5">
              <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
              <div className="mt-3 grid gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Created</p>
                  <p className="text-sm text-foreground">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Last updated</p>
                  <p className="text-sm text-foreground">{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">Actions</h3>
            <div className="mt-3">
              <Link href={`/products/${product.id}/edit`} className="block sm:inline-block">
                <Button className="w-full gap-2 sm:w-auto">
                  <Edit2 className="h-4 w-4 shrink-0" />
                  Edit product
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
