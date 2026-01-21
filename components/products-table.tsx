'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { MobileSkeletonCards } from '@/components/table/mobile-skeleton-card'
import { MobileProductCard } from '@/components/table/mobile-product-card'
import { DesktopTable } from '@/components/table/desktop-table'
import { TablePagination } from '@/components/table/table-pagination'
import { DeleteDialog } from '@/components/table/delete-dialog'
import type { ProductTableRow, SortField, SortOrder } from '@/lib/types'

export type { ProductTableRow, SortField, SortOrder }

interface ProductsTableProps {
  initialProducts: ProductTableRow[]
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  sortBy: SortField
  sortOrder: SortOrder
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void
  loading?: boolean
  onDeleteSuccess?: () => void
}

export function ProductsTable({
  initialProducts,
  total,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  loading = false,
  onDeleteSuccess,
}: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const handleDelete = async () => {
    if (deleteProductId === null) return
    setIsDeleting(true)
    try {
      const product = products.find((p) => p.id === deleteProductId)
      if (!product) return
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete product')
      toast.success('Product deleted successfully')
      setDeleteProductId(null)
      onDeleteSuccess?.()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="card-gradient shadow-card overflow-hidden rounded-xl border border-border/80">
        <div className="space-y-3 p-3 md:hidden">
          {loading ? (
            <MobileSkeletonCards />
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No products found</p>
          ) : (
            products.map((product) => (
              <MobileProductCard
                key={product.id}
                product={product}
                onDelete={setDeleteProductId}
              />
            ))
          )}
        </div>

        <DesktopTable
          products={products}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
          onDelete={setDeleteProductId}
        />

        <TablePagination
          loading={loading}
          total={total}
          totalPages={totalPages}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        open={deleteProductId !== null}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteProductId(null)}
      />
    </>
  )
}
