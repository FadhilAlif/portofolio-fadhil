"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import React from "react"

import TanstackQueryProvider from "./react-query"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"

function RootProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TanstackQueryProvider>
      <I18nProvider>
        <ThemeProvider>
          <NuqsAdapter>
            {children}
            <Toaster richColors />
          </NuqsAdapter>
        </ThemeProvider>
      </I18nProvider>
    </TanstackQueryProvider>
  )
}

export default RootProvider
