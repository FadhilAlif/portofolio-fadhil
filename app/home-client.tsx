"use client"

import { SpotlightBackground } from "@/components/ui/spotlight"
import { Footer } from "@/components/section/footer"
import { useThemeContext } from "@/components/theme-provider"
import { getAboutData } from "@/lib/about-data"
import { getProjects } from "@/lib/projects-data"
import { getCertificates } from "@/lib/certificates-data"
import { useTranslation } from "react-i18next"
import { getSupportedLanguage } from "@/lib/i18n/config"
import ClarityScrollDepthTracker from "@/app/metrics/ClarityScrollDepthTracker"

import { HeroSection } from "@/components/home/hero-section"
import { ExperienceSection } from "@/components/home/experience-section"
import { EducationSection } from "@/components/home/education-section"
import { SkillsSection } from "@/components/home/skills-section"
import { ProjectsSection } from "@/components/home/projects-section"
import { CertificatesSection } from "@/components/home/certificates-section"
import { StatsSection } from "@/components/home/stats-section"
import { ContactCtaSection } from "@/components/home/contact-cta-section"

export default function HomeClient() {
  const { i18n } = useTranslation()
  const { isDarkMode } = useThemeContext()
  const language = getSupportedLanguage(i18n.resolvedLanguage)
  
  const { experiences, educations, skillGroups } = getAboutData(language)
  const projects = getProjects(language)
  const certificates = getCertificates(language)

  const spotlightColors = !isDarkMode
    ? ["rgba(120, 119, 198, 0.12)", "rgba(59, 130, 246, 0.08)"]
    : ["rgba(120, 119, 198, 0.35)", "rgba(59, 130, 246, 0.25)"]

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <ClarityScrollDepthTracker />
      <SpotlightBackground
        className="fixed inset-0 z-0 bg-background"
        colors={spotlightColors}
        ambient={true}
      />

      <main id="main-content" className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8">
        <HeroSection />
        
        <div className="mt-12 grid w-full grid-cols-1 gap-12">
          <ExperienceSection items={experiences} />
          <EducationSection items={educations} />
          <SkillsSection groups={skillGroups} />
        </div>

        <ProjectsSection items={projects} />
        <CertificatesSection items={certificates} />
        <StatsSection 
          totalProjects={projects.length} 
          totalCertificates={certificates.length} 
          experiences={experiences} 
        />
        <ContactCtaSection />
      </main>

      <Footer className="relative z-10" />
    </div>
  )
}
