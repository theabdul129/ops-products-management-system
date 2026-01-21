import Link from 'next/link'
import { Package, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Control center
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Dashboard
        </h1>
        <div className="mt-3 h-1 w-20 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
        <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2 sm:text-base">
          Product management overview
        </p>
      </div>
      <nav className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
        <Link href="/products/new" className="w-full sm:w-auto">
          <Button className="w-full gap-2 shadow-primary-glow sm:w-auto">
            <Package className="h-4 w-4" />
            Add product
          </Button>
        </Link>
        <Link href="/products" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full gap-2 sm:w-auto">
            <Package className="h-4 w-4" />
            View all products
          </Button>
        </Link>
        <Link href="/owners" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full gap-2 sm:w-auto">
            <Users className="h-4 w-4" />
            Manage owners
          </Button>
        </Link>
      </nav>
    </header>
  )
}
