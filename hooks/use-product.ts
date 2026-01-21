'use client'

import { useState, useEffect, useRef } from 'react'
import type { SerializedProduct } from '@/lib/types'

const PRODUCT_NOT_FOUND_STATUS = 404
const PRODUCT_FETCH_ERROR = 'Failed to fetch product'

export function useProduct(id: string) {
  const [product, setProduct] = useState<SerializedProduct | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const fetchedId = useRef<string | null>(null)

  useEffect(() => {
    if (fetchedId.current === id) return
    fetchedId.current = id
    setLoading(true)

    fetch(`/api/products/${id}`, { cache: 'no-store' })
      .then((res) => {
        if (res.status === PRODUCT_NOT_FOUND_STATUS) return null
        if (!res.ok) throw new Error(PRODUCT_FETCH_ERROR)
        return res.json() as Promise<SerializedProduct>
      })
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading }
}
