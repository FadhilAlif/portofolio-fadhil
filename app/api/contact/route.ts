import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { contactSchema } from "@/lib/contact-schema"

// ─── Resend client ────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Simple in-memory rate limiter ───────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 3

type SupportedLanguage = "en" | "id"

function resolveLanguage(value?: string): SupportedLanguage {
  if (!value) return "en"
  return value.toLowerCase().startsWith("id") ? "id" : "en"
}

const CONTACT_TEXT = {
  en: {
    tooManyRequests:
      "Too many requests. Please wait before sending another message.",
    invalidJson: "Invalid JSON body.",
    validationFailed: "Validation failed.",
    sendFailed: "Failed to send email. Please try again later.",
    unexpectedError: "An unexpected server error occurred.",
  },
  id: {
    tooManyRequests:
      "Terlalu banyak permintaan. Mohon tunggu sebelum mengirim pesan lagi.",
    invalidJson: "Format JSON tidak valid.",
    validationFailed: "Validasi gagal.",
    sendFailed: "Gagal mengirim email. Silakan coba lagi nanti.",
    unexpectedError: "Terjadi kesalahan server yang tidak terduga.",
  },
} as const

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count++
  return { allowed: true, retryAfter: 0 }
}

// ─── Email HTML builder ───────────────────────────────────────────────────────

function buildEmailHtml(
  name: string,
  email: string,
  message: string,
  sentAt: string
): string {
  // Escape HTML to prevent injection
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 24px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;background:#e5e5e5;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="font-family:monospace;font-size:16px;font-weight:700;color:#0a0a0a;line-height:36px;">F</span>
                  </td>
                  <td style="padding-left:12px;font-size:18px;font-weight:600;color:#e5e5e5;">
                    FADHIL<span style="color:#7c7cf4;">.DEV</span>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 4px;font-size:22px;font-weight:700;color:#fff;">New Contact Message 📬</p>
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);">Received via the portfolio contact form</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#111111;padding:36px 40px;">

              <!-- From -->
              <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;">
                <tr>
                  <td style="width:64px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,0.35);padding-top:2px;">From</td>
                  <td style="font-size:14px;color:#e5e5e5;">${esc(name)}</td>
                </tr>
              </table>
              <!-- Email -->
              <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;">
                <tr>
                  <td style="width:64px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,0.35);padding-top:2px;">Email</td>
                  <td><a href="mailto:${esc(email)}" style="font-size:14px;color:#7c7cf4;text-decoration:none;">${esc(email)}</a></td>
                </tr>
              </table>
              <!-- Sent at -->
              <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
                <tr>
                  <td style="width:64px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,0.35);padding-top:2px;">Sent at</td>
                  <td style="font-size:14px;color:#e5e5e5;">${esc(sentAt)}</td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px dashed rgba(255,255,255,0.1);margin:0 0 28px;" />

              <!-- Message -->
              <p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,0.4);">Message</p>
              <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;font-size:14px;line-height:1.7;color:#d4d4d4;white-space:pre-wrap;">${esc(message)}</div>

              <!-- CTA -->
              <div style="margin-top:28px;text-align:center;">
                <a href="mailto:${esc(email)}?subject=Re: Your message on fadhil.dev"
                   style="display:inline-block;background:#e5e5e5;color:#0a0a0a;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">
                  Reply to ${esc(name)} →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">
                Sent from the contact form at
                <a href="https://fadhil.dev" style="color:rgba(255,255,255,0.4);text-decoration:none;">fadhil.dev</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── 1. Rate limit ────────────────────────────────────────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown"

    const { allowed, retryAfter } = checkRateLimit(ip)
    const fallbackLanguage = resolveLanguage(
      request.headers.get("accept-language") ?? undefined
    )
    const fallbackText = CONTACT_TEXT[fallbackLanguage]

    if (!allowed) {
      return NextResponse.json(
        { error: fallbackText.tooManyRequests, retryAfter },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      )
    }

    // ── 2. Validate body ─────────────────────────────────────────────────────
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: fallbackText.invalidJson },
        { status: 400 }
      )
    }

    const requestedLanguage =
      typeof body === "object" && body !== null && "lang" in body
        ? resolveLanguage(String((body as { lang?: string }).lang))
        : fallbackLanguage
    const text = CONTACT_TEXT[requestedLanguage]

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: text.validationFailed,
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      )
    }

    const { name, email, message, _honey } = parsed.data

    // ── 3. Honeypot ──────────────────────────────────────────────────────────
    if (_honey && _honey.length > 0) {
      return NextResponse.json({ success: true })
    }

    // ── 4. Build & send email ────────────────────────────────────────────────
    const sentAt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date())

    const toEmail = process.env.CONTACT_EMAIL_TO ?? "fadhil.alifp@gmail.com"
    const html = buildEmailHtml(name, email, message, sentAt)

    const { data, error } = await resend.emails.send({
      from: "FADHIL.DEV Contact <noreply@inbox.fadhildev.my.id>",
      to: [toEmail],
      replyTo: email,
      subject: `New message from ${name} — fadhil.dev`,
      html,
    })

    if (error) {
      console.error(
        "[contact/send] Resend error:",
        JSON.stringify(error, null, 2)
      )
      return NextResponse.json({ error: text.sendFailed }, { status: 500 })
    }

    console.log("[contact/send] Email sent. ID:", data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    // Catch-all so server never returns empty response
    console.error("[contact/send] Unexpected error:", err)
    return NextResponse.json(
      { error: CONTACT_TEXT.en.unexpectedError },
      { status: 500 }
    )
  }
}
