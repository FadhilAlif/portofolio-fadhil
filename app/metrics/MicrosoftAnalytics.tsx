"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

declare global {
  interface Window {
    __clarityInitialized?: boolean
  }
}

export default function MicrosoftAnalytics() {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim()

  useEffect(() => {
    if (!clarityProjectId) return
    if (window.__clarityInitialized) return

    Clarity.init(clarityProjectId)
    window.__clarityInitialized = true
  }, [clarityProjectId])

  return null
}
