/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronDown } from "lucide-react"
import { ArrowSquareOutIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export type WorkItem = {
  company: string
  location: string
  role: string
  start: string
  end?: string
  description: string[]
  logoUrl: string
  companyUrl: string
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
    <img
      src={src}
      alt={alt}
      className="size-10 flex-none overflow-hidden rounded-full border object-contain p-1 shadow ring-2 ring-border"
      onError={() => setImageError(true)}
    />
  )
}

type DateBadgeProps = {
  start: string
  end?: string
}

function DateBadge({ start, end }: DateBadgeProps) {
  return (
    <span className="inline-flex flex-none items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
      {start} – {end ?? "Present"}
    </span>
  )
}

type CompanyLinkProps = {
  company: string
  companyUrl: string
}

function CompanyLink({ company, companyUrl }: CompanyLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group/link inline-flex items-center gap-1 leading-none font-semibold underline-offset-2 hover:underline"
        >
          {company}
          <ArrowSquareOutIcon className="size-3 opacity-0 transition-opacity duration-150 group-hover/link:opacity-60" />
        </a>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>Visit {company}</span>
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type WorkSectionProps = {
  items: WorkItem[]
}

export function WorkSection({ items }: WorkSectionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="flex w-full flex-col gap-6"
    >
      {items.map((work) => {
        const value = `${work.company}-${work.start}`

        return (
          <AccordionPrimitive.Item
            key={value}
            value={value}
            className="flex w-full flex-col gap-0"
          >
            {/* Trigger */}
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-start justify-between gap-x-3 text-left outline-none">
                {/* Left: logo + company info */}
                <div className="flex min-w-0 flex-1 items-center gap-x-3">
                  <LogoImage src={work.logoUrl} alt={`${work.company} logo`} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1.5 leading-none">
                      <CompanyLink
                        company={work.company}
                        companyUrl={work.companyUrl}
                      />
                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 stroke-2 text-muted-foreground transition-transform duration-200",
                          "group-data-[state=open]:rotate-180"
                        )}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {work.role}
                    </span>
                  </div>
                </div>

                {/* Right: date badge only */}
                <DateBadge start={work.start} end={work.end} />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>

            {/* Content */}
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <ul className="ml-13 space-y-3 pt-4 pb-1 text-sm text-muted-foreground">
                {work.description.map((desc, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-primary/50">•</span>
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        )
      })}
    </AccordionPrimitive.Root>
  )
}

export default WorkSection
