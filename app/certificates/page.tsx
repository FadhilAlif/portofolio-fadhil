"use client"

import { useState, useMemo } from "react"
import { SpotlightBackground } from "@/components/ui/spotlight"
import ExpandableCertificateGrid from "@/components/expandable-card-demo-grid"
import { Footer } from "@/components/section/footer"
import { AnimatedSection } from "@/components/section/animated-section"
import { certificates, CERTIFICATE_FILTERS, type FilterId } from "@/lib/certificates-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─── Filter Tab Component ─────────────────────────────────────────────────────

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      variant="ghost"
      className={cn(
        "relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all",
        active
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {label}
      <span
        className={cn(
          "flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-semibold tabular-nums",
          active
            ? "bg-background/20 text-background"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </Button>
  )
}

export default function CertificatesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all")

  // Compute per-filter counts
  const filterCounts = useMemo(() => {
    const counts: Record<FilterId, number> = {
      all: certificates.length,
      web: 0,
      mobile: 0,
      ai: 0,
      design: 0,
      others: 0,
    }
    for (const cert of certificates) {
      if (counts[cert.category] !== undefined) {
        counts[cert.category]++
      }
    }
    return counts
  }, [])

  // Filtered certificates
  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? certificates
        : certificates.filter((c) => c.category === activeFilter),
    [activeFilter]
  )
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      {/* Spotlight background */}
      <SpotlightBackground
        className="fixed inset-0 z-0 bg-background"
        colors={["rgba(120, 119, 198, 0.25)", "rgba(59, 130, 246, 0.15)"]}
        ambient={true}
      />

      {/* Breadcrumb header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-6 py-3 backdrop-blur">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev / certificates
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8">
        {/* ── Section Header ───────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          duration={0.6}
          className="flex flex-col items-center pt-16 pb-12 text-center"
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Certifications & Achievements
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground md:text-lg">
            A continuous journey of learning and professional growth.
          </p>
        </AnimatedSection>

        {/* ── Filter Bar ───────────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          duration={0.4}
          className="mb-8 flex flex-wrap justify-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border/60 bg-card/50 p-1.5 backdrop-blur-sm">
            {CERTIFICATE_FILTERS.map((f) => (
              <FilterTab
                key={f.id}
                label={f.label}
                count={filterCounts[f.id]}
                active={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
              />
            ))}
          </div>
        </AnimatedSection>

        {/* ── Certificate Grid ──────────────────────────────────────────── */}
        <AnimatedSection variant="fade-up" delay={0.2} duration={0.6}>
          <ExpandableCertificateGrid certificates={filtered} />
        </AnimatedSection>
      </main>

      {/* Footer */}
      <Footer className="relative z-10 mt-16" />
    </div>
  )
}
