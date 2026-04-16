"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { SpotlightBackground } from "@/components/ui/spotlight"
import ExpandableCertificateGrid from "@/components/expandable-card-demo-grid"
import { Footer } from "@/components/section/footer"
import { AnimatedSection } from "@/components/section/animated-section"
import {
  getCertificates,
  getCertificateFilters,
  type CertificateItem,
  type FilterId,
} from "@/lib/certificates-data"
import useDebounce from "@/hooks/use-debounce"
import { FilterSearchToolbar } from "@/components/ui/filter-search-toolbar"
import { useTranslation } from "react-i18next"
import { getSupportedLanguage } from "@/lib/i18n/config"

const SEARCH_DEBOUNCE_MS = 350

function matchesCertificateSearch(certificate: CertificateItem, query: string) {
  if (!query) {
    return true
  }

  return [
    certificate.title,
    certificate.issuer,
    certificate.description,
    certificate.credentialId,
    certificate.issuedDate,
    certificate.expirationDate,
    ...(certificate.skills ?? []),
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(query))
}

export default function CertificatesPage() {
  const { t, i18n } = useTranslation()
  const language = getSupportedLanguage(i18n.resolvedLanguage)
  const certificates = getCertificates(language)
  const certificateFilters = getCertificateFilters(language)

  const [activeFilter, setActiveFilter] = useState<FilterId>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS)
  const normalizedQuery = useMemo(
    () => debouncedQuery.trim().toLowerCase(),
    [debouncedQuery]
  )

  // Compute per-filter counts
  const filterCounts = useMemo(() => {
    const counts: Record<FilterId, number> = {
      all: certificates.length,
      web: 0,
      mobile: 0,
      ai: 0,
      design: 0,
      others: 0,
    }
    for (const cert of certificates) {
      if (counts[cert.category] !== undefined) {
        counts[cert.category]++
      }
    }
    return counts
  }, [certificates])

  const filteredByCategory = useMemo(
    () =>
      activeFilter === "all"
        ? certificates
        : certificates.filter((c) => c.category === activeFilter),
    [activeFilter, certificates]
  )

  // Final list after category filter + debounced search
  const filtered = useMemo(
    () =>
      filteredByCategory.filter((certificate) =>
        matchesCertificateSearch(certificate, normalizedQuery)
      ),
    [filteredByCategory, normalizedQuery]
  )

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      {/* Spotlight background */}
      <SpotlightBackground
        className="fixed inset-0 z-0 bg-background"
        colors={["rgba(120, 119, 198, 0.25)", "rgba(59, 130, 246, 0.15)"]}
        ambient={true}
      />

      {/* Breadcrumb header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-6 py-3 backdrop-blur">
        <Link
          href="/"
          className="text-xs font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          {t("certificatesPage.breadcrumb")}
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8">
        {/* ── Section Header ───────────────────────────────────────────── */}
        <AnimatedSection
          variant="fade-up"
          duration={0.6}
          className="flex flex-col items-center pt-16 pb-12 text-center"
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("certificatesPage.title")}
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground md:text-lg">
            {t("certificatesPage.subtitle")}
          </p>
        </AnimatedSection>

        {/* ── Filter + Search Bar ─────────────────────────────────────── */}
        <AnimatedSection variant="fade-up" duration={0.4} className="mb-8">
          <FilterSearchToolbar
            filters={certificateFilters}
            activeFilter={activeFilter}
            counts={filterCounts}
            onFilterChange={setActiveFilter}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchInputId="certificate-search"
            searchLabel={t("certificatesPage.searchLabel")}
            searchPlaceholder={t("certificatesPage.searchPlaceholder")}
          />
        </AnimatedSection>

        {/* ── Certificate Grid ──────────────────────────────────────────── */}
        <div>
          <ExpandableCertificateGrid certificates={filtered} />
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-10 mt-16" />
    </div>
  )
}
