"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { SpotlightBackground } from "@/components/ui/spotlight"
import { ProjectCard } from "@/components/ui/project-card"
import { Footer } from "@/components/section/footer"
import { AnimatedSection } from "@/components/section/animated-section"
import {
  projects,
  PROJECT_FILTERS,
  getCategories,
  type FilterId,
} from "@/lib/projects-data"
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

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-2xl">
        🔍
      </div>
      <p className="text-sm font-medium text-foreground">No projects found</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Try selecting a different filter.
      </p>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all")
  const [visibleCount, setVisibleCount] = useState(9)

  // Compute per-filter counts
  const filterCounts = useMemo(() => {
    const counts: Record<FilterId, number> = {
      all: projects.length,
      web: 0,
      mobile: 0,
      private: 0,
    }
    for (const p of projects) {
      for (const cat of getCategories(p.category)) {
        counts[cat]++
      }
    }
    return counts
  }, [])

  // Filtered projects
  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((p) =>
            getCategories(p.category).includes(activeFilter)
          ),
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
        <Link
          href="/"
          className="text-xs font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          fadhil.dev / projects
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8">
        {/* ── Section Header ───────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          duration={0.6}
          className="flex flex-col items-center pt-16 pb-10 text-center"
        >
          {/* Decorated divider with badge */}
          {/* <div className="mb-8 flex w-full items-center">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            <div className="z-10 rounded-xl border bg-primary px-4 py-1">
              <span className="text-sm font-medium text-background">
                My Projects
              </span>
            </div>
            <div className="h-px flex-1 bg-linear-to-l from-transparent via-border to-transparent" />
          </div> */}

          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Check out my latest work
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground md:text-lg">
            From mobile apps to enterprise web platforms — here are a few
            highlights from my work.
          </p>
        </AnimatedSection>

        {/* ── Filter Bar ───────────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          duration={0.4}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-1 rounded-xl border border-border/60 bg-card/50 p-1.5 backdrop-blur-sm">
            {PROJECT_FILTERS.map((f) => (
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

        {/* ── Project Grid ─────────────────────────────────────────────── */}
        <div className="grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.slice(0, visibleCount).map((project, i) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="h-full"
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    dates={project.dates}
                    association={project.association}
                    role={project.role}
                    tags={project.tags}
                    isInternal={project.isInternal}
                    href={project.href}
                    image={project.image}
                    video={project.video}
                    links={project.links}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {visibleCount < filtered.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex justify-center pb-8"
          >
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Load More Projects
            </button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <Footer className="relative z-10 mt-16" />
    </div>
  )
}
