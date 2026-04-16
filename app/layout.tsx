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

const SITE_URL = "https://fadhildev.my.id"
const SITE_NAME = "Fadhil Dev"
const DEFAULT_TITLE = "Fadhil Alif Priyatno | Fadhil Dev"
const DEFAULT_DESCRIPTION =
  "Portfolio resmi Fadhil Alif Priyatno (Fadhil Dev), Full-Stack Engineer dari Yogyakarta. Menampilkan pengalaman, proyek, sertifikat, dan kontak profesional."
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Fadhil Dev",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Fadhil Dev",
    "Fadhil Alif",
    "Fadhil Alif Priyatno",
    "Portfolio Fadhil Dev",
    "Full Stack Engineer Indonesia",
    "Full Stack Engineer Yogyakarta",
    "Web Developer Indonesia",
    "Mobile Developer Indonesia",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/assets/fadhil-photo-profile.avif",
        width: 1200,
        height: 1200,
        alt: "Fadhil Alif Priyatno - Fadhil Dev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    creator: "@fdhlalf_",
    images: ["/assets/fadhil-photo-profile.avif"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: googleSiteVerification,
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        jetbrainsMono.variable,
        caveat.variable
      )}
    >
      <body>
        <Suspense fallback={<LoadingSpinner />}>
          <RootProvider>
            {children}
            <FloatingDock />
            <Analytics />
            <SpeedInsights />
          </RootProvider>
        </Suspense>
      </body>
    </html>
  )
}
