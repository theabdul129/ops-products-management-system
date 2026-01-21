import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'placeholder:text-muted-foreground flex min-h-24 w-full field-sizing-content rounded-lg border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.42))] px-3 py-2 text-base shadow-sm transition-[border-color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[linear-gradient(180deg,rgba(24,24,24,0.92),rgba(16,16,16,0.9))] md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
