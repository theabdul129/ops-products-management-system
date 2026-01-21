import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { OwnerWithCount } from '@/lib/types'

interface OwnerCardProps {
  owner: OwnerWithCount
}

export function OwnerCard({ owner }: OwnerCardProps) {
  return (
    <Card className="group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-elevated hover:ring-1 hover:ring-primary/20 sm:p-6 bg-card/80 backdrop-blur-sm border-border/60">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/15">
          <Users className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">{owner.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{owner.email}</p>
        </div>
      </div>
      <div className="relative mb-4 rounded-xl border border-border/50 bg-background/40 px-3 py-2 transition-colors duration-300 group-hover:bg-background/60">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Assigned products
        </p>
        <p className="mt-1 text-2xl font-bold text-foreground">{owner._count.products}</p>
      </div>
      <Button variant="ghost" size="sm" className="relative w-full gap-2 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary" asChild>
        <Link href={`/products?owner=${owner.slug}`}>
          Open product view
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </Card>
  )
}
