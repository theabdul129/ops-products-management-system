import { z } from 'zod'
import { PRODUCT_STATUSES } from '@/lib/constants'
import { VALIDATION_CONSTANTS, VALIDATION_MESSAGES } from '@/lib/constants/validation'

const imageUrlSchema = z
  .union([z.literal(''), z.string().url()])
  .optional()
  .transform((v) => (v === '' || v == null ? null : v))

const skuSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.SKU_REQUIRED)
  .max(VALIDATION_CONSTANTS.SKU_MAX_LENGTH, VALIDATION_MESSAGES.SKU_MAX_LENGTH(VALIDATION_CONSTANTS.SKU_MAX_LENGTH))
  .transform((s) => s.trim().toUpperCase())
  .refine((s) => VALIDATION_CONSTANTS.SKU_FORMAT.test(s), VALIDATION_MESSAGES.SKU_FORMAT_INVALID)

export const productFormSchema = z.object({
  sku: z
    .string()
    .min(1, VALIDATION_MESSAGES.SKU_REQUIRED)
    .max(VALIDATION_CONSTANTS.SKU_MAX_LENGTH)
    .transform((s) => s.trim().toUpperCase())
    .refine((s) => VALIDATION_CONSTANTS.SKU_FORMAT.test(s), VALIDATION_MESSAGES.SKU_FORMAT_INVALID),
  name: z.string().trim().min(1, VALIDATION_MESSAGES.NAME_REQUIRED),
  description: z.string().optional().transform((v) => (v == null || v === '' ? undefined : v)),
  price: z.coerce.number().nonnegative(VALIDATION_MESSAGES.PRICE_NEGATIVE),
  inventory: z.coerce.number().int().nonnegative(VALIDATION_MESSAGES.INVENTORY_NEGATIVE),
  imageUrl: imageUrlSchema,
  status: z.enum(PRODUCT_STATUSES),
  ownerId: z.coerce.number().int().positive(VALIDATION_MESSAGES.OWNER_REQUIRED),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const createProductSchema = z.object({
  sku: skuSchema,
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.NAME_REQUIRED)
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, VALIDATION_MESSAGES.NAME_REQUIRED),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative(VALIDATION_MESSAGES.PRICE_NEGATIVE),
  inventory: z.number().int().nonnegative(VALIDATION_MESSAGES.INVENTORY_NEGATIVE),
  imageUrl: imageUrlSchema,
  status: z.enum(PRODUCT_STATUSES).default('ACTIVE'),
  ownerId: z.number().int().positive(VALIDATION_MESSAGES.OWNER_POSITIVE),
})

export const updateProductSchema = z.object({
  sku: z
    .string()
    .min(1)
    .max(VALIDATION_CONSTANTS.SKU_MAX_LENGTH)
    .optional()
    .transform((s) => (s == null || s === '' ? undefined : s.trim().toUpperCase()))
    .refine((s) => s === undefined || VALIDATION_CONSTANTS.SKU_FORMAT.test(s), VALIDATION_MESSAGES.SKU_FORMAT_INVALID),
  name: z
    .string()
    .min(1)
    .optional()
    .transform((s) => (s == null ? undefined : s.trim()))
    .refine((s) => s == null || (typeof s === 'string' && s.length > 0), VALIDATION_MESSAGES.NAME_EMPTY),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
  inventory: z.number().int().nonnegative().optional(),
  imageUrl: imageUrlSchema,
  status: z.enum(PRODUCT_STATUSES).optional(),
  ownerId: z.number().int().positive().optional(),
})

export { imageUrlSchema }
