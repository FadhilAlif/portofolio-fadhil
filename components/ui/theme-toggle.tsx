"use client"

import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useThemeAnimation } from "@/hooks/use-theme-animation"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { t } = useTranslation()
  const { toggleTheme, isDark } = useThemeAnimation()

  const themeLabel = t("dock.theme")

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={themeLabel}
      title={themeLabel}
      className={cn("hover:cursor-pointer", className)}
    >
      {isDark ? (
        <SunIcon
          weight="bold"
          className="size-4 scale-100 rotate-0 transition-transform duration-300"
        />
      ) : (
        <MoonIcon
          weight="bold"
          className="size-4 scale-100 rotate-0 transition-transform duration-300"
        />
      )}
      <span className="sr-only">{themeLabel}</span>
    </Button>
  )
}
