import { GoogleGenAI } from "@google/genai"
import { createClient } from "@supabase/supabase-js"
import { FADHIL_KNOWLEDGE_BASE } from "@/lib/knowledge-base"
import { env } from "@/lib/env"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import crypto from "crypto"

import { z } from "zod"

// ── Constants ──────────────────────────────────────────────
const MAX_QUESTIONS_PER_SESSION = 3
const MAX_MESSAGE_LENGTH = 2000

// Fallback chain: try each model in order if the previous one is rate-limited
const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
] as const

// ── Clients ────────────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

const ipRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  ephemeralCache: new Map(),
})

// ── Validation ─────────────────────────────────────────────
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(MAX_MESSAGE_LENGTH).trim(),
})

const chatRequestSchema = z.object({
  session_id: z.string().uuid(),
  message: z.string().min(1).max(MAX_MESSAGE_LENGTH).trim(),
  history: z.array(chatMessageSchema).max(20).default([]),
  lang: z.string().optional(),
})

// ── Helpers ────────────────────────────────────────────────
type SupportedLanguage = "en" | "id"

function resolveLanguage(value?: string): SupportedLanguage {
  if (!value) return "en"
  return value.toLowerCase().startsWith("id") ? "id" : "en"
}

const CHAT_TEXT = {
  en: {
    invalidSession: "Invalid or missing session_id",
    messageRequired: "Message is required and must be valid",
    rateLimitCheckFailed: "Failed to check rate limit",
    rateLimitReached: "Rate limit reached",
    rateLimitMessage:
      "You have reached the maximum of {{max}} questions for this session. Please start a new session to continue chatting.",
    noAiResponse: "Sorry, I could not generate a response.",
    allModelsUnavailable:
      "All AI models are currently unavailable. Please try again later.",
    internalServerError: "Internal server error",
  },
  id: {
    invalidSession: "session_id tidak valid atau tidak ditemukan",
    messageRequired: "Pesan wajib diisi dan harus valid",
    rateLimitCheckFailed: "Gagal memeriksa batas pertanyaan",
    rateLimitReached: "Batas pertanyaan tercapai",
    rateLimitMessage:
      "Anda telah mencapai batas maksimal {{max}} pertanyaan untuk sesi ini. Silakan mulai sesi baru untuk melanjutkan percakapan.",
    noAiResponse: "Maaf, saya belum bisa menghasilkan jawaban saat ini.",
    allModelsUnavailable:
      "Semua model AI sedang tidak tersedia. Silakan coba lagi nanti.",
    internalServerError: "Terjadi kesalahan pada server",
  },
} as const

function interpolate(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key]
    return value !== undefined ? String(value) : ""
  })
}

