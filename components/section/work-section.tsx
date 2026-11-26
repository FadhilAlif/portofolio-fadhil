"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Accordion } from "@/components/arc/accordion/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MousePointerClick } from "lucide-react"
import { ArrowSquareOutIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useReadLocalStorage } from "@/hooks/use-read-local-storage"
import type { PortfolioMediaItem } from "@/types"
import { PhotoGallery } from "./photo-gallery"
import { useTranslation } from "react-i18next"

const WORK_HINT_STORAGE_KEY = "portfolio.work-section-hint-dismissed"

export type WorkItem = {
  company: string
  location: string
  role: string
  start: string
  end?: string
  description: string[]
  logoUrl: string
  companyUrl: string
  gallery?: PortfolioMediaItem[]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type LogoImageProps = {
  src: string
  alt: string
}

function LogoImage({ src, alt }: LogoImageProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div className="size-10 flex-none rounded-full border bg-muted p-1 shadow ring-2 ring-border" />
    )
  }

  return (
    <div className="relative size-10 flex-none overflow-hidden rounded-full border bg-muted shadow ring-2 ring-border">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="40px"
        className="object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

type DateBadgeProps = {
  start: string
  end?: string
}

function DateBadge({ start, end }: DateBadgeProps) {
  const { t } = useTranslation()

  return (
    <span className="inline-flex flex-none items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground tabular-nums">
      {start} – {end ?? t("workSection.present")}
    </span>
  )
}

type CompanyLinkProps = {
  company: string
  companyUrl: string
}

function CompanyLink({ company, companyUrl }: CompanyLinkProps) {
  const { t } = useTranslation()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group/link inline-flex min-h-6 min-w-6 items-center gap-1 py-0.5 leading-tight font-semibold underline-offset-2 hover:underline"
        >
          {company}
          <ArrowSquareOutIcon
            aria-hidden="true"
            className="size-3 opacity-0 transition-opacity duration-150 group-hover/link:opacity-60"
          />
        </a>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>{t("workSection.visitCompany", { company })}</span>
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export type WorkSectionProps = {
  items: WorkItem[]
  defaultOpenValue?: string
}

export function WorkSection({
  items,
  defaultOpenValue: propDefaultOpenValue,
}: WorkSectionProps) {
  const { t } = useTranslation()
  const [isHintLocallyDismissed, setIsHintLocallyDismissed] = useState(false)
  const isHintDismissed = useReadLocalStorage<boolean>(WORK_HINT_STORAGE_KEY, {
    initializeWithValue: false,
  })

  // Auto open TELKOMSIGMA (or current ongoing work) by default
  const defaultOpenIndex = useMemo(() => {
    if (propDefaultOpenValue) {
      const propIndex = items.findIndex(
        (item) => `${item.company}-${item.start}` === propDefaultOpenValue
      )
      if (propIndex >= 0) return propIndex
    }

    const ongoingIndex = items.findIndex(
      (item) =>
        item.company.toLowerCase().includes("telkomsigma") || !item.end
    )
    return ongoingIndex >= 0 ? ongoingIndex : 0
  }, [items, propDefaultOpenValue])

  const hasResolvedHintState = isHintDismissed !== undefined
  const showFirstItemHint =
    hasResolvedHintState &&
    !isHintLocallyDismissed &&
    isHintDismissed !== true &&
    items.length > 0

  const dismissFirstItemHint = () => {
    setIsHintLocallyDismissed(true)

    try {
      window.localStorage.setItem(WORK_HINT_STORAGE_KEY, "true")
      window.dispatchEvent(new Event("local-storage"))
    } catch {
      // Ignore storage write errors in restricted browser modes.
    }
  }

  return (
    <Accordion
      lazyMount
      defaultOpen={defaultOpenIndex}
      className="border-t-0! [&_[class*='item']]:border-border/50 [&_[class*='item']:last-child]:border-b-0 [&_[class*='panelInner']]:pr-0 [&_[class*='trigger']]:py-4 [&_[class*='trigger']]:items-start sm:[&_[class*='trigger']]:items-center"
      onValueChange={() => {
        if (!showFirstItemHint) {
          return
        }
        dismissFirstItemHint()
      }}
      items={items.map((work, index) => {
        const value = `${work.company}-${work.start}`
        const isFirstItem = index === 0

        return {
          id: value,
          title: (
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-x-3">
              {/* Left: logo + company info */}
              <div className="flex min-w-0 flex-1 items-center gap-x-3">
                <LogoImage src={work.logoUrl} alt={`${work.company} logo`} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-1.5 leading-none">
                    <CompanyLink
                      company={work.company}
                      companyUrl={work.companyUrl}
                    />
                    {isFirstItem && showFirstItemHint && (
                      <span
                        className={cn(
                          "inline-flex animate-pulse items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary transition-all duration-300 ease-out [[data-state=open]_&]:hidden"
                        )}
                      >
                        <MousePointerClick className="size-3" />
                        {t("workSection.clickHint")}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    {work.role}
                  </span>
                </div>
              </div>

              {/* Right: date badge */}
              <div className="pl-13 sm:pl-0">
                <DateBadge start={work.start} end={work.end} />
              </div>
            </div>
          ),
          content: (
            <div className="ml-13 space-y-5 pt-2 pb-1 text-sm text-muted-foreground">
              <ul className="space-y-3">
                {work.description.map((desc, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-primary/50">•</span>
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>

              {work.gallery && work.gallery.length > 0 && (
                <PhotoGallery photos={work.gallery} />
              )}
            </div>
          ),
        }
      })}
    />
  )
}

export default WorkSection
