"use client"

import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

export function useThemeAnimation() {
  const { resolvedTheme, setTheme } = useTheme()

  function toggleTheme(event?: React.MouseEvent | MouseEvent) {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"

    // Fallback: browser doesn't support View Transitions API
    if (!document.startViewTransition) {
      setTheme(newTheme)
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
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(newTheme))
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
    isDark: resolvedTheme === "dark",
    theme: resolvedTheme,
  }
}