// ── POST Handler ───────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown"

    // 1. Global IP Rate Limiting
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { success } = await ipRatelimit.limit(`ratelimit:chat_ip:${ip}`)
        if (!success) {
          return Response.json({ error: CHAT_TEXT.en.rateLimitReached }, { status: 429 })
        }
      } catch (error) {
        console.warn("[Chat] IP ratelimit failed", error)
      }
    }

    // 2. Parse & validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const parsed = chatRequestSchema.safeParse(body)
    const language = resolveLanguage(
      typeof body === "object" && body !== null && "lang" in body
        ? String((body as { lang?: string }).lang)
        : undefined
    )
    const text = CHAT_TEXT[language]

    if (!parsed.success) {
      const isSessionError = parsed.error.issues.some(i => i.path.includes("session_id"))
      if (isSessionError) {
        return Response.json({ error: text.invalidSession }, { status: 400 })
      }
      return Response.json({ error: text.messageRequired, issues: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { session_id, message, history } = parsed.data

    // 3. Redis Session Counters
    let count = 0
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const sessionKey = `chat_session:${session_id}`
        count = await kv.incr(sessionKey)
        if (count === 1) {
          await kv.expire(sessionKey, 3600) // 1 hour expiration
        }
        if (count > MAX_QUESTIONS_PER_SESSION) {
          return Response.json(
            {
              error: text.rateLimitReached,
              message: interpolate(text.rateLimitMessage, {
                max: MAX_QUESTIONS_PER_SESSION,
              }),
              remaining: 0,
            },
            { status: 429 }
          )
        }
      } catch (error) {
        console.warn("[Chat] Session counter failed", error)
        // Fallback to Supabase count
        const { count: sbCount } = await supabaseAdmin
          .from("chat_logs")
          .select("id", { count: "exact", head: true })
          .eq("session_id", session_id)
          .eq("role", "user")
        count = (sbCount ?? 0) + 1
      }
    } else {
      const { count: sbCount } = await supabaseAdmin
        .from("chat_logs")
        .select("id", { count: "exact", head: true })
        .eq("session_id", session_id)
        .eq("role", "user")
      count = (sbCount ?? 0) + 1
      
      if (count > MAX_QUESTIONS_PER_SESSION) {
        return Response.json({ error: text.rateLimitReached, message: interpolate(text.rateLimitMessage, { max: MAX_QUESTIONS_PER_SESSION }), remaining: 0 }, { status: 429 })
      }
    }

    // 4. Ephemeral Chat Memory
    type ChatMessage = z.infer<typeof chatMessageSchema>
    let actualHistory: ChatMessage[] = history
    const historyKey = `chat_history:${session_id}`

    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const stored = await kv.lrange(historyKey, 0, -1)
        if (stored && stored.length > 0) {
          actualHistory = stored.map(s => typeof s === 'string' ? JSON.parse(s) : s) as ChatMessage[]
        }
      } catch (e) {
        console.warn("[Chat] Failed to fetch ephemeral memory", e)
      }
    }

    // Build conversation contents for Gemini
    const contents = [
      ...(Array.isArray(actualHistory)
        ? actualHistory.map((msg: ChatMessage) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          }))
        : []),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]

    // 5. LLM Response Caching
    const hash = crypto.createHash('sha256').update(JSON.stringify(contents)).digest('hex')
    const cacheKey = `chat_cache:${hash}`
    let aiResponse: string | null = null

    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const cachedResponse = await kv.get<string>(cacheKey)
        if (cachedResponse) {
          console.log("[Chat] Cache hit!")
          aiResponse = cachedResponse
        }
      } catch (e) {
        console.warn("[Chat] Cache fetch failed", e)
      }
    }

    if (!aiResponse) {
      // Call Gemini API with fallback chain
      let lastError: unknown = null
      aiResponse = text.noAiResponse

      for (const model of GEMINI_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: FADHIL_KNOWLEDGE_BASE,
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          })

          aiResponse = response.text ?? text.noAiResponse
          lastError = null
          console.log(`[Chat] Successfully used model: ${model}`)
          break
        } catch (err: unknown) {
          lastError = err
          const shouldTryNext =
            err instanceof Error &&
            (err.message?.includes("429") ||
              err.message?.includes("403") ||
              err.message?.includes("RESOURCE_EXHAUSTED") ||
              err.message?.includes("PERMISSION_DENIED") ||
              err.message?.toLowerCase().includes("rate limit") ||
              err.message?.toLowerCase().includes("quota") ||
              err.message?.toLowerCase().includes("denied access"))

          if (shouldTryNext) {
            console.warn(
              `[Chat] Model ${model} unavailable (${err.message?.slice(0, 60)}), trying next fallback...`
            )
            continue
          }
          throw err
        }
      }

      if (lastError) {
        console.error("All Gemini models rate-limited:", lastError)
        return Response.json({ error: text.allModelsUnavailable }, { status: 503 })
      }

      // Save to Cache
      if (process.env.UPSTASH_REDIS_REST_URL) {
        try {
          await kv.set(cacheKey, aiResponse, { ex: 86400 }) // Cache for 1 day
        } catch (e) {
          console.warn("[Chat] Cache set failed", e)
        }
      }
    }

    // 6. Save Ephemeral Memory & Log to Supabase
    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const p = kv.pipeline()
        p.rpush(historyKey, JSON.stringify({ role: "user", content: message.trim() }))
        p.rpush(historyKey, JSON.stringify({ role: "assistant", content: aiResponse }))
        p.ltrim(historyKey, -40, -1) // Keep max 20 pairs
        p.expire(historyKey, 3600) // 1 hour memory expiration
        await p.exec()
      } catch (e) {
        console.warn("[Chat] Ephemeral memory update failed", e)
      }
    }

    const { error: insertError } = await supabaseAdmin
      .from("chat_logs")
      .insert([
        { session_id, role: "user", content: message.trim() },
        { session_id, role: "assistant", content: aiResponse },
      ])

    if (insertError) {
      console.error("Supabase insert error:", insertError)
    }

    // 7. Return response
    const remaining = MAX_QUESTIONS_PER_SESSION - count

    return Response.json({
      response: aiResponse,
      remaining: Math.max(0, remaining),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { error: CHAT_TEXT.en.internalServerError },
      { status: 500 }
    )
  }
}
