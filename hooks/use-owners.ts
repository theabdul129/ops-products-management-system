'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { ProductOwnerItem } from '@/lib/types'

export type { ProductOwnerItem }

const OWNERS_API_URL = '/api/owners'
const OWNERS_ERROR_MESSAGE = 'Failed to fetch owners'
const OWNERS_TOAST_MESSAGE = 'Failed to load product owners'

type RawOwner = {
  id: number
  name: string
  slug: string
  email: string
  createdAt: string
  updatedAt: string
  _count?: { products: number }
}

function normalizeOwner(o: RawOwner): ProductOwnerItem {
  return {
    ...o,
    createdAt: new Date(o.createdAt),
    updatedAt: new Date(o.updatedAt),
  }
}

function handleFetchError(err: unknown): Error {
  const e = err instanceof Error ? err : new Error(OWNERS_ERROR_MESSAGE)
  console.error('Error fetching owners:', e)
  toast.error(OWNERS_TOAST_MESSAGE)
  return e
}

export function useOwners(): {
  owners: ProductOwnerItem[]
  loading: boolean
  error: Error | null
} {
  const [owners, setOwners] = useState<ProductOwnerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchOwners = async () => {
      try {
        const res = await fetch(OWNERS_API_URL)
        if (!res.ok) throw new Error(OWNERS_ERROR_MESSAGE)
        const data = (await res.json()) as RawOwner[]
        if (!cancelled) {
          setOwners(data.map(normalizeOwner))
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(handleFetchError(err))
          setOwners([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchOwners()
    return () => { cancelled = true }
  }, [])

  return { owners, loading, error }
}
