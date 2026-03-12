"use client"

import { useEffect, useMemo, useState } from "react"
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
  pixelFadeInDuration?: number // in ms
  maxAnimationDelay?: number // in ms
  colorRevealDelay?: number // in ms
  showReplayButton?: boolean
  className?: string
}

export const PixelImage = ({
  src,
  grid = "6x4",
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
  showReplayButton = false,
  className,
}: PixelImageProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showColor, setShowColor] = useState(false)
  const [key, setKey] = useState(0)

  const MIN_GRID = 1
  const MAX_GRID = 16

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (grid?: Grid) => {
      if (!grid) {
        return false
      }
      const { rows, cols } = grid
      return (
        Number.isInteger(rows) &&
        Number.isInteger(cols) &&
        rows >= MIN_GRID &&
        cols >= MIN_GRID &&
        rows <= MAX_GRID &&
        cols <= MAX_GRID
      )
    }

    return isValidGrid(customGrid) ? customGrid! : DEFAULT_GRIDS[grid]
  }, [customGrid, grid])

  const resetAnimation = () => {
    setIsVisible(false)
    setShowColor(false)
    setKey(prev => prev + 1)
  }

  useEffect(() => {
    // Small delay to ensure proper animation on initial mount/refresh
    const startTimeout = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    const colorTimeout = setTimeout(() => {
      setShowColor(true)
    }, colorRevealDelay + 50)

    return () => {
      clearTimeout(startTimeout)
      clearTimeout(colorTimeout)
    }
  }, [colorRevealDelay, key])

  const pieces = useMemo(() => {
    const total = rows * cols
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      const clipPath = `polygon(
        ${col * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%,
        ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%
      )`

      // Use deterministic "random" based on index to avoid hydration issues
      const delay = ((index * 23) % total) * (maxAnimationDelay / total)
      return {
        clipPath,
        delay,
      }
    })
  }, [rows, cols, maxAnimationDelay])

  return (
    <div className={cn("relative", className)}>
      <div className="relative h-full w-full select-none" key={key}>
        {pieces.map((piece, index) => (
          <div
            className={cn(
              "absolute inset-0 transition-all ease-out",
              isVisible ? "opacity-100" : "opacity-0",
            )}
            key={index}
            style={{
              clipPath: piece.clipPath,
              transitionDelay: `${piece.delay}ms`,
              transitionDuration: `${pixelFadeInDuration}ms`,
            }}
          >
            <img
              alt={`Pixel piece ${index + 1}`}
              className={cn(
                "size-full object-cover",
                grayscaleAnimation && (showColor ? "grayscale-0" : "grayscale"),
              )}
              draggable={false}
              height={400}
              src={src}
              style={{
                transition: grayscaleAnimation
                  ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                  : "none",
              }}
              width={400}
            />
          </div>
        ))}
      </div>
      {showReplayButton && (
        <button
          type="button"
          className="absolute top-2 right-2 z-10 rounded-lg bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm transition-opacity hover:bg-black/70"
          onClick={resetAnimation}
        >
          Replay
        </button>
      )}
    </div>
  )
}

// Demo
export function Demo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <PixelImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
        grid="6x4"
        grayscaleAnimation
        showReplayButton
      />
    </div>
  )
}
