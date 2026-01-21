import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'

interface OwnersHeaderProps {
  ownersCount: number
}

export function OwnersHeader({ ownersCount }: OwnersHeaderProps) {
  return (
    <>
      <header>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Team directory
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Product owners
        </h1>
        <div className="mt-3 h-1 w-20 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Track ownership, scan responsibilities, and jump into each owner&apos;s catalog.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Ownership coverage
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-bold tracking-tight text-foreground">{ownersCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Active owner records</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/10">
              <Users className="h-7 w-7" />
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Quick routing
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Open filtered product views straight from each owner card below.
          </p>
        </Card>
      </div>
    </>
  )
}
