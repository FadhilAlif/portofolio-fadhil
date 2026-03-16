"use client"

import {
  DownloadIcon,
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
} from "@phosphor-icons/react"
import { SpotlightBackground } from "@/components/ui/spotlight"
import SkillCategory from "@/components/ui/skill-category"
import { EducationSection } from "@/components/section/education-section"
import { WorkSection } from "@/components/section/work-section"
import { PixelImage } from "@/components/icons/pixel-image"
import { FadhilSignatureEffect } from "@/components/ui/apple-hello-effect"
import { CodeEditor } from "@/components/ui/code-editor"
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/section/animated-section"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { Footer } from "@/components/section/footer"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "next-themes"
import { experiences, educations, skillGroups } from "@/lib/about-data"

// ─── Page Component ─────────────────────────────────────────────────────────

export default function Page() {
  const { resolvedTheme } = useTheme()

  // Use much lighter spotlight colors in light mode to prevent text blend/legibility issues
  const spotlightColors =
    resolvedTheme === "light"
      ? ["rgba(120, 119, 198, 0.12)", "rgba(59, 130, 246, 0.08)"]
      : ["rgba(120, 119, 198, 0.35)", "rgba(59, 130, 246, 0.25)"]

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
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
                words={[
                  "Full-Stack Engineer",
                  "Mobile Developer",
                  "Frontend Developer",
                  "Backend Developer",
                  "UI/UX Designer",
                ]}
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
                    <MapPinIcon className="h-4 w-4" /> Bantul, Yogyakarta
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
                    <GithubLogoIcon className="h-4 w-4" /> Github
                  </a>
                </StaggerItem>
              </StaggerContainer>

              <AnimatedSection variant="fade-up" delay={0.4} duration={0.7}>
                <div className="prose dark:prose-invert mx-auto max-w-2xl leading-relaxed text-muted-foreground md:mx-0 lg:text-lg">
                  <p>
                    Fresh Graduate in Information Technology currently working
                    as a Full-Stack Engineer at Telkomsigma, a subsidiary of PT
                    Telkom Indonesia. Experienced in building enterprise systems
                    and scalable web and mobile applications using modern
                    frontend and backend technologies. Strong in Agile
                    collaboration, cross-functional teamwork, and delivering
                    secure, reliable, and user-focused digital solutions.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection variant="fade-up" delay={0.5} duration={0.7}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <Link href="/contact" passHref>
                    <Button
                      variant="outline"
                      className="h-11 rounded-full border-border bg-transparent px-6 text-foreground hover:cursor-pointer hover:bg-muted"
                    >
                      <span className="text-sm">Contact Me</span>
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
                      <span className="pr-1 text-sm">Download CV</span>
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
                  src="/assets/fadhil-photo-profie.png"
                  grid="8x8"
                  className="h-full w-full object-cover grayscale-0"
                  grayscaleAnimation={true}
                  pixelFadeInDuration={800}
                />
              </div>
              <FadhilSignatureEffect
                className="h-20 pb-4 text-foreground/80 md:h-24"
                speed={1.2}
              />
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
              Experience
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
              Education
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
                Skills
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A selection of tools, languages, and frameworks I use to build
                digital solutions.
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
      </main>

      <Footer className="relative z-10" />
    </div>
  )
}
