import type { PriceLike } from '@/lib/types'

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

function hasToNumberMethod(value: unknown): value is { toNumber(): number } {
  return (
    value != null &&
    typeof value === 'object' &&
    'toNumber' in value &&
    typeof (value as { toNumber?: unknown }).toNumber === 'function'
  )
}

export function priceToNumber(value: unknown): number {
  if (value == null) return 0
  if (isValidNumber(value)) return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  if (hasToNumberMethod(value)) return value.toNumber()
  return 0
}

export function formatPrice(value: PriceLike | null | undefined): string {
  if (value == null) return '0.00'
  const numericValue = priceToNumber(value)
  if (Number.isNaN(numericValue)) return '0.00'
  return numericValue.toFixed(2)
}
