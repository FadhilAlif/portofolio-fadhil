"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "@/hooks/use-outside-click"
import Image from "next/image"
import { CertificateItem } from "@/lib/certificates-data"
import { Badge } from "@/components/ui/badge"

export default function ExpandableCertificateGrid({
  certificates,
}: {
  certificates: CertificateItem[]
}) {
  const [active, setActive] = useState<CertificateItem | boolean | null>(null)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(9)
  const [prevCerts, setPrevCerts] = useState(certificates)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (certificates !== prevCerts) {
    setPrevCerts(certificates)
    setVisibleCount(9)
  }

  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (zoomedImage) {
          setZoomedImage(null)
        } else {
          setActive(false)
        }
      }
    }

    if ((active && typeof active === "object") || zoomedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active, zoomedImage])

  useOutsideClick(ref, () => {
    if (zoomedImage) return
    setActive(null)
  })

  return (
    <>
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <AnimatePresence>
              {zoomedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-200 grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
                  onClick={() => setZoomedImage(null)}
                >
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="absolute top-4 right-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white shadow-xl backdrop-blur-md transition-colors hover:bg-white/20 sm:top-6 sm:right-6 lg:top-8 lg:right-8"
                    onClick={() => setZoomedImage(null)}
                  >
                    <CloseIcon className="h-5 w-5 text-white" />
                  </motion.button>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex h-full max-h-[90vh] w-full max-w-6xl items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={zoomedImage}
                      alt="Zoomed certificate"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {active && typeof active === "object" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 h-full w-full bg-black/20 backdrop-blur-sm"
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {active && typeof active === "object" ? (
                <div className="fixed inset-0 z-100 grid place-items-center p-4 sm:p-8">
                  <motion.button
                    key={`button-${active.id}-${id}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.05 } }}
                    className="fixed top-4 right-4 z-110 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm lg:hidden"
                    onClick={() => setActive(null)}
                  >
                    <CloseIcon />
                  </motion.button>
                  <motion.div
                    layoutId={`card-${active.id}-${id}`}
                    ref={ref}
                    className="scrollbar-hide flex max-h-full w-full max-w-[600px] flex-col overflow-hidden overflow-y-auto border border-border bg-card shadow-2xl sm:max-h-[90vh] sm:rounded-3xl dark:bg-neutral-900"
                  >
                    <motion.div
                      layoutId={`image-${active.id}-${id}`}
                      className="group/image relative h-60 w-full shrink-0 cursor-zoom-in overflow-hidden bg-muted sm:h-80"
                      onClick={() => setZoomedImage(active.image)}
                    >
                      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/image:opacity-100">
                        <span className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                          <MaximizeIcon className="h-4 w-4" /> Expand Image
                        </span>
                      </div>
                      <Image
                        fill
                        src={active.image}
                        alt={active.title}
                        className="object-cover object-top"
                        unoptimized
                      />
                    </motion.div>

                    <div className="flex flex-col p-6">
                      <div className="mb-4 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <motion.h3
                            layoutId={`title-${active.id}-${id}`}
                            className="text-xl leading-tight font-semibold text-foreground"
                          >
                            {active.title}
                          </motion.h3>
                          <motion.p
                            layoutId={`issuer-${active.id}-${id}`}
                            className="mt-1 font-medium text-primary"
                          >
                            {active.issuer}
                          </motion.p>
                        </div>

                        <motion.a
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          href={active.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                          View Credential
                        </motion.a>
                      </div>

                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-4 text-sm text-muted-foreground"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                          <div>
                            <span className="font-semibold text-foreground">
                              Issued:{" "}
                            </span>
                            {active.issuedDate}
                          </div>
                          {active.expirationDate && (
                            <div>
                              <span className="font-semibold text-foreground">
                                Expires:{" "}
                              </span>
                              {active.expirationDate}
                            </div>
                          )}
                        </div>

                        {active.description && (
                          <p className="mt-1 leading-relaxed">
                            {active.description}
                          </p>
                        )}

                        {active.skills && active.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {active.skills.map((skill) => (
                              <Badge
                                key={`${active.id}-${skill}`}
                                variant="outline"
                                className="rounded-full border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-foreground"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>
          </>,
          document.body
        )}
      <div className="mx-auto grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {certificates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-2xl">
                🏅
              </div>
              <p className="text-sm font-medium text-foreground">
                No certificates found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try selecting a different category filter.
              </p>
            </motion.div>
          ) : (
            certificates.slice(0, visibleCount).map((card, i) => (
              <motion.div
                layoutId={`card-${card.id}-${id}`}
                key={card.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onClick={() => setActive(card)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:ring-1 hover:shadow-primary/5 hover:ring-primary/10"
              >
                <div className="flex h-full w-full flex-col">
                  <motion.div
                    layoutId={`image-${card.id}-${id}`}
                    className="relative h-[220px] w-full overflow-hidden bg-muted"
                  >
                    <Image
                      fill
                      src={card.image}
                      alt={card.title}
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      unoptimized // Cloudflare R2 bucket images are external, avoiding Next.js image optimization costs if preferred, but we can leave it off if remotePattern is configed
                    />
                  </motion.div>
                  <div className="flex flex-1 flex-col p-5">
                    <motion.h3
                      layoutId={`title-${card.id}-${id}`}
                      className="line-clamp-2 text-base leading-snug font-semibold text-foreground"
                    >
                      {card.title}
                    </motion.h3>
                    <div className="mt-auto pt-2">
                      <motion.p
                        layoutId={`issuer-${card.id}-${id}`}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        {card.issuer}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {visibleCount < certificates.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex justify-center pb-8"
        >
          <button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="inline-flex items-center justify-center rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Load More Certificates
          </button>
        </motion.div>
      )}
    </>
  )
}

export const CloseIcon = ({ className }: { className?: string }) => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className || "h-4 w-4 text-black dark:text-neutral-900"}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}

export const MaximizeIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}
