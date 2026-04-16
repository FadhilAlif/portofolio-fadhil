"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT"

const DIRECTIONS: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"]

const MOVING_MAP: Record<Direction, string> = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  BOTTOM:
    "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  RIGHT:
    "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
}

const HIGHLIGHT =
  "radial-gradient(75% 181.16% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)"

function rotateDirection(
  currentDirection: Direction,
  clockwise: boolean
): Direction {
  const currentIndex = DIRECTIONS.indexOf(currentDirection)
  const nextIndex = clockwise
    ? (currentIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length
    : (currentIndex + 1) % DIRECTIONS.length
  return DIRECTIONS[nextIndex]
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType
    containerClassName?: string
    className?: string
    duration?: number
    clockwise?: boolean
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false)
  const [direction, setDirection] = useState<Direction>("TOP")
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  // Only run the rotation interval when visible in viewport AND not hovered
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setIsVisible(entries[0]?.isIntersecting ?? false)
    },
    []
  )

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "100px",
    })
    observer.observe(el)

    return () => observer.disconnect()
  }, [handleIntersection])

  useEffect(() => {
    if (hovered || !isVisible) return

    const interval = setInterval(() => {
      setDirection((prev) => rotateDirection(prev, clockwise))
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [hovered, isVisible, duration, clockwise])

  return (
    <Tag
      ref={elementRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex h-min w-fit items-center justify-center overflow-visible rounded-full border bg-black/20 p-px transition duration-500 decoration-clone hover:bg-black/10 dark:bg-white/20",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "z-10 w-auto rounded-[inherit] bg-black px-4 py-2 text-white",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className="absolute inset-0 z-0 flex-none overflow-hidden rounded-[inherit]"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: MOVING_MAP[direction] }}
        animate={{
          background: hovered
            ? [MOVING_MAP[direction], HIGHLIGHT]
            : MOVING_MAP[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="absolute inset-[2px] z-[1] flex-none rounded-[100px] bg-black" />
    </Tag>
  )
}
