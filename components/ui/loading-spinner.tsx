"use client"

import { CircleNotchIcon } from "@phosphor-icons/react"

export default function LoadingSpinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <CircleNotchIcon className="h-8 w-8 animate-spin" weight="bold" />
    </div>
  )
}
