"use client"

import {
  DownloadIcon,
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react"
import { PixelImage } from "@/components/icons/pixel-image"
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/section/animated-section"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { CLARITY_EVENTS, setClarityTag, trackClarityEvent } from "@/lib/clarity"
import { siteConfig } from "@/lib/site-config"

export function HeroSection() {
  const { t } = useTranslation()
  const roles = t("home.roles", { returnObjects: true }) as string[]

  const trackDownloadCvClick = () => {
    setClarityTag("download_asset", "cv")
    trackClarityEvent(CLARITY_EVENTS.downloadCvClick)
  }

  const trackContactButtonClick = (source: "hero" | "cta") => {
    setClarityTag("contact_button_source", source as any)
    trackClarityEvent(CLARITY_EVENTS.contactButtonClick)
  }

  const trackSocialLinkClick = (platform: "email" | "linkedin" | "github") => {
    setClarityTag("social_platform", platform)
    trackClarityEvent(CLARITY_EVENTS.socialLinkClick)
  }

  return (
    <section className="relative mt-4 mb-8 flex w-full flex-col border-b border-border/50 py-12 md:py-20">
      <div className="relative z-10 flex min-h-[40vh] flex-col-reverse justify-center gap-12 md:flex-row md:items-center md:justify-between">
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
                href={`mailto:${siteConfig.email}`}
                onClick={() => trackSocialLinkClick("email")}
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <EnvelopeIcon className="h-4 w-4" /> {siteConfig.email}
              </a>
            </StaggerItem>
            <StaggerItem variant="fade-up">
              <a
                href={siteConfig.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialLinkClick("linkedin")}
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <LinkedinLogoIcon className="h-4 w-4" /> LinkedIn
              </a>
            </StaggerItem>
            <StaggerItem variant="fade-up">
              <a
                href={siteConfig.github.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialLinkClick("github")}
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
              <Link
                href="/contact"
                passHref
                onClick={() => trackContactButtonClick("hero")}
              >
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-border bg-transparent px-6 text-foreground hover:cursor-pointer hover:bg-muted"
                >
                  <span className="text-sm">{t("home.contactMe")}</span>
                </Button>
              </Link>

              <a
                href={siteConfig.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackDownloadCvClick}
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
  )
}
