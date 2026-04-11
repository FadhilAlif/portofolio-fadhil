"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { XIcon } from "@phosphor-icons/react"

import type { PortfolioMediaItem } from "@/types"
import { cn } from "@/lib/utils"
import Image from "next/image"

type PhotoGalleryProps = {
  photos: PortfolioMediaItem[]
  className?: string
}

export function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<PortfolioMediaItem | null>(
    null
  )
  const mounted = typeof document !== "undefined"

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (activePhoto) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = originalOverflow
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [activePhoto])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePhoto(null)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  if (photos.length === 0) {
    return null
  }

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        {/* <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {title}
            </p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-muted-foreground">
            {photos.length} photos
          </span>
        </div> */}

        <div className="grid auto-cols-[minmax(180px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1 sm:auto-cols-[minmax(220px,1fr)] md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActivePhoto(photo)}
              className="group relative isolate overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <Image
                  src={photo.imageUrl}
                  alt={photo.alt ?? photo.title}
                  fill
                  sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 25vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="line-clamp-2 text-sm leading-snug font-semibold text-white">
                    {photo.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">
                    {photo.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {mounted && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {activePhoto && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    onClick={() => setActivePhoto(null)}
                  />

                  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setActivePhoto(null)}
                        aria-label="Close photo detail"
                        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-muted"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>

                      <div className="grid max-h-[calc(100vh-2rem)] grid-cols-1 overflow-hidden lg:grid-cols-[1.3fr_0.9fr]">
                        <div className="relative min-h-65 bg-muted lg:min-h-160">
                          <Image
                            src={activePhoto.imageUrl}
                            alt={activePhoto.alt ?? activePhoto.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="h-full w-full object-cover"
                            priority
                          />
                        </div>

                        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:p-8">
                          <div className="space-y-2">
                            {/* <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                              {title}
                            </p> */}
                            <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                              {activePhoto.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                              {activePhoto.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  )
}

export default PhotoGallery
