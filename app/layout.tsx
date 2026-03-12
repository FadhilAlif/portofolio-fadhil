import type { Metadata } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import RootProvider from "@/lib/root-provider"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { FloatingDock } from "@/components/navigation/floating-dock"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Fadhil Alif - Portfolio",
  description: "Personal portfolio of Fadhil.",
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
        "font-mono",
        jetbrainsMono.variable
      )}
    >
      <body>
        <Suspense fallback={<LoadingSpinner />}>
          <RootProvider>
            {children}
            <FloatingDock />
          </RootProvider>
        </Suspense>
      </body>
    </html>
  )
}
