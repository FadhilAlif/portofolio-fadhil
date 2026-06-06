"use client"

import { AnimatedSection } from "@/components/section/animated-section"
import { MagicCard } from "@/components/ui/magic-card"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { EnvelopeIcon, ArrowRightIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useThemeContext } from "@/components/theme-provider"
import { CLARITY_EVENTS, setClarityTag, trackClarityEvent } from "@/lib/clarity"

export function ContactCtaSection() {
  const { t } = useTranslation()
  const { isDarkMode } = useThemeContext()

  const trackContactButtonClick = () => {
    setClarityTag("contact_button_source", "cta")
    trackClarityEvent(CLARITY_EVENTS.contactButtonClick)
  }

  return (
    <AnimatedSection
      variant="fade-up"
      delay={0.1}
      duration={0.6}
      as="section"
      className="mt-16 mb-8 flex w-full flex-col items-center gap-6 border-t border-border pt-12"
    >
      <div className="w-full max-w-2xl rounded-2xl">
        <MagicCard
          mode="orb"
          glowFrom={isDarkMode ? "#7c3aed" : "#C4B5FD"}
          glowTo={isDarkMode ? "#3b82f6" : "#BFDBFE"}
          className="p-0"
        >
          <div className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
              <EnvelopeIcon
                className="h-7 w-7 text-primary"
                weight="duotone"
              />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t("home.letsWorkTogether")}
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("home.ctaDescription")}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t("home.availableBadge")}
            </div>

            <Link
              href="/contact"
              onClick={trackContactButtonClick}
            >
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="div"
                className="flex h-11 items-center space-x-2 bg-white px-8 text-black dark:bg-black dark:text-white"
              >
                <span className="text-sm font-medium">
                  {t("home.getInTouch")}
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </HoverBorderGradient>
            </Link>
          </div>
        </MagicCard>
      </div>
    </AnimatedSection>
  )
}
