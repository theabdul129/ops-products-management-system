'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

interface ProductImageProps {
  imageUrl: string | null
  name: string
  size: 'sm' | 'lg'
}

export function ProductImage({ imageUrl, name, size }: ProductImageProps) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [imageUrl])

  const dim = size === 'lg' ? 'h-14 w-14' : 'h-10 w-10'
  const iconSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
  const textSize = size === 'lg' ? 'text-base' : 'text-xs'

  if (!imageUrl) {
    return (
      <div className={cn('flex shrink-0 items-center justify-center rounded-lg border border-border/70 bg-primary/10 font-bold text-primary', dim, textSize)}>
        {getInitials(name)}
      </div>
    )
  }

  if (imgError) {
    return (
      <div className={cn('flex shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted text-muted-foreground/50', dim)}>
        <ImageOff className={iconSize} strokeWidth={1.5} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted', dim)}>
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
