"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { TechIcon } from "@/components/ui/tech-icon"

export type SkillCategoryItem = {
  label: string
  iconId: string | null
}

export type SkillCategoryProps = {
  title: string
  skills: SkillCategoryItem[]
  className?: string
  // perLine?: number; // No longer needed as flex-wrap handles the layout automatically
}

function SkillCategory({ title, skills, className }: SkillCategoryProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>

      <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:gap-5">
        {skills.map((skill) => (
          <TechIcon
            key={skill.label}
            tag={skill.label}
            iconId={skill.iconId}
            size={42} // Slightly larger for the About section (Projects uses 30)
          />
        ))}
      </div>
    </div>
  )
}

export default React.memo(SkillCategory)
