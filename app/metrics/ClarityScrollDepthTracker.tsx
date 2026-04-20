"use client"

import { useEffect, useRef } from "react"
import { CLARITY_EVENTS, setClarityTag, trackClarityEvent } from "@/lib/clarity"

const SCROLL_DEPTH_THRESHOLD = 75

export default function ClarityScrollDepthTracker() {
  const trackedRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (trackedRef.current) return

      const doc = document.documentElement
      const maxScrollable = doc.scrollHeight - window.innerHeight
      if (maxScrollable <= 0) return

      const depth = (window.scrollY / maxScrollable) * 100
      if (depth < SCROLL_DEPTH_THRESHOLD) return

      trackedRef.current = true
      setClarityTag("scroll_depth", String(SCROLL_DEPTH_THRESHOLD))
      trackClarityEvent(CLARITY_EVENTS.scrollDepth75)
      window.removeEventListener("scroll", handleScroll)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return null
}
