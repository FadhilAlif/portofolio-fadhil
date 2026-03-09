"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import React from "react"

import TanstackQueryProvider from "./react-query"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

function RootProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TanstackQueryProvider>
      <ThemeProvider>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </TanstackQueryProvider>
  )
}

export default RootProvider
