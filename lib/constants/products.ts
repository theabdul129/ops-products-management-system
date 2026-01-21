/**
 * Products page constants
 */

export const PRODUCTS_PAGE_CONSTANTS = {
  PAGE_SIZE: 10,
} as const

export const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  INACTIVE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  DISCONTINUED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const
