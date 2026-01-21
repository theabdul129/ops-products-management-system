/**
 * Validation-specific constants
 */

export const VALIDATION_CONSTANTS = {
  SKU_MAX_LENGTH: 50,
  SKU_FORMAT: /^[A-Z0-9_-]+$/,
} as const

export const VALIDATION_MESSAGES = {
  SKU_REQUIRED: 'SKU is required',
  SKU_MAX_LENGTH: (max: number) => `SKU must be at most ${max} characters`,
  SKU_FORMAT_INVALID: 'SKU can only contain letters, numbers, hyphens and underscores',
  NAME_REQUIRED: 'Name is required',
  NAME_EMPTY: 'Name cannot be empty',
  PRICE_NEGATIVE: 'Price cannot be negative',
  INVENTORY_NEGATIVE: 'Inventory cannot be negative',
  OWNER_REQUIRED: 'Owner is required',
  OWNER_POSITIVE: 'Owner ID must be positive',
} as const
