"use client"

import Link from "next/link"
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  EnvelopeIcon,
  InstagramLogoIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTranslation } from "react-i18next"

// ─── Nav Links ───────────────────────────────────────────────────────────────

const navLinks = [
  { labelKey: "footer.about", href: "/" },
  { labelKey: "footer.projects", href: "/projects" },
  { labelKey: "footer.certificates", href: "/certificates" },
  { labelKey: "footer.contact", href: "/contact" },
] as const

// ─── Social Links ─────────────────────────────────────────────────────────────

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
  {
    label: "Email",
    href: "mailto:fadhil.alifp@gmail.com",
    icon: EnvelopeIcon,
  },
]

// ─── Logo Mark ───────────────────────────────────────────────────────────────

function LogoMark() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2.5">
      {/* Icon box */}
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
        <Image
          src="/favicon.ico"
          alt={t("footer.logoAlt")}
          width={32}
          height={32}
        />
      </div>
      <span className="text-base font-semibold tracking-tight text-foreground">
        FADHIL<span className="text-primary">.DEV</span>
      </span>
    </div>
  )
}

// ─── Footer Component ─────────────────────────────────────────────────────────

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "relative mt-auto w-full border-t border-border/50",
        className
      )}
    >
      {/* Top separator shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center gap-8">
          <LogoMark />

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Dashed divider */}
          <div className="w-full border-t border-dashed border-border/40" />

          {/* Bottom row */}
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} Fadhil Alif P. {t("footer.copyright")}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={social.label}
                  className="group flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground transition-all duration-200 hover:border-border hover:bg-card hover:text-foreground"
                >
                  <social.icon
                    weight="bold"
                    className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
