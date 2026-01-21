'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ImageMinus } from 'lucide-react'

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

interface ProductDetailImageProps {
  imageUrl: string | null
  name: string
}

export function ProductDetailImage({ imageUrl, name }: ProductDetailImageProps) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [imageUrl])

  if (!imageUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted text-muted-foreground/50">
        <span
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 text-3xl font-bold tracking-wide text-primary sm:h-28 sm:w-28 sm:text-4xl"
          aria-label={`${name} initials`}
        >
          {getInitials(name)}
        </span>
        <p className="text-sm font-medium text-muted-foreground/60">No image provided</p>
      </div>
    )
  }

  if (imgError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted text-muted-foreground/50">
        <ImageMinus className="h-16 w-16 sm:h-20 sm:w-20" strokeWidth={1.25} aria-hidden="true" />
        <p className="text-sm font-medium text-muted-foreground/60">Image could not be loaded</p>
      </div>
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={name}
      fill
      className="object-cover"
      priority
      onError={() => setImgError(true)}
    />
  )
}
