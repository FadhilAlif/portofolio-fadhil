"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Grid {
  rows: number
  cols: number
}

const DEFAULT_GRIDS: Record<string, Grid> = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
}

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
  grid = "6x4",
  customGrid,
  grayscaleAnimation = true,
  pixelFadeInDuration = 800,
  maxAnimationDelay = 1200,
  className,
  sizes = "(max-width: 768px) 224px, (max-width: 1024px) 256px, 280px",
}: PixelImageProps) => {
  const [visible, setVisible] = useState(false)
  const [removeGrid, setRemoveGrid] = useState(false)

  const { rows, cols } = useMemo(() => {
    return customGrid ?? DEFAULT_GRIDS[grid]
  }, [customGrid, grid])

  useEffect(() => {
    const start = setTimeout(() => setVisible(true), 50)

    const finish = setTimeout(
      () => {
        setRemoveGrid(true)
      },
      pixelFadeInDuration + maxAnimationDelay + 200
    )

    return () => {
      clearTimeout(start)
      clearTimeout(finish)
    }
  }, [pixelFadeInDuration, maxAnimationDelay])

  const pieces = useMemo(() => {
    const total = rows * cols
    return Array.from({ length: total }, (_, index) => {
      const delay = ((index * 37) % total) * (maxAnimationDelay / total)
      return { delay }
    })
  }, [rows, cols, maxAnimationDelay])

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* Main Image */}
      <Image
        src={src}
        alt="Profile photo"
        fill
        priority
        sizes={sizes}
        className={cn(
          "object-cover transition-all duration-700",
          grayscaleAnimation && !visible ? "grayscale" : "grayscale-0"
        )}
      />

      {/* Pixel Overlay */}
      {!removeGrid && (
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {pieces.map((piece, index) => (
            <div
              key={index}
              className="bg-background"
              style={{
                opacity: visible ? 0 : 1,
                transition: `opacity ${pixelFadeInDuration}ms ease`,
                transitionDelay: `${piece.delay}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
