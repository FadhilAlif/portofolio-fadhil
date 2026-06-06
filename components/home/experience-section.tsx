"use client"

import { AnimatedSection } from "@/components/section/animated-section"
import { WorkSection } from "@/components/section/work-section"
import { useTranslation } from "react-i18next"
import { type WorkItem } from "@/components/section/work-section"

export function ExperienceSection({ items }: { items: WorkItem[] }) {
  const { t } = useTranslation()
  
  return (
    <AnimatedSection
      variant="fade-up"
      duration={0.6}
      as="section"
      className="flex w-full flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {t("home.sectionExperience")}
      </h2>
      <WorkSection items={items} />
    </AnimatedSection>
  )
}
