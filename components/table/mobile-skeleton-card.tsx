import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const MOBILE_SKELETON_COUNT = 5

export function MobileSkeletonCards() {
  return (
    <>
      {Array.from({ length: MOBILE_SKELETON_COUNT }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
