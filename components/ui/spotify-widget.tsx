"use client"

import { useQuery } from "@tanstack/react-query"
import { SpotifyLogoIcon } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SpotifyData {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

export function SpotifyWidget({ className }: { className?: string }) {
  const { data, isLoading, isError } = useQuery<SpotifyData>({
    queryKey: ["spotify-now-playing"],
    queryFn: async () => {
      const res = await fetch("/api/spotify/now-playing")
      if (!res.ok) throw new Error("Failed to fetch Spotify data")
      return res.json()
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (isLoading || isError || !data || !data.title) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/50 p-3 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/50",
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/5">
          <SpotifyLogoIcon weight="fill" className="h-6 w-6 text-neutral-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-500">
            Not Playing
          </span>
          <span className="text-xs text-neutral-400">Spotify</span>
        </div>
      </div>
    )
  }

  return (
    <Link
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/50 p-3 shadow-sm backdrop-blur-md transition-all hover:bg-neutral-50 dark:border-white/10 dark:bg-black/50 dark:hover:bg-white/5",
        className
      )}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={data.albumImageUrl}
          alt={data.album}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Equalizer overlay when playing */}
        {data.isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="flex h-3 items-end gap-[2px]">
              <span className="h-full w-1 animate-[music-bar_1s_ease-in-out_infinite_alternate] rounded-full bg-[#1DB954]" />
              <span className="h-[60%] w-1 animate-[music-bar_0.8s_ease-in-out_infinite_alternate_0.2s] rounded-full bg-[#1DB954]" />
              <span className="h-[80%] w-1 animate-[music-bar_1.2s_ease-in-out_infinite_alternate_0.4s] rounded-full bg-[#1DB954]" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
            {data.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SpotifyLogoIcon
            weight="fill"
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              data.isPlaying ? "text-[#1DB954]" : "text-neutral-400"
            )}
          />
          <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {data.artist}
          </span>
        </div>
      </div>
    </Link>
  )
}
