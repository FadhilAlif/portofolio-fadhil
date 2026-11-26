import { NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/lib/site-config"

export const runtime = "edge"
export const revalidate = 3600

const ALLOWED_YEAR_RE = /^(?:last|\d{4})$/
const MIN_GITHUB_YEAR = 2008

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") ?? siteConfig.github.username
  const year = searchParams.get("year") ?? "last"

  if (username !== siteConfig.github.username) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 })
  }

  if (!ALLOWED_YEAR_RE.test(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 })
  }

  if (year !== "last") {
    const parsedYear = Number(year)
    const maxYear = new Date().getUTCFullYear() + 1
    if (parsedYear < MIN_GITHUB_YEAR || parsedYear > maxYear) {
      return NextResponse.json({ error: "Year out of range" }, { status: 400 })
    }
  }

  try {
    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${encodeURIComponent(year)}`
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch contribution data" },
      { status: 500 }
    )
  }
}
