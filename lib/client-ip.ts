import "server-only"

const SAFE_IP_RE = /^[a-fA-F0-9:.]{3,64}$/

function parseCandidateIp(raw: string | null): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  return SAFE_IP_RE.test(trimmed) ? trimmed : null
}

/**
 * Extracts a sanitized client IP from proxy headers in priority order:
 * 1. `x-vercel-forwarded-for` (overwritten by Vercel Edge)
 * 2. `cf-connecting-ip` (overwritten by Cloudflare)
 * 3. `x-real-ip` (set by Vercel / trusted reverse proxies)
 * 4. Rightmost entry of `x-forwarded-for` (appended by closest proxy hop)
 */
export function getClientIp(request: Request): string {
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for")
  if (vercelForwarded) {
    const first = parseCandidateIp(vercelForwarded.split(",")[0] ?? null)
    if (first) return first
  }

  const cfIp = parseCandidateIp(request.headers.get("cf-connecting-ip"))
  if (cfIp) return cfIp

  const realIp = parseCandidateIp(request.headers.get("x-real-ip"))
  if (realIp) return realIp

  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const parts = forwardedFor.split(",")
    const rightmost = parseCandidateIp(parts[parts.length - 1] ?? null)
    if (rightmost) return rightmost
  }

  return "unknown"
}
