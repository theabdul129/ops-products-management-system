export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  const stringValue = String(value ?? 0)
  const parsed = Number(stringValue)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function decimalToNumber(value: unknown): number {
  if (value == null) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'object' && 'toNumber' in value) {
    const toNumberFn = (value as { toNumber?: unknown }).toNumber
    if (typeof toNumberFn === 'function') {
      return (value as { toNumber(): number }).toNumber()
    }
  }
  return toNumber(value)
}

export function ensureMinimum(value: number, minimum: number): number {
  return Math.max(value, minimum)
}
