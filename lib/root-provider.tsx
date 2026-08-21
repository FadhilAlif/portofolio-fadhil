"use client"

import React from "react"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"

function RootProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <I18nProvider>
      <ThemeProvider>
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </I18nProvider>
  )
}

export default RootProvider
