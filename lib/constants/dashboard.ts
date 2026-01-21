/**
 * Dashboard-specific constants
 */

export const DASHBOARD_CONSTANTS = {
  LOW_STOCK_THRESHOLD: 20,
  PRODUCTS_OVER_TIME_MONTHS: 6,
  LOW_STOCK_LIMIT: 15,
  RECENT_PRODUCTS_LIMIT: 5,
} as const

export const CHART_COLORS = {
  CHART_1: 'var(--color-chart-1)',
  CHART_2: 'var(--color-chart-2)',
  CHART_3: 'var(--color-chart-3)',
  CHART_4: 'var(--color-chart-4)',
  CHART_5: 'var(--color-chart-5)',
} as const

export const STATUS_CHART_CONFIG = [
  { name: 'Active', fill: CHART_COLORS.CHART_1 },
  { name: 'Inactive', fill: CHART_COLORS.CHART_2 },
  { name: 'Discontinued', fill: CHART_COLORS.CHART_3 },
] as const
