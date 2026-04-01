"use client"

import { useRef, useState, useCallback, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { TechIcon } from "@/components/ui/tech-icon"
import { cn } from "@/lib/utils"
import type { ProjectLink, ProjectRole } from "@/lib/projects-data"
import {
  GithubLogoIcon,
  LockIcon,
  DownloadSimpleIcon,
  ArrowSquareOutIcon,
  PlayIcon,
  LockKeyIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react"

// ─── Role Badge Color Map ────────────────────────────────────────────────────

const roleColorMap: Record<string, string> = {
  "Full-Stack Engineer":
    "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Fullstack Engineer": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Frontend Engineer": "bg-sky-500/15 text-sky-400 border-sky-500/25",
  "Backend Engineer":
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Mobile Developer": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Flutter Developer": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Flutter Developer · Team Lead":
    "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
}

function getRoleColor(role: string): string {
  return roleColorMap[role] ?? "bg-muted/50 text-muted-foreground border-border"
}

// ─── Link Icon Resolver ──────────────────────────────────────────────────────

const linkIconMap: Record<string, React.ReactNode> = {
  github: <GithubLogoIcon className="h-3 w-3" />,
  external: <ArrowSquareOutIcon className="h-3 w-3" />,
  demo: <PlayIcon className="h-3 w-3" />,
  "play-store": <ArrowSquareOutIcon className="h-3 w-3" />,
  "app-store": <ArrowSquareOutIcon className="h-3 w-3" />,
  download: <DownloadSimpleIcon className="h-3 w-3" />,
}

function getLinkIcon(icon?: string): React.ReactNode {
  return linkIconMap[icon ?? ""] ?? <ArrowSquareOutIcon className="h-3 w-3" />
}

// ─── Internal Project Ribbon ─────────────────────────────────────────────────

function InternalRibbon() {
  return (
    <div
      className="pointer-events-none absolute top-0 right-0 z-20 overflow-hidden"
      style={{ width: "88px", height: "88px" }}
      aria-label="Internal Project"
    >
      {/* Diagonal ribbon */}
      <div
        className="absolute flex items-center justify-center gap-1 bg-amber-500/90 text-[9px] font-bold tracking-wider text-black uppercase backdrop-blur-sm"
        style={{
          width: "120px",
          right: "-29px",
          top: "18px",
          transform: "rotate(45deg)",
          transformOrigin: "center",
          padding: "3px 0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        <LockKeyIcon className="h-2.5 w-2.5 shrink-0" aria-hidden />
        Internal
      </div>
    </div>
  )
}

// ─── Optimized Image with next/image ─────────────────────────────────────────

const ProjectImage = memo(function ProjectImage({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-muted">
        <span className="text-xs text-muted-foreground">No preview</span>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
        onError={() => setHasError(true)}
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  )
})

// ─── Lazy Video (IntersectionObserver) ───────────────────────────────────────

const LazyVideo = memo(function LazyVideo({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const observeRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isVisible) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { rootMargin: "200px" }
      )
      observer.observe(node)
    },
    [isVisible]
  )

  return (
    <div
      ref={observeRef}
      className="relative aspect-video w-full overflow-hidden bg-muted"
    >
      {isVisible && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
          aria-label={alt}
        />
      )}
    </div>
  )
})

// ─── Media Slot ───────────────────────────────────────────────────────────────

function MediaSlot({
  title,
  image,
  video,
}: {
  title: string
  image?: string
  video?: string
}) {
  if (video) return <LazyVideo src={video} alt={title} />
  if (image) return <ProjectImage src={image} alt={title} />
  return (
    <div className="flex aspect-video w-full items-center justify-center bg-muted/60">
      <span className="text-xs text-muted-foreground">No preview</span>
    </div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  title: string
  description: string
  dates: string
  association?: string
  role: ProjectRole
  tags: readonly string[]
  isInternal?: boolean
  href?: string
  image?: string
  video?: string
  links?: readonly ProjectLink[]
  className?: string
}

export const ProjectCard = memo(function ProjectCard({
  title,
  description,
  dates,
  association,
  role,
  tags,
  isInternal = false,
  href,
  image,
  video,
  links,
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300",
        "hover:border-border/80 hover:shadow-lg hover:ring-1 hover:shadow-primary/5 hover:ring-primary/10",
        className
      )}
    >
      {/* ── Internal ribbon ──────────────────────────────────────────────── */}
      {isInternal && <InternalRibbon />}

      {/* ── Media ────────────────────────────────────────────────────────── */}
      <div className="relative shrink-0 overflow-hidden">
        {href ? (
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            aria-label={`View ${title}`}
          >
            <MediaSlot title={title} image={image} video={video} />
          </Link>
        ) : (
          <MediaSlot title={title} image={image} video={video} />
        )}

        {/* Overlay link badges (GitHub / Demo) */}
        {links && links.length > 0 && (
          <div className="absolute right-2.5 bottom-2.5 flex flex-wrap gap-1.5">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge
                  className="flex items-center gap-1 border-none bg-black/70 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/90"
                  variant="default"
                >
                  {getLinkIcon(link.icon)}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Internal lock overlay for no-href projects */}
        {isInternal && !href && (
          <div className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/30 via-transparent to-transparent">
            <span className="m-2.5 flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-400 backdrop-blur-sm">
              <LockIcon className="h-2.5 w-2.5" />
              Private
            </span>
          </div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="truncate text-sm leading-snug font-semibold text-foreground">
              {title}
            </h3>
            <time className="text-[11px] text-muted-foreground">{dates}</time>
            {association && (
              <span className="text-[11px] text-muted-foreground/60 italic">
                {association}
              </span>
            )}
          </div>
          {href && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label={`Open ${title}`}
            >
              <ArrowUpRightIcon className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
        </div>

        {/* Role badge */}
        <div>
          <span
            className={cn(
              "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium",
              getRoleColor(role)
            )}
          >
            {role}
          </span>
        </div>

        {/* Description */}
        <p className="flex-1 text-[11px] leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>

        {/* Tech icons — skillicons.dev with text-badge fallback */}
        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
            {tags.map((tag) => (
              <TechIcon key={tag} tag={tag} size={30} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
