"use client"

import { AnimatedSection } from "@/components/section/animated-section"
import { AutoCarousel } from "@/components/ui/auto-carousel"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { type CertificateItem } from "@/lib/certificates-data"

export function CertificatesSection({ items }: { items: CertificateItem[] }) {
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
          {t("home.sectionCertificates")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("home.certificatesDescription")}
        </p>
      </div>

      <AutoCarousel
        items={items}
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
  )
}
