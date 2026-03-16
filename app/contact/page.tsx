"use client"

import {
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  InstagramLogoIcon,
} from "@phosphor-icons/react"
import { ContactForm } from "@/components/section/contact-form"
import { Footer } from "@/components/section/footer"
import { AnimatedSection } from "@/components/section/animated-section"
import { SpotlightBackground } from "@/components/ui/spotlight"

// ─── Contact Info Items ───────────────────────────────────────────────────────

const contactInfo = [
  {
    label: "Email",
    value: "fadhil.alifp@gmail.com",
    href: "mailto:fadhil.alifp@gmail.com",
    icon: EnvelopeIcon,
  },
  {
    label: "Location",
    value: "Bantul, Yogyakarta",
    href: null,
    icon: MapPinIcon,
  },
]

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/fadhilalif",
    icon: GithubLogoIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/fadhilalifpriyatno",
    icon: LinkedinLogoIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/fdhlalf_",
    icon: InstagramLogoIcon,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      {/* Spotlight aura */}
      <SpotlightBackground
        className="fixed inset-0 z-0 bg-background"
        colors={["rgba(120, 119, 198, 0.25)", "rgba(59, 130, 246, 0.15)"]}
        ambient={true}
      />

      {/* Breadcrumb header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-6 py-3 backdrop-blur">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev / contact
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          duration={0.6}
          className="flex flex-col pt-16 pb-4"
        >
          {/* Mail icon badge */}
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
            <EnvelopeIcon className="h-6 w-6 text-primary" weight="duotone" />
          </div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Get in touch
          </h1>
          <p className="max-w-lg text-base text-muted-foreground md:text-lg">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to bring your visions to life.
          </p>
        </AnimatedSection>

        {/* ── Two column grid ───────────────────────────────────────────── */}
        <div className="mt-12 grid w-full grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left — contact info */}
          <AnimatedSection
            variant="fade-left"
            delay={0.1}
            duration={0.7}
            className="flex flex-col gap-10"
          >
            {/* Contact details */}
            <div className="flex flex-col gap-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="group flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      {item.value}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border/50" />

            {/* Socials */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Socials
              </span>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="group flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-card hover:text-primary"
                  >
                    <s.icon
                      className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                      weight="bold"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for new opportunities
            </div>
          </AnimatedSection>

          {/* Right — form */}
          <AnimatedSection variant="fade-right" delay={0.2} duration={0.7}>
            <ContactForm />
          </AnimatedSection>
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-10 mt-16" />
    </div>
  )
}
