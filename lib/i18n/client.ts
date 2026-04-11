"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import {
  DEFAULT_LANGUAGE,
  getSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "./config"
import { resources } from "./resources"

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

  i18n.on("languageChanged", (language) => {
    const normalized = getSupportedLanguage(language)

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized)
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = normalized
    }
  })
}

export default i18n
