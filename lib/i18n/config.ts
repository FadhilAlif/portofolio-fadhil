export const LANGUAGE_STORAGE_KEY = "portfolio-language"

export const SUPPORTED_LANGUAGES = ["en", "id"] as const

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: AppLanguage = "en"

export function isSupportedLanguage(language: string): language is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(language as AppLanguage)
}

export function getSupportedLanguage(language?: string | null): AppLanguage {
  if (!language) return DEFAULT_LANGUAGE

  const normalized = language.toLowerCase().split("-")[0]
  if (isSupportedLanguage(normalized)) {
    return normalized
  }

  return DEFAULT_LANGUAGE
}
