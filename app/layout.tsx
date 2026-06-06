import type { Metadata } from "next"
import { Geist, JetBrains_Mono, Caveat } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import RootProvider from "@/lib/root-provider"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { FloatingDock } from "@/components/navigation/floating-dock"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import MicrosoftAnalytics from "@/app/metrics/MicrosoftAnalytics"
import { siteConfig } from "@/lib/site-config"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-signature",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Fadhil Alif Priyatno - Software Engineer Portfolio",
    template: "%s | Fadhil Alif Priyatno",
  },
  description:
    "Software Engineer specializing in web & mobile development. Explore my projects, certificates, and professional experience.",
  keywords: [
    "Fadhil Alif Priyatno",
    "Software Engineer",
    "Web Developer",
    "Mobile Developer",
    "Portfolio",
    "Frontend Developer",
    "Backend Developer",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: siteConfig.url,
    siteName: "Fadhil Alif Priyatno Portfolio",
    title: "Fadhil Alif Priyatno - Software Engineer Portfolio",
    description:
      "Software Engineer specializing in web & mobile development. Explore my projects, certificates, and professional experience.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fadhil Alif Priyatno - Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fadhil Alif Priyatno - Software Engineer Portfolio",
    description:
      "Software Engineer specializing in web & mobile development. Explore my projects, certificates, and professional experience.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: "vijfrsNyDum5NYcLzBxljEgHvpAqACdRY6s59eRZDdE",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        jetbrainsMono.variable,
        caveat.variable
      )}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.name,
              url: siteConfig.url,
              // Note: There is a typo in the filename on the CDN/public folder ('profie' instead of 'profile')
              image: "https://fadhildev.my.id/assets/fadhil-photo-profie.avif",
              sameAs: [
                siteConfig.linkedin.url,
                siteConfig.github.url,
                siteConfig.instagram.url,
              ],
              jobTitle: "Software Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Telkom Indonesia",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Yogyakarta",
                addressCountry: "ID",
              },
              email: `mailto:${siteConfig.email}`,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Fadhil Alif Priyatno Portfolio",
              url: siteConfig.url,
              description:
                "Personal portfolio showcasing projects, certificates, and professional experience.",
              inLanguage: ["en", "id"],
              author: {
                "@type": "Person",
                name: siteConfig.name,
              },
            }),
          }}
        />
        <Suspense fallback={<LoadingSpinner />}>
          <RootProvider>
            {children}
            <FloatingDock />
            <Analytics />
            <MicrosoftAnalytics />
            <SpeedInsights />
          </RootProvider>
        </Suspense>
      </body>
    </html>
  )
}
