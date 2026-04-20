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
  title: "Fadhil Alif Priyatno - Portfolio",
  description: "Personal portfolio of Fadhil Alif Priyatno.",
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
