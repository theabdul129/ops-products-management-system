'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft, ImageMinus } from 'lucide-react'
import Link from 'next/link'
import { PRODUCT_STATUSES, PRODUCT_STATUS_LABELS } from '@/lib/constants'
import { useOwners } from '@/hooks/use-owners'
import { priceToNumber } from '@/lib/currency'
import type { ProductWithOwner } from '@/lib/products'
import { productFormSchema, type ProductFormValues } from '@/lib/product-validation'

interface ProductFormProps {
  product?: ProductWithOwner | null
  isEditing?: boolean
}

function getSafePreviewUrl(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:'
    if (!isHttp || !parsed.hostname) return null
    return trimmed
  } catch {
    return null
  }
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const { owners, loading: ownersLoading } = useOwners()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(getSafePreviewUrl(product?.imageUrl))
  const [imageError, setImageError] = useState(false)

  // Reset error when preview URL changes
  useEffect(() => {
    setImageError(false)
  }, [imagePreview])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: product?.sku || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product ? priceToNumber(product.price) : undefined,
      inventory: product ? product.inventory : undefined,
      imageUrl: product?.imageUrl || '',
      status: product?.status || 'ACTIVE',
      ownerId: product?.ownerId || 0,
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true)
    form.clearErrors()
    try {
      const url = isEditing ? `/api/products/${product?.id}` : '/api/products'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json().catch(() => ({ error: 'Failed to save product' }))
      const errorMessage = typeof data?.error === 'string' ? data.error : 'Failed to save product'

      if (!response.ok) {
        if (errorMessage.includes('SKU already exists')) {
          form.setError('sku', { type: 'manual', message: errorMessage })
        } else if (errorMessage.includes('Product owner not found')) {
          form.setError('ownerId', { type: 'manual', message: errorMessage })
        } else if (data?.details && Array.isArray(data.details)) {
          data.details.forEach((err: { path?: string[]; message?: string }) => {
            const field = err.path?.[0]
            if (field && field in values) {
              form.setError(field as keyof ProductFormValues, { type: 'manual', message: err.message ?? errorMessage })
            }
          })
        } else {
          form.setError('root', { type: 'manual', message: errorMessage })
        }
        toast.error(errorMessage)
        setIsSubmitting(false)
        return
      }

      const result = data
      toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully')
      router.push(`/products/${result.id}`)
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save product'
      form.setError('root', { type: 'manual', message })
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Link href="/products" className="inline-block">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to Products
        </Button>
      </Link>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Product editor
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {isEditing ? 'Edit product' : 'Create new product'}
        </h1>
        <div className="mt-3 h-1 w-20 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
      </div>

      <Card className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-xs text-muted-foreground">
              Fields marked with <span className="text-destructive font-medium">*</span> are required.
            </p>
            {form.formState.errors.root && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {form.formState.errors.root.message}
              </div>
            )}
            {imagePreview && (
              <div className="mb-4 sm:mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Image Preview
                </label>
                <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-muted ring-1 ring-border ring-offset-2 ring-offset-background sm:h-32 sm:w-32">
                  {imageError ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground/60">
                      <ImageMinus className="h-7 w-7" strokeWidth={1.25} aria-hidden="true" />
                      <span className="text-center text-[10px] leading-tight">Could not load</span>
                    </div>
                  ) : (
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      SKU <span className="text-destructive" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PROD-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name <span className="text-destructive" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wireless Headphones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Price <span className="text-destructive" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-7"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Inventory Count <span className="text-destructive" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e)
                        setImagePreview(getSafePreviewUrl(e.target.value))
                        setImageError(false)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste a URL to an image from the web
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Owner <span className="text-destructive" aria-hidden="true">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value && field.value > 0 ? field.value.toString() : undefined}
                      disabled={ownersLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={ownersLoading ? 'Loading owners…' : 'Select the owner'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {owners.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id.toString()}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-destructive" aria-hidden="true">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {PRODUCT_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-2 flex flex-col gap-3 pt-2 sm:flex-row sm:pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Product'
                    : 'Create Product'}
              </Button>
              <Link href="/products" className="w-full sm:w-auto">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
