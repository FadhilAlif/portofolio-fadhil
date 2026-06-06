"use client"

import { AnimatedSection } from "@/components/section/animated-section"
import { AutoCarousel } from "@/components/ui/auto-carousel"
import { ProjectCard } from "@/components/ui/project-card"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { type ProjectItem } from "@/lib/projects-data"

export function ProjectsSection({ items }: { items: ProjectItem[] }) {
  const { t } = useTranslation()
  
  return (
    <AnimatedSection
      variant="fade-up"
      delay={0.1}
      duration={0.6}
      as="section"
      className="mt-16 flex w-full flex-col gap-6 border-t border-border pt-12"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("home.sectionProjects")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("home.projectsDescription")}
        </p>
      </div>

      <AutoCarousel
        items={items}
        keyExtractor={(p) => p.title}
        interval={5000}
        gap={16}
        itemMinWidth={320}
        renderItem={(project) => (
          <ProjectCard
            title={project.title}
            description={project.description}
            dates={project.dates}
            association={project.association}
            role={project.role}
            tags={project.tags}
            isInternal={project.isInternal}
            href={project.href}
            image={project.image}
            video={project.video}
            links={project.links}
            className="h-full"
          />
        )}
      />

      <Link
        href="/projects"
        className="group mt-2 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
      >
        {t("home.seeAllProjects")}
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </AnimatedSection>
  )
}
