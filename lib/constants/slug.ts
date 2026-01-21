/**
 * Slug generation constants
 */

export const SLUG_CONSTANTS = {
  MAX_ITERATIONS: 1000,
  DEFAULT_SLUG: 'item',
  SLUG_PATTERN: /\s+/g,
  INVALID_CHARS_PATTERN: /[^a-z0-9-]/g,
  MULTIPLE_HYPHENS_PATTERN: /-+/g,
  EDGE_HYPHENS_PATTERN: /^-|-$/g,
} as const
