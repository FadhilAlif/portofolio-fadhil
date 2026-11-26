"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"
import { AnimatedSection } from "@/components/section/animated-section"
import { type WorkItem } from "@/components/section/work-section"
import { useThemeContext } from "@/components/theme-provider"
import {
  ActivityHeatmap,
  type ActivityDay,
} from "@/components/ui/activity-heatmap"
import { AnimatedCounter } from "@/components/arc/animated-counter/animated-counter"
import SegmentedControl from "@/components/arc/segmented-control/segmented-control"
import { MagicCard } from "@/components/ui/magic-card"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { getExperienceSummary } from "@/utils/experience-summary"

type ContributionPeriod = "last" | "2026" | "2025" | "2024"

const PERIOD_OPTIONS: readonly {
  value: ContributionPeriod
  buttonLabel: string
  periodText: string
  ariaLabel: string
}[] = [
  {
    value: "last",
    buttonLabel: "Last year",
    periodText: "the last year",
    ariaLabel: "Contributions in the last year",
  },
  {
    value: "2026",
    buttonLabel: "2026",
    periodText: "2026",
    ariaLabel: "Contributions in 2026",
  },
  {
    value: "2025",
    buttonLabel: "2025",
    periodText: "2025",
    ariaLabel: "Contributions in 2025",
  },
  {
    value: "2024",
    buttonLabel: "2024",
    periodText: "2024",
    ariaLabel: "Contributions in 2024",
  },
]

interface GitHubContributionsApiResponse {
  contributions?: ActivityDay[]
}

const githubContributionsCache = new Map<string, ActivityDay[]>()
const githubContributionsInFlight = new Map<string, Promise<ActivityDay[]>>()

function getGitHubContributionsCacheKey(
  username: string,
  period: ContributionPeriod
): string {
  return `${username}:${period}`
}

async function fetchGitHubContributions(
  username: string,
  period: ContributionPeriod
): Promise<ActivityDay[]> {
  const key = getGitHubContributionsCacheKey(username, period)
  const cached = githubContributionsCache.get(key)
  if (cached) {
    return cached
  }

  const inFlight = githubContributionsInFlight.get(key)
  if (inFlight) {
    return inFlight
  }

  const request = fetch(
    `/api/github-contributions?username=${encodeURIComponent(username)}&year=${period}`
  )
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json() as Promise<GitHubContributionsApiResponse>
    })
    .then((json) => {
      const contributions = Array.isArray(json.contributions)
        ? json.contributions.map((item) => ({
            date: item.date,
            count: item.count,
          }))
        : []
      githubContributionsCache.set(key, contributions)
      return contributions
    })
    .finally(() => {
      githubContributionsInFlight.delete(key)
    })

  githubContributionsInFlight.set(key, request)
  return request
}

function GitHubContributionCalendar({ username }: { username: string }) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<ContributionPeriod>("last")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dataState, setDataState] = useState<{
    daysByPeriod: Partial<Record<ContributionPeriod, ActivityDay[]>>
    errorsByPeriod: Partial<Record<ContributionPeriod, string>>
  }>({
    daysByPeriod: {},
    errorsByPeriod: {},
  })
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const days = dataState.daysByPeriod[selectedPeriod] ?? null
  const error = dataState.errorsByPeriod[selectedPeriod] ?? null
  const isLoading = shouldFetch && days === null && error === null

  const prefetchPeriod = useCallback(
    (period: string) => {
      void fetchGitHubContributions(
        username,
        period as ContributionPeriod
      ).catch(() => {
        // Ignore silent prefetch errors; active selection handles error UI.
      })
    },
    [username]
  )

  useEffect(() => {
    if (shouldFetch) return

    if (typeof IntersectionObserver === "undefined") {
      const fallbackId = globalThis.setTimeout(() => setShouldFetch(true), 0)
      return () => clearTimeout(fallbackId)
    }

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldFetch(true)
          observer.disconnect()
        }
      },
      { rootMargin: "300px 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldFetch])

  useEffect(() => {
    if (!shouldFetch) return

    let cancelled = false

    fetchGitHubContributions(username, selectedPeriod)
      .then((contributions) => {
        if (cancelled) return
        setDataState((prev) => {
          if (prev.daysByPeriod[selectedPeriod] === contributions) {
            return prev
          }
          const nextErrors = { ...prev.errorsByPeriod }
          delete nextErrors[selectedPeriod]
          return {
            daysByPeriod: {
              ...prev.daysByPeriod,
              [selectedPeriod]: contributions,
            },
            errorsByPeriod: nextErrors,
          }
        })
      })
      .catch(() => {
        if (cancelled) return
        setDataState((prev) => ({
          ...prev,
          errorsByPeriod: {
            ...prev.errorsByPeriod,
            [selectedPeriod]: "Failed to load GitHub contribution data.",
          },
        }))
      })

    return () => {
      cancelled = true
    }
  }, [username, selectedPeriod, shouldFetch])

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate((current) => (current === date ? null : date))
  }, [])

  const activePeriod =
    PERIOD_OPTIONS.find((option) => option.value === selectedPeriod) ??
    PERIOD_OPTIONS[0]

  return (
    <div ref={containerRef} className="min-h-[188px]">
      {error && !days ? (
        <p className="text-sm text-muted-foreground">{error}</p>
      ) : !days ? (
        <div
          className="flex w-full flex-col gap-3"
          aria-busy="true"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="h-5 w-48 animate-pulse rounded-md bg-muted/70" />
            <div className="h-6 w-40 animate-pulse rounded-md bg-muted/60" />
          </div>
          <div className="h-32 w-full animate-pulse rounded-lg border border-border/60 bg-card/35" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
          </div>
        </div>
      ) : (
        <ActivityHeatmap
          days={days}
          label={activePeriod.ariaLabel}
          period={activePeriod.periodText}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          thresholds={[3, 6, 12]}
          className={cn(
            "transition-opacity duration-200",
            isLoading && "opacity-75"
          )}
          actions={
            <SegmentedControl
              label="Filter contributions by period"
              value={selectedPeriod}
              onValueChange={(next) =>
                setSelectedPeriod(next as ContributionPeriod)
              }
              onOptionIntent={prefetchPeriod}
              options={PERIOD_OPTIONS.map((option) => ({
                value: option.value,
                label: option.buttonLabel,
              }))}
            />
          }
        />
      )}
    </div>
  )
}

