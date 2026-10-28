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

function GitHubContributionCalendar({ username }: { username: string }) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<ContributionPeriod>("last")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [days, setDays] = useState<ActivityDay[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<Partial<Record<ContributionPeriod, ActivityDay[]>>>({})

  useEffect(() => {
    const cached = cacheRef.current[selectedPeriod]
    if (cached) {
      setDays(cached)
      setError(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetch(
      `/api/github-contributions?username=${encodeURIComponent(username)}&year=${selectedPeriod}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<GitHubContributionsApiResponse>
      })
      .then((json) => {
        if (cancelled) return
        const contributions = Array.isArray(json.contributions)
          ? json.contributions.map((item) => ({
              date: item.date,
              count: item.count,
            }))
          : []
        cacheRef.current[selectedPeriod] = contributions
        setDays(contributions)
        setError(null)
        setIsLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError("Failed to load GitHub contribution data.")
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [username, selectedPeriod])

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate((current) => (current === date ? null : date))
  }, [])

  const activePeriod =
    PERIOD_OPTIONS.find((option) => option.value === selectedPeriod) ??
    PERIOD_OPTIONS[0]

  if (error && !days) {
    return <p className="text-sm text-muted-foreground">{error}</p>
  }

  if (!days) {
    return (
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
    )
  }

  return (
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
        <div
          role="group"
          aria-label="Filter contributions by period"
          className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-border/70 bg-muted/40 p-0.5"
        >
          {PERIOD_OPTIONS.map((option) => {
            const isActive = option.value === selectedPeriod
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedPeriod(option.value)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.buttonLabel}
              </button>
            )
          })}
        </div>
      }
    />
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

  const snapshotStats = [
    {
      label: t("home.totalProjects"),
      value: String(totalProjects),
    },
    {
      label: t("home.totalCertificates"),
      value: String(totalCertificates),
    },
    {
      label: t("home.yearsExperience"),
      value: yearsOfExperience.toFixed(1),
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
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {item.value}
              </p>
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
              <h4 className="text-sm font-medium text-foreground">
                {t("home.githubContributions")}
              </h4>
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
