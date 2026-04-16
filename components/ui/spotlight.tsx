"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"

export interface SpotlightBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Spotlight color(s) - can be a single color or array for multiple spotlights */
  colors?: string | string[]
  /** Size of the spotlight gradient in pixels */
  size?: number
  /** Blur amount for softer edges */
  blur?: number
  /** Smoothing factor for cursor tracking (0-1, lower = smoother) */
  smoothing?: number
  /** Enable ambient drift when no mouse activity */
  ambient?: boolean
  /** Opacity of the spotlight */
  opacity?: number
}

interface SpotlightPosition {
  x: number
  y: number
  targetX: number
  targetY: number
}

/**
 * Animated spotlight background that follows the mouse cursor.
 *
 * Performance: Uses direct DOM manipulation via refs instead of React state
 * to avoid ~60 React re-renders per second from the rAF animation loop.
 */
export function SpotlightBackground({
  className,
  children,
  colors = ["rgba(120, 119, 198, 0.3)"],
  size = 400,
  blur = 80,
  smoothing = 0.1,
  ambient = true,
  opacity = 1,
}: SpotlightBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spotlightElRefs = useRef<HTMLDivElement[]>([])
  const spotlightsRef = useRef<SpotlightPosition[]>([])
  const animationRef = useRef<number>(0)
  const lastMouseMoveRef = useRef<number>(0)

  const colorArray = useMemo(() => {
    return Array.isArray(colors) ? colors : [colors]
  }, [colors])

  // Lerp helper
  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }, [])

  // Initialize spotlight positions + start animation loop
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const { width, height } = container.getBoundingClientRect()
    const centerX = width / 2
    const centerY = height / 2

    // Initialize positions
    spotlightsRef.current = colorArray.map((_, i) => ({
      x: centerX + (i - (colorArray.length - 1) / 2) * 50,
      y: centerY,
      targetX: centerX + (i - (colorArray.length - 1) / 2) * 50,
      targetY: centerY,
    }))

    // Apply initial background to each spotlight element
    spotlightElRefs.current.forEach((el, i) => {
      if (!el) return
      const s = spotlightsRef.current[i]
      el.style.background = `radial-gradient(${size}px circle at ${s.x}px ${s.y}px, ${colorArray[i]}, transparent 70%)`
    })

    // Animation loop — manipulates DOM directly, zero React re-renders
    let tick = 0

    const animate = () => {
      tick++
      const now = Date.now()
      const timeSinceMouseMove = now - lastMouseMoveRef.current
      const isAmbient = ambient && timeSinceMouseMove > 2000

      spotlightsRef.current.forEach((spotlight, i) => {
        // Ambient drift when no mouse activity
        if (isAmbient) {
          const offset = i * 0.5
          spotlight.targetX =
            width / 2 + Math.sin(tick * 0.005 + offset) * (width * 0.2)
          spotlight.targetY =
            height / 2 + Math.cos(tick * 0.003 + offset) * (height * 0.15)
        }

        // Smooth interpolation
        spotlight.x = lerp(spotlight.x, spotlight.targetX, smoothing)
        spotlight.y = lerp(spotlight.y, spotlight.targetY, smoothing)

        // Direct DOM update — no setState, no re-render
        const el = spotlightElRefs.current[i]
        if (el) {
          el.style.background = `radial-gradient(${size}px circle at ${spotlight.x}px ${spotlight.y}px, ${colorArray[i]}, transparent 70%)`
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [ambient, smoothing, lerp, size, colorArray])

  // Mouse tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      lastMouseMoveRef.current = Date.now()

      // Update target positions with slight offset for each spotlight
      spotlightsRef.current.forEach((spotlight, i) => {
        spotlight.targetX = x + (i - (colorArray.length - 1) / 2) * 30
        spotlight.targetY = y + (i - (colorArray.length - 1) / 2) * 20
      })
    },
    [colorArray.length]
  )

  // Touch support
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const container = containerRef.current
      if (!container || !e.touches[0]) return

      const rect = container.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const y = e.touches[0].clientY - rect.top

      lastMouseMoveRef.current = Date.now()

      spotlightsRef.current.forEach((spotlight, i) => {
        spotlight.targetX = x + (i - (colorArray.length - 1) / 2) * 30
        spotlight.targetY = y + (i - (colorArray.length - 1) / 2) * 20
      })
    },
    [colorArray.length]
  )

  // Ref setter for spotlight layer elements
  const setSpotlightRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      if (el) spotlightElRefs.current[index] = el
    },
    []
  )

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden bg-background", className)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Spotlight layers — updated via direct DOM manipulation */}
      {colorArray.map((_, i) => (
        <div
          key={i}
          ref={setSpotlightRef(i)}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity,
            filter: `blur(${blur}px)`,
            willChange: "background",
          }}
        />
      ))}

      {/* Subtle base gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(120,119,198,0.1)_0%,transparent_70%)] opacity-30 dark:bg-[radial-gradient(ellipse_at_50%_50%,rgba(30,30,50,0.3)_0%,transparent_70%)] dark:opacity-50" />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(255,255,255,0.6)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(10,10,10,0.8)_100%)]" />

      {/* Content layer */}
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  )
}
