"use client"

import { AnimatedSection } from "@/components/section/animated-section"
import { EducationSection as EduSec, type EducationItem } from "@/components/section/education-section"
import { useTranslation } from "react-i18next"

export function EducationSection({ items }: { items: EducationItem[] }) {
  const { t } = useTranslation()
  
  return (
    <AnimatedSection
      variant="fade-up"
      delay={0.1}
      duration={0.6}
      as="section"
      className="flex w-full flex-col gap-6 border-t border-border pt-12"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {t("home.sectionEducation")}
      </h2>
      <EduSec items={items} />
    </AnimatedSection>
  )
}
