import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProductsHeader() {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Inventory workspace
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Products
        </h1>
        <div className="mt-3 h-1 w-20 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Search, sort, and tune inventory views in one place.
        </p>
      </div>
      <Link href="/products/new" className="w-full lg:w-auto">
        <Button size="lg" className="w-full gap-2 lg:w-auto">
          <Plus className="h-4 w-4 shrink-0" />
          Add product
        </Button>
      </Link>
    </header>
  )
}
