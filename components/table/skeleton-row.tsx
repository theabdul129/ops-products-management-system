import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { COLUMN_LAYOUT } from '@/lib/constants/table'
import { cn } from '@/lib/utils'

export function SkeletonRow() {
  return (
    <TableRow className="border-border">
      <TableCell className={cn(COLUMN_LAYOUT[0].width, 'py-3')}>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[1].width, 'py-3')}>
        <Skeleton className="h-4 w-full max-w-[100px]" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[2].width, 'py-3')}>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[3].width, 'py-3')}>
        <Skeleton className="h-4 w-[90px]" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[4].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-4 w-14" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[5].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-4 w-8" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[6].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[7].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-4 w-20" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[8].width, 'py-3 text-center')}>
        <div className="flex justify-center gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  )
}
