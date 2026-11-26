import { GoogleGenAI, ThinkingLevel } from "@google/genai"
import { createClient } from "@supabase/supabase-js"
import {
  FADHIL_KNOWLEDGE_BASE,
  KNOWLEDGE_BASE_VERSION,
} from "@/lib/knowledge-base"
import {
  chatActionIdSchema,
  chatStructuredReplySchema,
  MAX_QUESTIONS_PER_HOUR,
  type ChatMeta,
  type ChatStructuredReply,
} from "@/lib/chat-types"
import {
  buildTurnLanguageDirective,
  detectMessageLanguage,
  resolveUiLanguage,
  type ChatLanguage,
} from "@/lib/chat-language"
import {
  createDelimitedStreamSplitter,
  formatSseEvent,
} from "@/lib/chat-stream"
import { env } from "@/lib/env"
import { getClientIp } from "@/lib/client-ip"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import crypto from "crypto"

import { z } from "zod"

// ── Constants ──────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 1000
const MAX_HISTORY_CONTENT_LENGTH = 12000
const MAX_HISTORY_ITEMS = 12
const QUOTA_TTL_SECONDS = 3600
const MAX_FALLBACK_MAP_ENTRIES = 5000

// Atomic INCR + EXPIRE (also heals keys missing a TTL)
const INCR_WITH_EXPIRE_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 or redis.call('TTL', KEYS[1]) == -1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[1]))
end
return current
`

// Bounded in-memory fallback used only when Upstash Redis throws a runtime error
const fallbackIpQuotaMap = new Map<string, { count: number; resetAt: number }>()

function incrementFallbackIpQuota(ip: string): number {
  const now = Date.now()
  const existing = fallbackIpQuotaMap.get(ip)

  if (!existing || now > existing.resetAt) {
    // Prune expired entries before inserting
    for (const [key, entry] of fallbackIpQuotaMap.entries()) {
      if (now > entry.resetAt) fallbackIpQuotaMap.delete(key)
    }
    // Enforce hard upper bound to prevent unbounded memory growth
    if (fallbackIpQuotaMap.size >= MAX_FALLBACK_MAP_ENTRIES) {
      const oldestKey = fallbackIpQuotaMap.keys().next().value
      if (oldestKey !== undefined) fallbackIpQuotaMap.delete(oldestKey)
    }
    fallbackIpQuotaMap.set(ip, {
      count: 1,
      resetAt: now + QUOTA_TTL_SECONDS * 1000,
    })
    return 1
  }

  existing.count += 1
  return existing.count
}

// Fallback chain: try each model in order if the previous one is unavailable or rate-limited
const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const

type GeminiModel = (typeof GEMINI_MODELS)[number]

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const

function getThinkingConfig(model: GeminiModel) {
  if (model.startsWith("gemini-3")) {
    return { thinkingLevel: ThinkingLevel.MINIMAL }
  }
  return { thinkingBudget: 0 }
}

function isRetryableModelError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message ?? ""
  const lower = msg.toLowerCase()
  return (
    msg.includes("429") ||
    msg.includes("403") ||
    msg.includes("404") ||
    msg.includes("500") ||
    msg.includes("503") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("NOT_FOUND") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("overloaded") ||
    lower.includes("denied access")
  )
}

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
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

const ipRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  ephemeralCache: new Map(),
})

// ── Helpers ────────────────────────────────────────────────
function sanitizeText(value: string, maxLength: number): string {
  if (typeof value !== "string") return ""
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .slice(0, maxLength)
}

// ── Validation ─────────────────────────────────────────────
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .min(1)
    .max(MAX_HISTORY_CONTENT_LENGTH)
    .transform((val) => sanitizeText(val, MAX_HISTORY_CONTENT_LENGTH)),
  actions: z.array(chatActionIdSchema).max(3).optional(),
  followUps: z.array(z.string().trim().min(1).max(140)).max(3).optional(),
})

type ChatMessage = z.infer<typeof chatMessageSchema>

async function readIpQuotaCount(ip: string): Promise<number> {
  const quotaKey = `chat_quota:${ip}`
  try {
    const raw = await kv.get<number | string>(quotaKey)
    const parsed = raw !== null && raw !== undefined ? Number(raw) : 0
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  } catch (error) {
    console.warn("[Chat] Quota read failed, using fallback map", error)
    const entry = fallbackIpQuotaMap.get(ip)
    if (!entry || Date.now() > entry.resetAt) return 0
    return entry.count
  }
}

async function readEphemeralHistory(historyKey: string): Promise<ChatMessage[]> {
  try {
    const stored = await kv.lrange(historyKey, 0, -1)
    if (!stored || stored.length === 0) return []

    const validatedHistory: ChatMessage[] = []
    for (const item of stored) {
      try {
        const raw = typeof item === "string" ? JSON.parse(item) : item
        const parsedItem = chatMessageSchema.safeParse(raw)
        if (parsedItem.success && parsedItem.data.content.length > 0) {
          validatedHistory.push(parsedItem.data)
        }
      } catch {
        // Ignore corrupted entries
      }
    }
    return validatedHistory.slice(-MAX_HISTORY_ITEMS)
  } catch (error) {
    console.warn("[Chat] Failed to fetch ephemeral memory", error)
    return []
  }
}

const chatRequestSchema = z.object({
  session_id: z.string().uuid(),
  message: z
    .string()
    .min(1)
    .max(MAX_MESSAGE_LENGTH)
    .transform((val) => sanitizeText(val, MAX_MESSAGE_LENGTH)),
  lang: z.string().optional(),
})

// ── Helpers ────────────────────────────────────────────────
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

// ── GET Handler (Session & Quota Sync) ───────────────────────
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request)
    const { searchParams } = new URL(request.url)
    const sessionIdParam = searchParams.get("session_id")

    let validSessionId: string | null = null
    if (sessionIdParam !== null && sessionIdParam !== "") {
      const parsedSession = z.string().uuid().safeParse(sessionIdParam)
      if (!parsedSession.success) {
        return Response.json({ error: "Invalid session_id" }, { status: 400 })
      }
      validSessionId = parsedSession.data
    }

    const usedCount = await readIpQuotaCount(ip)
    const remaining = Math.max(0, MAX_QUESTIONS_PER_HOUR - usedCount)
    const history = validSessionId
      ? await readEphemeralHistory(`chat_history:${ip}:${validSessionId}`)
      : []

    return Response.json(
      {
        remaining,
        maxQuestions: MAX_QUESTIONS_PER_HOUR,
        history,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    console.error("[Chat] GET sync error:", error)
    return Response.json(
      { error: CHAT_TEXT.en.internalServerError },
      { status: 500 }
    )
  }
}

// ── POST Handler ───────────────────────────────────────────
export async function POST(request: Request) {
  let responseLanguage: ChatLanguage = resolveUiLanguage(
    request.headers.get("accept-language") ?? undefined
  )

  try {
    const ip = getClientIp(request)

    // 1. Global IP Rate Limiting
    try {
      const { success } = await ipRatelimit.limit(`ratelimit:chat_ip:${ip}`)
      if (!success) {
        return Response.json(
          { error: CHAT_TEXT[responseLanguage].rateLimitReached },
          { status: 429 }
        )
      }
    } catch (error) {
      console.warn("[Chat] IP ratelimit failed", error)
    }

    // 2. Parse & validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const parsed = chatRequestSchema.safeParse(body)
    const uiLanguage = resolveUiLanguage(
      typeof body === "object" && body !== null && "lang" in body
        ? String((body as { lang?: string }).lang)
        : request.headers.get("accept-language") ?? undefined
    )
    responseLanguage = uiLanguage
    const validationText = CHAT_TEXT[uiLanguage]

    if (!parsed.success) {
      const isSessionError = parsed.error.issues.some((i) =>
        i.path.includes("session_id")
      )
      if (isSessionError) {
        return Response.json(
          { error: validationText.invalidSession },
          { status: 400 }
        )
      }
      return Response.json(
        {
          error: validationText.messageRequired,
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { session_id, message } = parsed.data
    // Detect per-message language (overrides UI lang & prior turn language on ID <-> EN switches)
    responseLanguage = detectMessageLanguage(message, uiLanguage)
    const text = CHAT_TEXT[responseLanguage]

    // 3. Redis Session Counters (Strictly by IP, atomic INCR + EXPIRE)
    const quotaKey = `chat_quota:${ip}`
    let count = 0
    let quotaIncrementedInRedis = false

    try {
      const result = await kv.eval<number[], number>(
        INCR_WITH_EXPIRE_SCRIPT,
        [quotaKey],
        [QUOTA_TTL_SECONDS]
      )
      count = Number(result)
      quotaIncrementedInRedis = true
    } catch (error) {
      console.warn("[Chat] Session counter failed", error)
      // Fallback: enforce both per-IP in-memory limit and Supabase session count
      const fallbackIpCount = incrementFallbackIpQuota(ip)
      const { count: sbCount, error: sbError } = await supabaseAdmin
        .from("chat_logs")
        .select("id", { count: "exact", head: true })
        .eq("session_id", session_id)
        .eq("role", "user")

      if (sbError) {
        console.error("[Chat] Fallback Supabase count failed", sbError)
        return Response.json({ error: text.rateLimitCheckFailed }, { status: 503 })
      }
      count = Math.max(fallbackIpCount, (sbCount ?? 0) + 1)
    }

    if (count > MAX_QUESTIONS_PER_HOUR) {
      return Response.json(
        {
          error: text.rateLimitReached,
          message: interpolate(text.rateLimitMessage, {
            max: MAX_QUESTIONS_PER_HOUR,
          }),
          remaining: 0,
        },
        { status: 429 }
      )
    }

    // 4. Ephemeral Chat Memory (server-authoritative only, scoped to IP + session_id)
    const historyKey = `chat_history:${ip}:${session_id}`
    const actualHistory = await readEphemeralHistory(historyKey)

    // Build conversation contents for Gemini
    // When prior turns exist, attach an explicit turn-level language reminder on the final turn
    // (sent only to Gemini — clean `message` is persisted to Redis/Supabase) to override history language inertia.
    const cleanContents = [
      ...actualHistory.map((msg: ChatMessage) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]

    const targetLanguageLabel =
      responseLanguage === "id" ? "Indonesian (Bahasa Indonesia)" : "English"
    const geminiContents =
      actualHistory.length > 0
        ? [
            ...cleanContents.slice(0, -1),
            {
              role: "user",
              parts: [
                {
                  text: `${message}\n\n[Language lock for this turn: Answer and write all followUps strictly in ${targetLanguageLabel}, ignoring the language of earlier turns.]`,
                },
              ],
            },
          ]
        : cleanContents

    const turnSystemInstruction = `${FADHIL_KNOWLEDGE_BASE}\n${buildTurnLanguageDirective(responseLanguage)}`

    // 5. LLM Response Caching (scoped by SSE schema v4 + KB version + detected message language)
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(cleanContents))
      .digest("hex")
    const cacheKey = `chat_cache:v4:${KNOWLEDGE_BASE_VERSION}:${responseLanguage}:${hash}`
    let cachedReply: ChatStructuredReply | null = null

    try {
      const cachedResponse = await kv.get<unknown>(cacheKey)
      if (cachedResponse) {
        const rawCached =
          typeof cachedResponse === "string"
            ? JSON.parse(cachedResponse)
            : cachedResponse
        const validatedCache = chatStructuredReplySchema.safeParse(rawCached)
        if (validatedCache.success) {
          console.log("[Chat] Cache hit!")
          cachedReply = validatedCache.data
        }
      }
    } catch (e) {
      console.warn("[Chat] Cache fetch failed", e)
    }

    const remaining = Math.max(0, MAX_QUESTIONS_PER_HOUR - count)

    const persistTurn = async (finalAnswer: string, meta?: ChatMeta) => {
      const redisPersist = async () => {
        try {
          const assistantEntry: ChatMessage = {
            role: "assistant",
            content: finalAnswer,
            ...(meta?.actions?.length ? { actions: meta.actions } : {}),
            ...(meta?.followUps?.length ? { followUps: meta.followUps } : {}),
          }
          const p = kv.pipeline()
          p.rpush(historyKey, JSON.stringify({ role: "user", content: message }))
          p.rpush(historyKey, JSON.stringify(assistantEntry))
          p.ltrim(historyKey, -MAX_HISTORY_ITEMS, -1)
          p.expire(historyKey, QUOTA_TTL_SECONDS)
          await p.exec()
        } catch (e) {
          console.warn("[Chat] Ephemeral memory update failed", e)
        }
      }

      const supabasePersist = async () => {
        const { error: insertError } = await supabaseAdmin
          .from("chat_logs")
          .insert([
            { session_id, role: "user", content: message.trim() },
            { session_id, role: "assistant", content: finalAnswer },
          ])

        if (insertError) {
          console.error("Supabase insert error:", insertError)
        }
      }

      await Promise.allSettled([redisPersist(), supabasePersist()])
    }

    const encoder = new TextEncoder()

    // Fast SSE response when Redis cache hits
    if (cachedReply) {
      const reply = cachedReply
      const cachedStream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            controller.enqueue(
              encoder.encode(
                formatSseEvent({ type: "delta", text: reply.answer })
              )
            )
            controller.enqueue(
              encoder.encode(
                formatSseEvent({
                  type: "meta",
                  actions: reply.actions,
                  followUps: reply.followUps,
                  remaining,
                })
              )
            )
            await persistTurn(reply.answer, {
              actions: reply.actions,
              followUps: reply.followUps,
            })
            controller.enqueue(
              encoder.encode(formatSseEvent({ type: "done" }))
            )
            controller.close()
          } catch (streamErr) {
            console.error("[Chat] Cached stream error:", streamErr)
            try {
              controller.close()
            } catch {
              // Ignore already-closed controller
            }
          }
        },
      })

      return new Response(cachedStream, { headers: SSE_HEADERS })
    }

    // 6. Connect to Gemini streaming API with fallback chain BEFORE opening HTTP 200 SSE
    // Fetching the first chunk validates the model is healthy (not 429/503/404) so fallback works cleanly.
    let activeIterator: AsyncIterator<{ text?: string }> | null = null
    let firstResult: IteratorResult<{ text?: string }> | null = null
    let lastError: unknown = null

    for (const model of GEMINI_MODELS) {
      try {
        const stream = await ai.models.generateContentStream({
          model,
          contents: geminiContents,
          config: {
            systemInstruction: turnSystemInstruction,
            temperature: 0.2,
            maxOutputTokens: 1400,
            thinkingConfig: getThinkingConfig(model),
          },
        })

        const iterator = stream[Symbol.asyncIterator]()
        const first = await iterator.next()
        activeIterator = iterator
        firstResult = first
        lastError = null
        console.log(`[Chat] Streaming with model: ${model}`)
        break
      } catch (err: unknown) {
        lastError = err
        if (isRetryableModelError(err)) {
          console.warn(
            `[Chat] Model ${model} unavailable (${err instanceof Error ? err.message.slice(0, 60) : "unknown"}), trying next fallback...`
          )
          continue
        }
        throw err
      }
    }

    if (!activeIterator || !firstResult || lastError) {
      console.error("All Gemini models unavailable:", lastError)
      if (quotaIncrementedInRedis) {
        try {
          await kv.decr(quotaKey)
        } catch (rollbackError) {
          console.warn("[Chat] Failed to rollback quota counter", rollbackError)
        }
      }
      return Response.json({ error: text.allModelsUnavailable }, { status: 503 })
    }

    const iterator = activeIterator
    const initialChunk = firstResult

    // 7. Stream real Markdown deltas over SSE and emit validated trailing metadata
    const sseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const splitter = createDelimitedStreamSplitter()
        let fullAnswer = ""
        let aborted = false

        const send = (chunk: string) => {
          controller.enqueue(encoder.encode(chunk))
        }

        const handleChunkText = (rawText?: string) => {
          if (!rawText) return
          const safeDelta = splitter.push(rawText)
          if (safeDelta) {
            fullAnswer += safeDelta
            send(formatSseEvent({ type: "delta", text: safeDelta }))
          }
        }

        try {
          let current = initialChunk
          while (!current.done) {
            if (request.signal.aborted) {
              aborted = true
              break
            }
            handleChunkText(current.value?.text)
            current = await iterator.next()
          }

          if (aborted || request.signal.aborted) {
            const trimmedPartial = fullAnswer.trim()
            if (trimmedPartial) {
              await persistTurn(trimmedPartial)
            }
            try {
              controller.close()
            } catch {
              // Ignore already-closed controller
            }
            return
          }

          const { remainingText, meta } = splitter.flush()
          if (remainingText) {
            fullAnswer += remainingText
            send(formatSseEvent({ type: "delta", text: remainingText }))
          }

          const finalAnswer = fullAnswer.trim() || text.noAiResponse
          if (!fullAnswer.trim()) {
            send(formatSseEvent({ type: "delta", text: finalAnswer }))
          }

          send(
            formatSseEvent({
              type: "meta",
              actions: meta.actions,
              followUps: meta.followUps,
              remaining,
            })
          )

          // Persist complete response BEFORE closing stream so immediate GET sync & serverless runtimes see it
          const structuredToCache: ChatStructuredReply = {
            answer: finalAnswer,
            actions: meta.actions,
            followUps: meta.followUps,
          }

          await Promise.allSettled([
            kv
              .set(cacheKey, JSON.stringify(structuredToCache), { ex: 86400 })
              .catch((e) => console.warn("[Chat] Cache set failed", e)),
            persistTurn(finalAnswer, meta),
          ])

          send(formatSseEvent({ type: "done" }))
          controller.close()
        } catch (streamErr) {
          console.error("[Chat] Stream error:", streamErr)
          if (!request.signal.aborted) {
            try {
              send(
                formatSseEvent({
                  type: "error",
                  message: text.internalServerError,
                })
              )
              controller.close()
            } catch {
              // Ignore closed controller
            }
          }
        }
      },
      cancel() {
        void iterator.return?.()
      },
    })

    return new Response(sseStream, { headers: SSE_HEADERS })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { error: CHAT_TEXT[responseLanguage].internalServerError },
      { status: 500 }
    )
  }
}
