import { env } from "@/lib/env"
import { NextResponse } from "next/server"

const basic = Buffer.from(
  `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
).toString("base64")
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
    cache: "no-store",
  })

  return response.json()
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken()

    // 1. Check Currently Playing
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    })

    if (response.status === 204 || response.status > 400) {
      // 2. Fallback to Recently Played if offline
      const recentResponse = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        cache: "no-store",
      })

      if (!recentResponse.ok) {
        return NextResponse.json({ isPlaying: false })
      }

      const recentData = await recentResponse.json()
      if (!recentData.items || recentData.items.length === 0) {
        return NextResponse.json({ isPlaying: false })
      }

      const track = recentData.items[0].track
      return NextResponse.json({
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((_artist: { name: string }) => _artist.name).join(", "),
        album: track.album.name,
        albumImageUrl: track.album.images[0].url,
        songUrl: track.external_urls.spotify,
      })
    }

    const song = await response.json()
    if (song.item === null) {
      return NextResponse.json({ isPlaying: false })
    }

    const isPlaying = song.is_playing
    const title = song.item.name
    const artist = song.item.artists
      .map((_artist: { name: string }) => _artist.name)
      .join(", ")
    const album = song.item.album.name
    const albumImageUrl = song.item.album.images[0].url
    const songUrl = song.item.external_urls.spotify

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
    })
  } catch (error) {
    console.error("Spotify API error:", error)
    return NextResponse.json({ isPlaying: false }, { status: 500 })
  }
}
