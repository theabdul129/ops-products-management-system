import { Card } from '@/components/ui/card'
import { getOwners } from '@/lib/owners'
import { OwnersHeader } from '@/components/owners/owners-header'
import { OwnerCard } from '@/components/owners/owner-card'

export const metadata = {
  title: 'Product owners',
  description: 'Manage product owners',
}

export default async function OwnersPage() {
  const owners = await getOwners()

  return (
    <div className="space-y-6 sm:space-y-8">
      <OwnersHeader ownersCount={owners.length} />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {owners.length === 0 ? (
          <li className="col-span-full">
            <Card className="p-6 text-center sm:p-8">
              <p className="text-sm text-muted-foreground sm:text-base">No product owners found</p>
            </Card>
          </li>
        ) : (
          owners.map((owner) => (
            <li key={owner.id}>
              <OwnerCard owner={owner} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
