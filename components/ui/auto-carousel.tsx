"use client"

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react"
import { motion, useMotionValue, animate } from "motion/react"
import { cn } from "@/lib/utils"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Button } from "./button"

// ─── Types ──────────────────────────────────────────────────────────────────

interface CarouselLayout {
  itemWidth: number
  totalGroups: number
}

interface AutoCarouselProps<T> {
  /** Data items to render */
  items: T[]
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode
  /** Unique key extractor */
  keyExtractor: (item: T, index: number) => string
  /** Auto-scroll interval in ms (default: 4000) */
  interval?: number
  /** Additional class on the outer wrapper */
  className?: string
  /** Gap between items in px (default: 16) */
  gap?: number
  /** Item minimum width in px (default: 300) */
  itemMinWidth?: number
  /** Max dot indicators before switching to compact mode (default: 7) */
  maxDots?: number
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function computeLayout(
  containerW: number,
  gap: number,
  itemMinWidth: number,
  itemCount: number
): CarouselLayout {
  if (containerW <= 0)
    return { itemWidth: itemMinWidth, totalGroups: Math.max(1, itemCount) }

  const visibleCount = Math.max(
    1,
    Math.floor((containerW + gap) / (itemMinWidth + gap))
  )
  const itemWidth = (containerW - gap * (visibleCount - 1)) / visibleCount
  const totalGroups = Math.ceil(itemCount / visibleCount)

  return { itemWidth, totalGroups }
}

function getVisibleGroups(total: number, active: number, maxDots: number) {
  if (total <= maxDots) {
    return Array.from({ length: total }, (_, index) => index)
  }

  const clampedMaxDots = Math.max(1, maxDots)
  const halfWindow = Math.floor(clampedMaxDots / 2)
  let start = active - halfWindow

  start = Math.max(0, Math.min(start, total - clampedMaxDots))

  return Array.from({ length: clampedMaxDots }, (_, index) => start + index)
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AutoCarousel<T>({
  items,
  renderItem,
  keyExtractor,
  interval = 4000,
  className,
  gap = 16,
  itemMinWidth = 300,
  maxDots = 7,
}: AutoCarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeGroup, setActiveGroup] = useState(0)

  // Single state object for layout — one setState call, no cascade
  const [layout, setLayout] = useState<CarouselLayout>({
    itemWidth: itemMinWidth,
    totalGroups: 1,
  })

  const { itemWidth, totalGroups } = layout

  // ── Recalculate layout via ResizeObserver ─────────────────────────────
  // ResizeObserver fires its callback asynchronously (including on first
  // observe), so the setState inside is a subscription update — no
  // cascading-render warning.

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      const containerW = el.clientWidth
      const next = computeLayout(containerW, gap, itemMinWidth, items.length)

      setLayout((prev) => {
        if (
          prev.itemWidth === next.itemWidth &&
          prev.totalGroups === next.totalGroups
        ) {
          return prev
        }
        return next
      })
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [gap, itemMinWidth, items.length])

  // ── Scroll to group ─────────────────────────────────────────────────────

  const scrollToGroup = useCallback(
    (groupIdx: number) => {
      const containerW = containerRef.current?.clientWidth ?? 0
      const { visibleCount } = (() => {
        if (containerW <= 0) return { visibleCount: 1 }
        return {
          visibleCount: Math.max(
            1,
            Math.floor((containerW + gap) / (itemMinWidth + gap))
          ),
        }
      })()

      const iw =
        (containerW - gap * (visibleCount - 1)) / Math.max(1, visibleCount)
      const scrollPerGroup = visibleCount * (iw + gap)
      const trackW = items.length * (iw + gap) - gap
      const maxScroll = Math.max(0, trackW - containerW)
      const target = Math.min(groupIdx * scrollPerGroup, maxScroll)

      animate(x, -target, {
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 0.8,
      })
      setActiveGroup(groupIdx)
    },
    [gap, itemMinWidth, items.length, x]
  )

  // ── Auto-scroll timer ───────────────────────────────────────────────────

  useEffect(() => {
    if (isHovered || isDragging || totalGroups <= 1) return

    const timer = setInterval(() => {
      setActiveGroup((prev) => {
        const next = (prev + 1) % totalGroups
        scrollToGroup(next)
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isHovered, isDragging, totalGroups, interval, scrollToGroup])

  // ── Navigation ──────────────────────────────────────────────────────────

  const goNext = () => scrollToGroup((activeGroup + 1) % totalGroups)
  const goPrev = () =>
    scrollToGroup((activeGroup - 1 + totalGroups) % totalGroups)

  // ── Drag end — snap to nearest group ────────────────────────────────────

  const handleDragEnd = () => {
    setIsDragging(false)
    const containerW = containerRef.current?.clientWidth ?? 0
    const visibleCount = Math.max(
      1,
      Math.floor((containerW + gap) / (itemMinWidth + gap))
    )
    const iw =
      (containerW - gap * (visibleCount - 1)) / Math.max(1, visibleCount)
    const scrollPerGroup = visibleCount * (iw + gap)
    const currentX = Math.abs(x.get())
    const nearestGroup = Math.round(currentX / scrollPerGroup)
    const clamped = Math.max(0, Math.min(nearestGroup, totalGroups - 1))
    scrollToGroup(clamped)
  }

  if (items.length === 0) return null

  // ── Indicator window ───────────────────────────────────────────────────

  const visibleGroups = getVisibleGroups(totalGroups, activeGroup, maxDots)

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Arrow ← Track → Arrow ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prev — desktop side */}
        <Button
          onClick={goPrev}
          aria-label="Previous"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:cursor-pointer hover:bg-card hover:text-foreground hover:shadow-sm sm:flex"
        >
          <CaretLeftIcon className="h-4 w-4" weight="bold" />
        </Button>

        {/* Track */}
        <div ref={containerRef} className="min-w-0 flex-1 overflow-hidden">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            style={{ x, gap }}
            drag="x"
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {items.map((item, i) => (
              <motion.div
                key={keyExtractor(item, i)}
                className="shrink-0"
                style={{ width: itemWidth }}
              >
                {renderItem(item, i)}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Next — desktop side */}
        <Button
          onClick={goNext}
          aria-label="Next"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:cursor-pointer hover:bg-card hover:text-foreground hover:shadow-sm sm:flex"
        >
          <CaretRightIcon className="h-4 w-4" weight="bold" />
        </Button>
      </div>

      {/* ── Bottom controls ────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {/* Mobile prev */}
        <Button
          onClick={goPrev}
          aria-label="Previous"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-card hover:text-foreground sm:hidden"
        >
          <CaretLeftIcon className="h-4 w-4" weight="bold" />
        </Button>

        {/* Indicator */}
        <div className="flex items-center gap-1.5">
          {visibleGroups.map((groupIndex) => (
            <button
              key={groupIndex}
              onClick={() => scrollToGroup(groupIndex)}
              aria-label={`Go to group ${groupIndex + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                groupIndex === activeGroup
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Mobile next */}
        <Button
          onClick={goNext}
          aria-label="Next"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-card hover:text-foreground sm:hidden"
        >
          <CaretRightIcon className="h-4 w-4" weight="bold" />
        </Button>
      </div>
    </div>
  )
}
