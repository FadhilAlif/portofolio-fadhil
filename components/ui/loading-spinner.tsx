"use client"

import { Spinner } from "@/components/ui/spinner"

export default function LoadingSpinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Spinner variant="infinite" size={48} className="text-primary" />
    </div>
  )
}
