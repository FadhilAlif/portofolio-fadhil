import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"
export const revalidate = 3600

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  const year = searchParams.get("year") ?? "last"

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 })
  }

  try {
    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`
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
