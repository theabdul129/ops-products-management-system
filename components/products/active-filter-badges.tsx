import { Badge } from '@/components/ui/badge'
import { PRODUCT_STATUS_LABELS } from '@/lib/constants'
import type { ProductOwnerItem } from '@/lib/types'
import type { FilterState } from '@/components/products-filters'

interface ActiveFilterBadgesProps {
  total: number
  filters: FilterState
  owners: ProductOwnerItem[]
}

export function ActiveFilterBadges({ total, filters, owners }: ActiveFilterBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
        {total} {total === 1 ? 'product' : 'products'}
      </Badge>
      {filters.status?.map((status) => (
        <Badge key={status} variant="secondary" className="px-3 py-1">
          {PRODUCT_STATUS_LABELS[status as keyof typeof PRODUCT_STATUS_LABELS]}
        </Badge>
      ))}
      {filters.owner?.map((ownerSlug) => {
        const owner = owners.find((item) => item.slug === ownerSlug)
        return (
          <Badge key={ownerSlug} variant="secondary" className="px-3 py-1">
            {owner?.name ?? ownerSlug}
          </Badge>
        )
      })}
    </div>
  )
}
