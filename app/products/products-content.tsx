'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ProductsTable } from '@/components/products-table'
import { ProductsHeader } from '@/components/products/products-header'
import { ProductsFilterBar } from '@/components/products/products-filter-bar'
import { type FilterState } from '@/components/products-filters'
import { toast } from 'sonner'
import { SORTABLE_PRODUCT_FIELDS, SORT_ORDERS } from '@/lib/constants'
import { PRODUCTS_PAGE_CONSTANTS } from '@/lib/constants/products'
import { useOwners } from '@/hooks/use-owners'
import type { ProductTableRow, SortField, SortOrder } from '@/lib/types'

interface ProductsResponse {
  data: ProductTableRow[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

function parseFilters(params: URLSearchParams): FilterState {
  const status = params.getAll('status').filter(Boolean)
  const owner = params.getAll('owner').filter(Boolean)
  const rawSortBy = params.get('sortBy') ?? 'createdAt'
  const sortBy = SORTABLE_PRODUCT_FIELDS.includes(rawSortBy as (typeof SORTABLE_PRODUCT_FIELDS)[number])
    ? rawSortBy
    : 'createdAt'
  const rawSortOrder = params.get('sortOrder') ?? 'desc'
  const sortOrder = SORT_ORDERS.includes(rawSortOrder as (typeof SORT_ORDERS)[number])
    ? (rawSortOrder as 'asc' | 'desc')
    : 'desc'
  return {
    status: status.length > 0 ? status : undefined,
    owner: owner.length > 0 ? owner : undefined,
    sortBy,
    sortOrder,
  }
}

export function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<ProductTableRow[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState(searchParams.get('search') ?? '')
  const [debouncedQuery] = useDebounce(query, 400)
  const [filters, setFilters] = useState<FilterState>(() => parseFilters(searchParams))
  const { owners, loading: ownersLoading } = useOwners()
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async (p: number, q: string, f: FilterState) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', p.toString())
      params.set('limit', PRODUCTS_PAGE_CONSTANTS.PAGE_SIZE.toString())
      if (q) params.set('search', q)
      f.status?.forEach((s) => params.append('status', s))
      f.owner?.forEach((o) => params.append('owner', o))
      if (f.sortBy) params.set('sortBy', f.sortBy)
      if (f.sortOrder) params.set('sortOrder', f.sortOrder)
      const res = await fetch(`/api/products?${params}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data: ProductsResponse = await res.json()
      setProducts(data.data)
      setPage(data.pagination.page)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''
    const targetSearch = debouncedQuery.trim()
    if (currentSearch === targetSearch) return
    const next = new URLSearchParams(searchParams)
    targetSearch ? next.set('search', targetSearch) : next.delete('search')
    next.set('page', '1')
    router.replace(`?${next}`)
  }, [debouncedQuery, searchParams, router])

  useEffect(() => {
    const p = parseInt(searchParams.get('page') ?? '1', 10)
    const q = searchParams.get('search') ?? ''
    const parsed = parseFilters(searchParams)
    setPage(p)
    setQuery(q)
    setFilters(parsed)
    fetchProducts(p, q, parsed)
  }, [searchParams, fetchProducts])

  const updateUrlFromFilters = useCallback((nextFilters: FilterState) => {
    const next = new URLSearchParams(searchParams)
    next.delete('status')
    next.delete('owner')
    nextFilters.status?.forEach((s) => next.append('status', s))
    nextFilters.owner?.forEach((o) => next.append('owner', o))
    nextFilters.sortBy ? next.set('sortBy', nextFilters.sortBy) : next.delete('sortBy')
    nextFilters.sortOrder ? next.set('sortOrder', nextFilters.sortOrder) : next.delete('sortOrder')
    next.set('page', '1')
    router.replace(`?${next}`)
  }, [searchParams, router])

  const handleFiltersChange = (nextFilters: FilterState) => {
    setFilters(nextFilters)
    updateUrlFromFilters(nextFilters)
  }

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return
    const next = new URLSearchParams(searchParams)
    next.set('page', nextPage.toString())
    router.replace(`?${next}`)
  }

  const handleSortChange = (sortBy: SortField, sortOrder: SortOrder) => {
    handleFiltersChange({ ...filters, sortBy, sortOrder })
  }

  const handleResetFilters = () => {
    handleFiltersChange({ sortBy: filters.sortBy, sortOrder: filters.sortOrder })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <ProductsHeader />

      <ProductsFilterBar
        query={query}
        filters={filters}
        owners={owners}
        ownersLoading={ownersLoading}
        total={total}
        onQueryChange={setQuery}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {!loading && products.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No products found</p>
        </Card>
      ) : (
        <ProductsTable
          initialProducts={products}
          total={total}
          totalPages={totalPages}
          currentPage={page}
          pageSize={PRODUCTS_PAGE_CONSTANTS.PAGE_SIZE}
          onPageChange={handlePageChange}
          sortBy={(filters.sortBy as SortField) || 'createdAt'}
          sortOrder={filters.sortOrder || 'desc'}
          onSortChange={handleSortChange}
          loading={loading}
          onDeleteSuccess={() => fetchProducts(page, searchParams.get('search') ?? '', filters)}
        />
      )}
    </div>
  )
}
