"use client"

import {
  DownloadIcon,
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react"
import Image from "next/image"
import { SpotlightBackground } from "@/components/ui/spotlight"
import SkillCategory from "@/components/ui/skill-category"
import { EducationSection } from "@/components/section/education-section"
import { WorkSection } from "@/components/section/work-section"
import { PixelImage } from "@/components/icons/pixel-image"
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/section/animated-section"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { Footer } from "@/components/section/footer"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { MagicCard } from "@/components/ui/magic-card"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/ui/project-card"
import { AutoCarousel } from "@/components/ui/auto-carousel"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useTheme } from "next-themes"
import { getAboutData } from "@/lib/about-data"
import { getProjects } from "@/lib/projects-data"
import { getCertificates } from "@/lib/certificates-data"
import { getExperienceSummary } from "@/utils/experience-summary"
import { useTranslation } from "react-i18next"
import { getSupportedLanguage } from "@/lib/i18n/config"

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-37 w-190 max-w-full rounded-lg border border-border/60 bg-card/35"
        aria-hidden="true"
      />
    ),
  }
)

const EXPERIENCE_COMPANIES_FOR_SUMMARY = new Set([
  "TELKOM INDONESIA",
  "HORUS TECHNOLOGY",
  "TELKOMSIGMA (Telkom Indonesia Subsidiary)",
])

// ─── Page Component ─────────────────────────────────────────────────────────

const siteUrl = "https://fadhildev.my.id"
const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Fadhil Alif Priyatno",
  alternateName: ["Fadhil Dev", "Fadhil Alif"],
  url: siteUrl,
  image: `${siteUrl}/assets/fadhil-photo-profile.png`,
  email: "fadhil.alifp@gmail.com",
  jobTitle: "Full-Stack Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bantul",
    addressRegion: "Yogyakarta",
    addressCountry: "ID",
  },
  worksFor: {
    "@type": "Organization",
    name: "Telkomsigma",
  },
  sameAs: [
    "https://github.com/fadhilalif",
    "https://www.linkedin.com/in/fadhilalifpriyatno",
    "https://www.instagram.com/fdhlalf_",
  ],
}

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Fadhil Dev",
  alternateName: "Fadhil Alif Priyatno Portfolio",
  url: siteUrl,
  inLanguage: ["id-ID", "en-US"],
}

