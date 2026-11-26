"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Grid {
  rows: number
  cols: number
}

const DEFAULT_GRIDS = {
  "5x6": { rows: 6, cols: 5 },
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
} as const satisfies Record<string, Grid>

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS

interface PixelImageProps {
  src: string
  grid?: PredefinedGridKey
  customGrid?: Grid
  grayscaleAnimation?: boolean
  pixelFadeInDuration?: number
  maxAnimationDelay?: number
  className?: string
  sizes?: string
}

export const PixelImage = ({
  src,
  grid = "5x6",
  customGrid,
  pixelFadeInDuration = 420,
  maxAnimationDelay = 580,
  className,
  sizes = "(max-width: 768px) 224px, (max-width: 1024px) 256px, 280px",
}: PixelImageProps) => {
  const [removeGrid, setRemoveGrid] = useState(false)

  const { rows, cols } = useMemo(
    () => customGrid ?? DEFAULT_GRIDS[grid],
    [customGrid, grid]
  )

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const cleanupDelay = prefersReducedMotion
      ? 0
      : pixelFadeInDuration + maxAnimationDelay + 120

    const timer = window.setTimeout(() => {
      setRemoveGrid(true)
    }, cleanupDelay)

    return () => {
      window.clearTimeout(timer)
    }
  }, [pixelFadeInDuration, maxAnimationDelay])

  const pieces = useMemo(() => {
    if (removeGrid) return []

    const total = rows * cols
    return Array.from({ length: total }, (_, index) => ({
      delay: Math.round(((index * 37) % total) * (maxAnimationDelay / total)),
    }))
  }, [removeGrid, rows, cols, maxAnimationDelay])

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Image
        src={src}
        alt="Profile photo"
        fill
        priority
        loading="eager"
        fetchPriority="high"
        sizes={sizes}
        className="object-cover grayscale-0"
      />

      {!removeGrid ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {pieces.map((piece, index) => (
            <div
              key={index}
              className="pixel-reveal-tile bg-background"
              style={
                {
                  "--pixel-duration": `${pixelFadeInDuration}ms`,
                  "--pixel-delay": `${piece.delay}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
