"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export type EducationItem = {
  institution: string
  location?: string
  degree: string
  period: string
  gpa?: string
  description?: string[]
  logo?: string
  href?: string
}

type EducationSectionProps = {
  items: EducationItem[]
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

export function EducationSection({ items }: EducationSectionProps) {
  return (
    <section id="education" className="flex min-h-0 flex-col gap-y-6">
      <div className="flex flex-col gap-8">
        {items.map((education) => {
          const content = (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-x-3">
                {education.logo ? (
                  <Image
                    src={education.logo}
                    alt={education.institution}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="size-8 flex-none overflow-hidden rounded-full border object-contain p-1 shadow ring-2 ring-border md:size-10"
                  />
                ) : (
                  <div className="size-8 flex-none rounded-full border bg-muted p-1 shadow ring-2 ring-border md:size-10" />
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2 leading-none font-semibold">
                    {education.institution}

                    {education.href && (
                      <ArrowUpRight
                        className="h-3.5 w-3.5 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="font-sans text-sm text-muted-foreground">
                    {education.degree}
                  </div>
                </div>
              </div>

              <DateBadge
                start={education.period.split(" – ")[0]}
                end={education.period.split(" – ")[1]}
              />
            </>
          )

          return (
            <div key={education.institution} className="flex flex-col gap-3">
              {education.href ? (
                <Link
                  href={education.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-x-3"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-x-3">
                  {content}
                </div>
              )}

              <div className="ml-11 flex flex-col gap-2 text-sm text-muted-foreground md:ml-14">
                {education.gpa && (
                  <div className="font-medium text-foreground">
                    {education.gpa}
                  </div>
                )}

                {education.description && education.description.length > 0 && (
                  <ul className="space-y-1">
                    {education.description.map((desc, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 shrink-0 text-primary/50">•</span>
                        <span className="leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default EducationSection
