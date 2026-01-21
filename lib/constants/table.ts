/**
 * Table component constants
 */
import type { SortField } from '@/lib/types'

export const TABLE_CONSTANTS = {
  SKELETON_ROW_COUNT: 10,
  COLUMN_COUNT: 9,
} as const

export const COLUMN_LAYOUT = [
  { width: 'w-12', align: 'text-center' as const },
  { width: 'w-16', align: 'text-center' as const },
  { width: 'w-[200px]', align: 'text-left' as const },
  { width: 'w-[120px]', align: 'text-left' as const },
  { width: 'w-[100px]', align: 'text-right' as const },
  { width: 'w-[80px]', align: 'text-right' as const },
  { width: 'w-[100px]', align: 'text-center' as const },
  { width: 'w-[150px]', align: 'text-left' as const },
  { width: 'w-[120px]', align: 'text-center' as const },
] as const

export const SORTABLE_COLUMNS: { key: SortField; label: string; align?: 'center' }[] = [
  { key: 'name', label: 'Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Price', align: 'center' },
  { key: 'inventory', label: 'Inventory', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'createdAt', label: 'Created', align: 'center' },
]
