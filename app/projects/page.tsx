"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { SpotlightBackground } from "@/components/ui/spotlight"
import { ProjectCard } from "@/components/ui/project-card"
import { Footer } from "@/components/section/footer"
import { AnimatedSection } from "@/components/section/animated-section"
import {
  getProjects,
  getProjectFilters,
  getCategories,
  type ProjectItem,
  type FilterId,
} from "@/lib/projects-data"
import useDebounce from "@/hooks/use-debounce"
import { FilterSearchToolbar } from "@/components/ui/filter-search-toolbar"
import { useTranslation } from "react-i18next"
import { getSupportedLanguage } from "@/lib/i18n/config"

const SEARCH_DEBOUNCE_MS = 350

function matchesProjectSearch(project: ProjectItem, query: string) {
  if (!query) {
    return true
  }

  return [
    project.title,
    project.description,
    project.association,
    project.role,
    ...project.tags,
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(query))
}

function EmptyState() {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-2xl">
        🔍
      </div>
      <p className="text-sm font-medium text-foreground">
        {t("projectsPage.noProjects")}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("projectsPage.noProjectsHint")}
      </p>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const language = getSupportedLanguage(i18n.resolvedLanguage)
  const projects = getProjects(language)
  const projectFilters = getProjectFilters(language)

  const [activeFilter, setActiveFilter] = useState<FilterId>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(9)

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS)
  const normalizedQuery = useMemo(
    () => debouncedQuery.trim().toLowerCase(),
    [debouncedQuery]
  )

  const filterCounts = useMemo(() => {
    const counts: Record<FilterId, number> = {
      all: projects.length,
      web: 0,
      mobile: 0,
      private: 0,
    }

    for (const project of projects) {
      for (const category of getCategories(project.category)) {
        counts[category]++
      }
    }

    return counts
  }, [projects])

  const filteredByCategory = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) =>
            getCategories(project.category).includes(activeFilter)
          ),
    [activeFilter, projects]
  )

  const filtered = useMemo(
    () =>
      filteredByCategory.filter((project) =>
        matchesProjectSearch(project, normalizedQuery)
      ),
    [filteredByCategory, normalizedQuery]
  )

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <SpotlightBackground
        className="fixed inset-0 z-0 bg-background"
        colors={["rgba(120, 119, 198, 0.25)", "rgba(59, 130, 246, 0.15)"]}
        ambient={true}
      />

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-6 py-3 backdrop-blur">
        <Link
          href="/"
          className="text-xs font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          {t("projectsPage.breadcrumb")}
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8">
        <AnimatedSection
          variant="fade-up"
          duration={0.6}
          className="flex flex-col items-center pt-16 pb-10 text-center"
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("projectsPage.title")}
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground md:text-lg">
            {t("projectsPage.subtitle")}
          </p>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" duration={0.4} className="mb-8">
          <FilterSearchToolbar
            filters={projectFilters}
            activeFilter={activeFilter}
            counts={filterCounts}
            onFilterChange={(filter) => {
              setActiveFilter(filter)
              setVisibleCount(9)
            }}
            searchValue={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value)
              setVisibleCount(9)
            }}
            searchInputId="project-search"
            searchLabel={t("projectsPage.searchLabel")}
            searchPlaceholder={t("projectsPage.searchPlaceholder")}
          />
        </AnimatedSection>

        <div className="grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.slice(0, visibleCount).map((project, index) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
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
              {t("projectsPage.loadMore")}
            </button>
          </motion.div>
        )}
      </main>

      <Footer className="relative z-10 mt-16" />
    </div>
  )
}
