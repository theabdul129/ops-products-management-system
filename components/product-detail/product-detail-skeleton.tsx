import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Skeleton className="h-9 w-36 rounded-lg" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-6">
        <Card className="overflow-hidden border-border p-0 lg:col-span-4 h-[320px] sm:h-[420px] lg:h-auto lg:self-stretch lg:min-h-0">
          <Skeleton className="h-full w-full rounded-none" />
        </Card>
        <div className="space-y-4 lg:col-span-6">
          <Card className="border-border space-y-5 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-8 w-3/4 sm:h-9" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background/35 px-4 py-3 space-y-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="rounded-xl border border-border/70 bg-background/35 px-4 py-3 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/35 p-4 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border-border p-5 space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-44" />
              </div>
            </Card>
            <Card className="border-border p-5 space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </Card>
          </div>
          <Card className="border-border p-5 space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </Card>
        </div>
      </div>
    </div>
  )
}
