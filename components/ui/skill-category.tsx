"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export type SkillCategoryItem = {
  label: string
  iconId: string | null
}

export type SkillCategoryProps = {
  title: string
  skills: SkillCategoryItem[]
  perLine?: number
  className?: string
}

function buildSkillIconsUrl(
  iconIds: string[],
  theme: "light" | "dark",
  perLine: number,
): string {
  const icons = iconIds.join(",")
  return `https://skillicons.dev/icons?i=${icons}&theme=${theme}&perline=${perLine}`
}

export function SkillCategory({
  title,
  skills,
  perLine = 12,
  className,
}: SkillCategoryProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const iconIds = skills
    .map((s) => s.iconId)
    .filter((id): id is string => id !== null)

  const skillsWithoutIcon = skills.filter((s) => s.iconId === null)

  const theme = resolvedTheme === "light" ? "light" : "dark"

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h4>

      <div className="flex flex-col gap-3">
        {mounted && iconIds.length > 0 && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={buildSkillIconsUrl(iconIds, theme, perLine)}
            alt={`${title} skill icons`}
            className="w-fit"
            loading="lazy"
          />
        )}

        {!mounted && iconIds.length > 0 && (
          <div
            className="h-12 animate-pulse rounded-md bg-muted"
            aria-hidden="true"
          />
        )}

        {skillsWithoutIcon.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillsWithoutIcon.map((skill) => (
              <span
                key={skill.label}
                className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {skill.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillCategory
