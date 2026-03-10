"use client"

import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useThemeAnimation } from "@/hooks/use-theme-animation"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleTheme, isDark } = useThemeAnimation()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  )
}
