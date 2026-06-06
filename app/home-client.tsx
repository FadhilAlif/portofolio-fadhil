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

import dynamic from "next/dynamic"
import { HeroSection } from "@/components/home/hero-section"

// Dynamically import below-the-fold sections to reduce initial bundle size
const ExperienceSection = dynamic(() => import("@/components/home/experience-section").then(mod => ({ default: mod.ExperienceSection })))
const EducationSection = dynamic(() => import("@/components/home/education-section").then(mod => ({ default: mod.EducationSection })))
const SkillsSection = dynamic(() => import("@/components/home/skills-section").then(mod => ({ default: mod.SkillsSection })))
const ProjectsSection = dynamic(() => import("@/components/home/projects-section").then(mod => ({ default: mod.ProjectsSection })))
const CertificatesSection = dynamic(() => import("@/components/home/certificates-section").then(mod => ({ default: mod.CertificatesSection })))
const StatsSection = dynamic(() => import("@/components/home/stats-section").then(mod => ({ default: mod.StatsSection })))
const ContactCtaSection = dynamic(() => import("@/components/home/contact-cta-section").then(mod => ({ default: mod.ContactCtaSection })))

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