export default function Page() {
  const { t, i18n } = useTranslation()
  const { resolvedTheme } = useTheme()
  const language = getSupportedLanguage(i18n.resolvedLanguage)
  const { experiences, educations, skillGroups } = getAboutData(language)
  const projects = getProjects(language)
  const certificates = getCertificates(language)

  const totalProjects = projects.length
  const totalCertificates = certificates.length
  const { totalMonths: experienceMonths, totalYears: yearsOfExperience } =
    getExperienceSummary(experiences, {
      includedCompanies: EXPERIENCE_COMPANIES_FOR_SUMMARY,
    })

  const snapshotStats = [
    {
      label: t("home.totalProjects"),
      value: String(totalProjects),
    },
    {
      label: t("home.totalCertificates"),
      value: String(totalCertificates),
    },
    {
      label: t("home.yearsExperience"),
      value: yearsOfExperience.toFixed(1),
      description: t("home.monthsTotal", { count: experienceMonths }),
    },
  ]

  const roles = t("home.roles", { returnObjects: true }) as string[]
  // Use much lighter spotlight colors in light mode to prevent text blend/legibility issues
  const spotlightColors =
    resolvedTheme === "light"
      ? ["rgba(120, 119, 198, 0.12)", "rgba(59, 130, 246, 0.08)"]
      : ["rgba(120, 119, 198, 0.35)", "rgba(59, 130, 246, 0.25)"]

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />

      <SpotlightBackground
        className="fixed inset-0 z-0 bg-background"
        colors={spotlightColors}
        ambient={true}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8">
        {/* ── Hero & About Section ──────────────────────────────────────── */}
        <section className="relative mt-4 mb-8 flex w-full flex-col border-b border-border/50 py-12 md:py-20">
          <div className="relative z-10 flex min-h-[40vh] flex-col-reverse justify-center gap-12 md:flex-row md:items-center md:justify-between">
            {/* Text content — slides in from left */}
            <AnimatedSection
              variant="fade-left"
              duration={0.7}
              className="flex flex-1 flex-col text-center md:text-left"
            >
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                FADHIL ALIF PRIYATNO
              </h1>
              <TypingAnimation
                words={roles}
                className="mb-4 text-xl font-medium text-primary/80 md:text-2xl"
                typeSpeed={40}
                deleteSpeed={80}
                pauseDelay={2000}
                cursorStyle="underscore"
                loop
              />

              <StaggerContainer
                className="mb-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground md:justify-start lg:text-base"
                staggerDelay={0.08}
                delayChildren={0.3}
              >
                <StaggerItem variant="fade-up">
                  <span className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                    <MapPinIcon className="h-4 w-4" /> Yogyakarta
                  </span>
                </StaggerItem>
                <StaggerItem variant="fade-up">
                  <a
                    href="mailto:fadhil.alifp@gmail.com"
                    className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <EnvelopeIcon className="h-4 w-4" /> fadhil.alifp@gmail.com
                  </a>
                </StaggerItem>
                <StaggerItem variant="fade-up">
                  <a
                    href="https://www.linkedin.com/in/fadhilalifpriyatno"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <LinkedinLogoIcon className="h-4 w-4" /> LinkedIn
                  </a>
                </StaggerItem>
                <StaggerItem variant="fade-up">
                  <a
                    href="https://github.com/fadhilalif"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <GithubLogoIcon className="h-4 w-4" /> GitHub
                  </a>
                </StaggerItem>
              </StaggerContainer>

              <AnimatedSection variant="fade-up" delay={0.4} duration={0.7}>
                <div className="prose dark:prose-invert mx-auto max-w-2xl leading-relaxed text-muted-foreground md:mx-0 lg:text-lg">
                  <p>{t("home.intro")}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection variant="fade-up" delay={0.5} duration={0.7}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <Link href="/contact" passHref>
                    <Button
                      variant="outline"
                      className="h-11 rounded-full border-border bg-transparent px-6 text-foreground hover:cursor-pointer hover:bg-muted"
                    >
                      <span className="text-sm">{t("home.contactMe")}</span>
                    </Button>
                  </Link>

                  <a
                    href="https://cdn.fadhildev.my.id/personal/CV-Fadhil%20Alif%20Priyatno-2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      as="div"
                      className="flex h-11 items-center space-x-2 bg-white text-black dark:bg-black dark:text-white"
                    >
                      <span className="pr-1 text-sm">
                        {t("home.downloadCV")}
                      </span>
                      <DownloadIcon className="h-4 w-4" />
                    </HoverBorderGradient>
                  </a>
                </div>
              </AnimatedSection>
            </AnimatedSection>

            {/* Profile image — slides in from right */}
            <AnimatedSection
              variant="fade-right"
              delay={0.2}
              duration={0.8}
              className="flex shrink-0 flex-col items-center justify-center gap-6"
            >
              <div className="relative flex h-72 w-56 rotate-2 transform items-center justify-center overflow-hidden rounded-[2rem] border-[6px] border-background bg-background shadow-xl ring-1 ring-border/50 transition-transform duration-300 hover:rotate-0 md:h-80 md:w-64 lg:h-90 lg:w-70">
                <PixelImage
                  src="/assets/fadhil-photo-profie.avif"
                  grid="8x8"
                  className="h-full w-full object-cover grayscale-0"
                  grayscaleAnimation={true}
                  pixelFadeInDuration={800}
                />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Code Editor Section ──────────────────────────────────────── */}
        {/*<AnimatedSection
          variant="scale-in"
          delay={0.1}
          duration={0.8}
          as="section"
          className="mb-12"
        >
          <CodeEditor
            lang="typescript"
            title="about-me.ts"
            copyButton
            cursor
            writing
            inView
            duration={8}
            delay={0.3}
            className="h-85 shadow-lg shadow-border/20 sm:h-100 md:h-112 lg:h-125"
          >
            {aboutCode}
          </CodeEditor>
        </AnimatedSection>*/}

        {/* ── Dynamic Content Columns ──────────────────────────────────── */}
        <div className="mt-12 grid w-full grid-cols-1 gap-12">
          {/* Experience Section */}
          <AnimatedSection
            variant="fade-up"
            duration={0.6}
            as="section"
            className="flex w-full flex-col gap-6"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("home.sectionExperience")}
            </h3>
            <WorkSection items={experiences} />
          </AnimatedSection>

          {/* Education Section */}
          <AnimatedSection
            variant="fade-up"
            delay={0.1}
            duration={0.6}
            as="section"
            className="flex w-full flex-col gap-6 border-t border-border pt-12"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("home.sectionEducation")}
            </h3>
            <EducationSection items={educations} />
          </AnimatedSection>

          {/* Skills Section */}
          <AnimatedSection
            variant="fade-up"
            delay={0.1}
            duration={0.6}
            as="section"
            className="flex w-full flex-col gap-6 border-t border-border pt-12"
          >
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("home.sectionSkills")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("home.skillsDescription")}
              </p>
            </div>

            <StaggerContainer
              className="mt-2 flex flex-col divide-y divide-border/50"
              staggerDelay={0.12}
              delayChildren={0.1}
            >
              {skillGroups.map((group) => (
                <StaggerItem
                  key={group.title}
                  variant="fade-up"
                  className="py-3 first:pt-0 last:pb-0"
                >
                  <SkillCategory title={group.title} skills={group.skills} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatedSection>
        </div>

        {/* ── Projects Carousel ─────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          delay={0.1}
          duration={0.6}
          as="section"
          className="mt-16 flex w-full flex-col gap-6 border-t border-border pt-12"
        >
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("home.sectionProjects")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.projectsDescription")}
            </p>
          </div>

          <AutoCarousel
            items={projects}
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

        {/* ── Certificates Carousel ────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          delay={0.1}
          duration={0.6}
          as="section"
          className="mt-16 flex w-full flex-col gap-6 border-t border-border pt-12"
        >
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("home.sectionCertificates")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.certificatesDescription")}
            </p>
          </div>

          <AutoCarousel
            items={certificates}
            keyExtractor={(c) => c.id}
            interval={4000}
            gap={16}
            itemMinWidth={260}
            renderItem={(cert) => (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-border/80 hover:shadow-lg hover:ring-1 hover:shadow-primary/5 hover:ring-primary/10"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <h4 className="line-clamp-2 text-xs leading-snug font-semibold text-foreground">
                    {cert.title}
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    {cert.issuer}
                  </span>
                  <span className="mt-auto text-[10px] text-muted-foreground/60">
                    {cert.issuedDate}
                  </span>
                </div>
              </a>
            )}
          />

          <Link
            href="/certificates"
            className="group mt-2 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            {t("home.seeAllCertificates")}
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>

        <AnimatedSection
          variant="fade-up"
          delay={0.1}
          duration={0.6}
          as="section"
          className="mt-16 flex w-full flex-col gap-6 border-t border-border pt-12"
        >
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("home.sectionStats")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.statsDescription")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snapshotStats.map((item) => (
              <MagicCard
                key={item.label}
                mode="orb"
                glowFrom={resolvedTheme === "dark" ? "#7c3aed" : "#C4B5FD"}
                glowTo={resolvedTheme === "dark" ? "#3b82f6" : "#BFDBFE"}
                className="h-full rounded-xl p-0"
              >
                <div className="flex h-full min-h-32 flex-col rounded-[inherit] bg-card/65 p-5 backdrop-blur-sm">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {item.value}
                  </p>
                  {item.description ? (
                    <p className="mt-auto pt-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </MagicCard>
            ))}
          </div>

          <MagicCard
            mode="orb"
            glowFrom={resolvedTheme === "dark" ? "#7c3aed" : "#C4B5FD"}
            glowTo={resolvedTheme === "dark" ? "#3b82f6" : "#BFDBFE"}
            className="rounded-xl p-0"
          >
            <div className="overflow-hidden rounded-[inherit] bg-card/65 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <GithubLogoIcon className="h-5 w-5 text-foreground" />
                <h4 className="text-sm font-medium text-foreground">
                  {t("home.githubContributions")}
                </h4>
              </div>

              <div className="overflow-x-auto px-2 py-1">
                <div className="flex justify-center">
                  <div className="w-fit min-w-max">
                    <GitHubCalendar
                      username="FadhilAlif"
                      colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                      blockSize={13}
                      blockMargin={4}
                      fontSize={12}
                      theme={{
                        light: [
                          "#ebedf0",
                          "#9be9a8",
                          "#40c463",
                          "#30a14e",
                          "#216e39",
                        ],
                        dark: [
                          "#161b22",
                          "#0e4429",
                          "#006d32",
                          "#26a641",
                          "#39d353",
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </MagicCard>
        </AnimatedSection>

        {/* ── Contact CTA ─────────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          delay={0.1}
          duration={0.6}
          as="section"
          className="mt-16 mb-8 flex w-full flex-col items-center gap-6 border-t border-border pt-12"
        >
          <div className="w-full max-w-2xl rounded-2xl">
            <MagicCard
              mode="orb"
              glowFrom={resolvedTheme === "dark" ? "#7c3aed" : "#C4B5FD"}
              glowTo={resolvedTheme === "dark" ? "#3b82f6" : "#BFDBFE"}
              className="p-0"
            >
              <div className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
                  <EnvelopeIcon
                    className="h-7 w-7 text-primary"
                    weight="duotone"
                  />
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {t("home.letsWorkTogether")}
                </h3>

                <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t("home.ctaDescription")}
                </p>

                {/* Availability badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {t("home.availableBadge")}
                </div>

                <Link href="/contact">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="div"
                    className="flex h-11 items-center space-x-2 bg-white px-8 text-black dark:bg-black dark:text-white"
                  >
                    <span className="text-sm font-medium">
                      {t("home.getInTouch")}
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </HoverBorderGradient>
                </Link>
              </div>
            </MagicCard>
          </div>
        </AnimatedSection>
      </main>

      <Footer className="relative z-10" />
    </div>
  )
}
