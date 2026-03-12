"use client"

import { useThemeContext } from "@/components/theme-provider"

export function useThemeAnimation() {
  const { isDarkMode, set } = useThemeContext()

  function toggleTheme(event?: React.MouseEvent | MouseEvent) {
    const newTheme = isDarkMode ? "light" : "dark"

    // Fallback: browser doesn't support View Transitions API
    if (!document.startViewTransition) {
      set(newTheme === "dark")
      return
    }

    // Get click origin — default to center of screen (e.g. keyboard shortcut)
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2

    // Calculate the radius needed to cover the entire screen from the origin
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Start the view transition; flushSync ensures React updates the DOM
    // synchronously inside the transition callback so the snapshot is correct
    // asynchronously. We must apply the class directly to ensure the DOM snapshot is correct.
    const transition = document.startViewTransition(() => {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(newTheme)
      document.documentElement.style.colorScheme = newTheme
      
      set(newTheme === "dark")
    })

    // Once both snapshots are ready, drive the clip-path animation
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          // Always expand the incoming (new) theme layer over the old one
          pseudoElement: "::view-transition-new(root)",
        }
      )
    })
  }

  return {
    toggleTheme,
    isDark: isDarkMode,
    theme: isDarkMode ? "dark" : "light",
  }
}
