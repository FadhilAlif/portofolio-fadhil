"use client"

import { AnimatedSection } from "@/components/section/animated-section"
import { MagicCard } from "@/components/ui/magic-card"
import { useThemeContext } from "@/components/theme-provider"
import { GithubLogoIcon } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { useTranslation } from "react-i18next"
import { siteConfig } from "@/lib/site-config"
import { getExperienceSummary } from "@/utils/experience-summary"
import { type WorkItem } from "@/components/section/work-section"

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-37 w-190 max-w-full rounded-lg border border-border/60 bg-card/35"
        aria-hidden="true"
      />
    ),
  }
)

const EXPERIENCE_COMPANIES_FOR_SUMMARY = new Set([
  "TELKOM INDONESIA",
  "HORUS TECHNOLOGY",
  "TELKOMSIGMA (Telkom Indonesia Subsidiary)",
])

export function StatsSection({ 
  totalProjects, 
  totalCertificates, 
  experiences 
}: { 
  totalProjects: number, 
  totalCertificates: number,
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
        <div className="overflow-hidden rounded-[inherit] bg-card/65 p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <GithubLogoIcon className="h-5 w-5 text-foreground" />
            <h4 className="text-sm font-medium text-foreground">
              {t("home.githubContributions")}
            </h4>
          </div>

          <div className="overflow-x-auto px-2 py-1">
            <div className="flex justify-center">
              <div className="w-fit min-w-max">
                <GitHubCalendar
                  username={siteConfig.github.username}
                  colorScheme={isDarkMode ? "dark" : "light"}
                  blockSize={13}
                  blockMargin={4}
                  fontSize={12}
                  theme={{
                    light: [
                      "#ebedf0",
                      "#9be9a8",
                      "#40c463",
                      "#30a14e",
                      "#216e39",
                    ],
                    dark: [
                      "#161b22",
                      "#0e4429",
                      "#006d32",
                      "#26a641",
                      "#39d353",
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </MagicCard>
    </AnimatedSection>
  )
}
