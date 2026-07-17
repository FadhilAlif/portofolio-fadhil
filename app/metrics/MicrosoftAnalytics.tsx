"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    __clarityInitialized?: boolean
  }
}

export default function MicrosoftAnalytics() {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim()

  useEffect(() => {
    if (!clarityProjectId || window.__clarityInitialized) return

    let cancelled = false
    let idleCallbackId: number | undefined
    let fallbackTimerId: ReturnType<typeof setTimeout> | undefined

    const initialize = async () => {
      if (cancelled || window.__clarityInitialized) return

      const { default: Clarity } = await import("@microsoft/clarity")
      if (cancelled || window.__clarityInitialized) return

      Clarity.init(clarityProjectId)
      window.__clarityInitialized = true
    }

    const requestIdleCallback = window.requestIdleCallback

    if (typeof requestIdleCallback === "function") {
      idleCallbackId = requestIdleCallback(() => void initialize(), {
        timeout: 3000,
      })
    } else {
      fallbackTimerId = globalThis.setTimeout(() => void initialize(), 1500)
    }

    return () => {
      cancelled = true
      if (idleCallbackId !== undefined) {
        window.cancelIdleCallback(idleCallbackId)
      }
      if (fallbackTimerId !== undefined) {
        clearTimeout(fallbackTimerId)
      }
    }
  }, [clarityProjectId])

  return null
}
