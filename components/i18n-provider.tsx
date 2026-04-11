"use client"

import { useEffect } from "react"
import { I18nextProvider } from "react-i18next"

import i18n from "@/lib/i18n/client"
import {
  getSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
} from "@/lib/i18n/config"

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    const preferred = getSupportedLanguage(saved ?? window.navigator.language)
    const current = getSupportedLanguage(i18n.resolvedLanguage)

    if (preferred !== current) {
      void i18n.changeLanguage(preferred)
      return
    }

    document.documentElement.lang = current
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
