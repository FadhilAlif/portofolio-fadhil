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
    let scheduled = false
    let idleCallbackId: number | undefined
    let initTimerId: ReturnType<typeof setTimeout> | undefined
    let fallbackTimerId: ReturnType<typeof setTimeout> | undefined

    const initialize = async () => {
      if (cancelled || window.__clarityInitialized) return

      const { default: Clarity } = await import("@microsoft/clarity")
      if (cancelled || window.__clarityInitialized) return

      Clarity.init(clarityProjectId)
      window.__clarityInitialized = true
    }

    const cleanupInteractionListeners = () => {
      window.removeEventListener("pointerdown", scheduleIdleInit)
      window.removeEventListener("keydown", scheduleIdleInit)
      window.removeEventListener("scroll", scheduleIdleInit)
      if (fallbackTimerId !== undefined) {
        clearTimeout(fallbackTimerId)
        fallbackTimerId = undefined
      }
    }

    const scheduleIdleInit = () => {
      if (cancelled || scheduled || window.__clarityInitialized) return
      scheduled = true
      cleanupInteractionListeners()

      const requestIdleCallback = window.requestIdleCallback
      if (typeof requestIdleCallback === "function") {
        idleCallbackId = requestIdleCallback(() => void initialize(), {
          timeout: 2000,
        })
      } else {
        initTimerId = globalThis.setTimeout(() => void initialize(), 0)
      }
    }

    const onReadyAfterLoad = () => {
      if (cancelled) return
      window.addEventListener("pointerdown", scheduleIdleInit, {
        passive: true,
        once: true,
      })
      window.addEventListener("keydown", scheduleIdleInit, {
        passive: true,
        once: true,
      })
      window.addEventListener("scroll", scheduleIdleInit, {
        passive: true,
        once: true,
      })
      fallbackTimerId = globalThis.setTimeout(scheduleIdleInit, 4000)
    }

    if (document.readyState === "complete") {
      onReadyAfterLoad()
    } else {
      window.addEventListener("load", onReadyAfterLoad, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener("load", onReadyAfterLoad)
      cleanupInteractionListeners()
      if (idleCallbackId !== undefined) {
        window.cancelIdleCallback(idleCallbackId)
      }
      if (initTimerId !== undefined) {
        clearTimeout(initTimerId)
      }
    }
  }, [clarityProjectId])

  return null
}
