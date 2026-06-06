"use client"

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/section/animated-section"
import SkillCategory, { type SkillCategoryItem } from "@/components/ui/skill-category"
import { useTranslation } from "react-i18next"
import { type SkillGroup } from "@/lib/about-data"

export function SkillsSection({ groups }: { groups: SkillGroup[] }) {
  const { t } = useTranslation()
  
  return (
    <AnimatedSection
      variant="fade-up"
      delay={0.1}
      duration={0.6}
      as="section"
      className="flex w-full flex-col gap-6 border-t border-border pt-12"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("home.sectionSkills")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("home.skillsDescription")}
        </p>
      </div>

      <StaggerContainer
        className="mt-2 flex flex-col divide-y divide-border/50"
        staggerDelay={0.12}
        delayChildren={0.1}
      >
        {groups.map((group, index) => (
          <StaggerItem
            key={index}
            variant="fade-up"
            className="py-3 first:pt-0 last:pb-0"
          >
            <SkillCategory title={group.title} skills={group.skills} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </AnimatedSection>
  )
}
