"use client"

import * as React from "react"
import { useThemeAnimation } from "@/hooks/use-theme-animation"
import { useDarkMode, type DarkModeReturn } from "@/hooks/use-dark-mode"

const ThemeContext = React.createContext<DarkModeReturn | undefined>(undefined)

export function useThemeContext() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useDarkMode({
    defaultValue: true,
    localStorageKey: "portfolio-theme",
    applyDarkClass: true,
  })

  return (
    <ThemeContext.Provider value={darkMode}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { toggleTheme } = useThemeAnimation()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      // No mouse event → animation originates from the center of the screen
      toggleTheme()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [toggleTheme])

  return null
}

export { ThemeProvider }