const EXPERIENCE_COMPANIES_FOR_SUMMARY = new Set([
  "TELKOM INDONESIA",
  "HORUS TECHNOLOGY",
  "TELKOMSIGMA (Telkom Indonesia Subsidiary)",
])

export function StatsSection({
  totalProjects,
  totalCertificates,
  experiences,
}: {
  totalProjects: number
  totalCertificates: number
  experiences: WorkItem[]
}) {
  const { t } = useTranslation()
  const { isDarkMode } = useThemeContext()

  const { totalMonths: experienceMonths, totalYears: yearsOfExperience } =
    getExperienceSummary(experiences, {
      includedCompanies: EXPERIENCE_COMPANIES_FOR_SUMMARY,
    })

  const snapshotStats: {
    label: string
    value: number
    decimals?: number
    description?: string
  }[] = [
    {
      label: t("home.totalProjects"),
      value: totalProjects,
    },
    {
      label: t("home.totalCertificates"),
      value: totalCertificates,
    },
    {
      label: t("home.yearsExperience"),
      value: Number(yearsOfExperience.toFixed(1)),
      decimals: 1,
      description: t("home.monthsTotal", { count: experienceMonths }),
    },
  ]

  return (
    <AnimatedSection
      variant="fade-up"
      delay={0.1}
      duration={0.6}
      as="section"
      className="mt-16 flex w-full flex-col gap-6 border-t border-border pt-12"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("home.sectionStats")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("home.statsDescription")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snapshotStats.map((item) => (
          <MagicCard
            key={item.label}
            mode="orb"
            glowFrom={isDarkMode ? "#7c3aed" : "#C4B5FD"}
            glowTo={isDarkMode ? "#3b82f6" : "#BFDBFE"}
            className="h-full rounded-xl p-0"
          >
            <div className="flex h-full min-h-32 flex-col rounded-[inherit] bg-card/65 p-5 backdrop-blur-sm">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {item.label}
              </p>
              <div className="mt-2">
                <AnimatedCounter
                  value={item.value}
                  decimals={item.decimals ?? 0}
                  animateOnView
                />
              </div>
              {item.description ? (
                <p className="mt-auto pt-2 text-xs text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </MagicCard>
        ))}
      </div>

      <MagicCard
        mode="orb"
        glowFrom={isDarkMode ? "#7c3aed" : "#C4B5FD"}
        glowTo={isDarkMode ? "#3b82f6" : "#BFDBFE"}
        className="rounded-xl p-0"
      >
        <div className=" rounded-[inherit] bg-card/65 p-4 backdrop-blur-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GithubLogoIcon className="h-5 w-5 text-foreground" />
              <h3 className="text-sm font-medium text-foreground">
                {t("home.githubContributions")}
              </h3>
            </div>
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              @{siteConfig.github.username}
            </a>
          </div>

          <GitHubContributionCalendar username={siteConfig.github.username} />
        </div>
      </MagicCard>
    </AnimatedSection>
  )
}
