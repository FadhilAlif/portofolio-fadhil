"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import { useThemeContext } from "@/components/theme-provider"
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
  perLine: number
) {
  return `https://skillicons.dev/icons?i=${iconIds.join(",")}&theme=${theme}&perline=${perLine}`
}

function SkillCategory({
  title,
  skills,
  perLine = 12,
  className,
}: SkillCategoryProps) {
  const { isDarkMode } = useThemeContext()

  const theme = isDarkMode ? "dark" : "light"

  const iconIds = useMemo(
    () => skills.map((s) => s.iconId).filter((id): id is string => id !== null),
    [skills]
  )

  const skillsWithoutIcon = useMemo(
    () => skills.filter((s) => s.iconId === null),
    [skills]
  )

  const iconUrl = useMemo(
    () => buildSkillIconsUrl(iconIds, theme, perLine),
    [iconIds, theme, perLine]
  )

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h4>

      <div className="flex flex-col gap-3">
        {iconIds.length > 0 && (
          <Image
            src={iconUrl}
            alt={`${title} skill icons`}
            width={600}
            height={60}
            loading="lazy"
            unoptimized
            className="w-fit"
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

export default React.memo(SkillCategory)
