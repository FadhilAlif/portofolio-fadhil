"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"

export interface SpotlightBackgroundProps {
  className?: string
  children?: React.ReactNode
  colors?: string | string[]
  size?: number
  blur?: number
  smoothing?: number
  ambient?: boolean
  opacity?: number
}

interface SpotlightPosition {
  x: number
  y: number
  targetX: number
  targetY: number
}

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

  const colorArray = useMemo(
    () => (Array.isArray(colors) ? colors : [colors]),
    [colors]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)")
    let width = 0
    let height = 0
    let tick = 0

    const applyPosition = (index: number) => {
      const element = spotlightElRefs.current[index]
      const spotlight = spotlightsRef.current[index]
      if (!element || !spotlight) return

      element.style.transform = `translate3d(${spotlight.x - size}px, ${spotlight.y - size}px, 0)`
    }

    const initializePositions = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const centerX = width / 2
      const centerY = height / 2

      spotlightsRef.current = colorArray.map((_, index) => {
        const x = centerX + (index - (colorArray.length - 1) / 2) * 50
        return { x, y: centerY, targetX: x, targetY: centerY }
      })
      spotlightsRef.current.forEach((_, index) => applyPosition(index))
    }

    const stopAnimation = () => {
      if (!animationRef.current) return
      cancelAnimationFrame(animationRef.current)
      animationRef.current = 0
    }

    const animate = () => {
      tick += 1
      const isAmbient =
        ambient &&
        !coarsePointerQuery.matches &&
        Date.now() - lastMouseMoveRef.current > 2000

      spotlightsRef.current.forEach((spotlight, index) => {
        if (isAmbient) {
          const offset = index * 0.5
          spotlight.targetX =
            width / 2 + Math.sin(tick * 0.005 + offset) * (width * 0.2)
          spotlight.targetY =
            height / 2 + Math.cos(tick * 0.003 + offset) * (height * 0.15)
        }

        spotlight.x += (spotlight.targetX - spotlight.x) * smoothing
        spotlight.y += (spotlight.targetY - spotlight.y) * smoothing
        applyPosition(index)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (
        animationRef.current ||
        document.hidden ||
        reducedMotionQuery.matches ||
        coarsePointerQuery.matches
      )
        return

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation()
      else startAnimation()
    }

    const handlePreferenceChange = () => {
      stopAnimation()
      initializePositions()
      startAnimation()
    }

    initializePositions()
    startAnimation()
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("resize", initializePositions)
    reducedMotionQuery.addEventListener("change", handlePreferenceChange)
    coarsePointerQuery.addEventListener("change", handlePreferenceChange)

    return () => {
      stopAnimation()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("resize", initializePositions)
      reducedMotionQuery.removeEventListener("change", handlePreferenceChange)
      coarsePointerQuery.removeEventListener("change", handlePreferenceChange)
    }
  }, [ambient, colorArray, size, smoothing])

  const updateTargets = useCallback(
    (clientX: number, clientY: number, immediate = false) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      lastMouseMoveRef.current = Date.now()

      spotlightsRef.current.forEach((spotlight, index) => {
        spotlight.targetX = x + (index - (colorArray.length - 1) / 2) * 30
        spotlight.targetY = y + (index - (colorArray.length - 1) / 2) * 20

        if (immediate) {
          spotlight.x = spotlight.targetX
          spotlight.y = spotlight.targetY
          const element = spotlightElRefs.current[index]
          if (element) {
            element.style.transform = `translate3d(${spotlight.x - size}px, ${spotlight.y - size}px, 0)`
          }
        }
      })
    },
    [colorArray.length, size]
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => updateTargets(event.clientX, event.clientY),
    [updateTargets]
  )

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      const touch = event.touches[0]
      if (touch) updateTargets(touch.clientX, touch.clientY, true)
    },
    [updateTargets]
  )

  const setSpotlightRef = useCallback(
    (index: number) => (element: HTMLDivElement | null) => {
      if (element) spotlightElRefs.current[index] = element
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
      {colorArray.map((color, index) => (
        <div
          key={`${color}-${index}`}
          ref={setSpotlightRef(index)}
          className="pointer-events-none absolute left-0 top-0 motion-safe:will-change-transform"
          style={{
            width: size * 2,
            height: size * 2,
            opacity,
            filter: `blur(${blur}px)`,
            background: `radial-gradient(${size}px circle at center, ${color}, transparent 70%)`,
          }}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(120,119,198,0.1)_0%,transparent_70%)] opacity-30 dark:bg-[radial-gradient(ellipse_at_50%_50%,rgba(30,30,50,0.3)_0%,transparent_70%)] dark:opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(255,255,255,0.6)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(10,10,10,0.8)_100%)]" />

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  )
}
