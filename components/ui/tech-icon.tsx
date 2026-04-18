"use client"

import { useMemo, useState, memo } from "react"
import { getSkillSlug, getSkillIconUrl } from "@/lib/skill-icons"
import { useThemeContext } from "@/components/theme-provider"

// ─── Types ────────────────────────────────────────────────────────────────────

interface TechIconProps {
  /** Raw tag string, e.g. "Next.js", "Tailwind CSS". Used for tooltip and fallback. */
  tag: string
  /** 
   * Pre-resolved slug (e.g., from skill category).
   * Bypasses the map lookup if provided.
   */
  iconId?: string | null
  /** Icon size in px (default: 30) */
  size?: number
}

// ─── Text Fallback Badge ──────────────────────────────────────────────────────

function TextBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex h-[25px] items-center rounded border border-border/50 bg-muted/40 px-2 text-[10px] font-medium leading-none text-muted-foreground transition-colors hover:bg-muted/80">
      {tag}
    </span>
  )
}

// ─── TechIcon ─────────────────────────────────────────────────────────────────
// Shows a skillicons.dev icon. Falls back to a text badge if:
//   1. The tag has no mapped slug (unknown tech)
//   2. The image fails to load (network error / removed icon)
// Includes a custom CSS-driven tooltip on hover.

export const TechIcon = memo(function TechIcon({
  tag,
  iconId,
  size = 30,
}: TechIconProps) {
  const { isDarkMode } = useThemeContext()

  const theme = isDarkMode ? "dark" : "light"
  const slug = iconId || getSkillSlug(tag)
  const sourceKey = `${slug ?? "unknown"}:${theme}`

  const [imageState, setImageState] = useState<{
    sourceKey: string
    errorCount: number
  }>({ sourceKey, errorCount: 0 })

  const loadErrorCount =
    imageState.sourceKey === sourceKey ? imageState.errorCount : 0

  const themedIconUrl = slug ? getSkillIconUrl(slug, theme) : null
  const plainIconUrl = slug ? `https://skillicons.dev/icons?i=${encodeURIComponent(slug)}` : null

  const iconUrl = useMemo(() => {
    if (!themedIconUrl || !plainIconUrl) {
      return null
    }

    // Retry once with non-themed URL if themed request fails.
    return loadErrorCount === 0 ? themedIconUrl : plainIconUrl
  }, [loadErrorCount, plainIconUrl, themedIconUrl])

  // No slug found or image failed to load → text fallback
  if (!slug || !iconUrl || loadErrorCount > 1) {
    return <TextBadge tag={tag} />
  }

  return (
    <div className="group relative flex items-center justify-center transition-transform duration-150 hover:-translate-y-1 hover:scale-110">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt={tag}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onLoad={() => setImageState({ sourceKey, errorCount: 0 })}
        onError={() => {
          setImageState((current) => ({
            sourceKey,
            errorCount:
              current.sourceKey === sourceKey ? current.errorCount + 1 : 1,
          }))
        }}
        className="select-none object-contain drop-shadow-sm"
      />

      {/* Custom Tooltip */}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded border border-border/50 bg-popover px-2.5 py-1 text-[11px] font-medium text-popover-foreground opacity-0 shadow-md transition-[opacity,transform] duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
        {tag}
      </span>
    </div>
  )
})
