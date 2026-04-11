import { GoogleGenAI } from "@google/genai"
import { createClient } from "@supabase/supabase-js"
import { FADHIL_KNOWLEDGE_BASE } from "@/lib/knowledge-base"

// ── Constants ──────────────────────────────────────────────
const MAX_QUESTIONS_PER_SESSION = 3

// Fallback chain: try each model in order if the previous one is rate-limited
const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
] as const

// ── Clients ────────────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// ── Helpers ────────────────────────────────────────────────
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type SupportedLanguage = "en" | "id"

function resolveLanguage(value?: string): SupportedLanguage {
  if (!value) return "en"
  return value.toLowerCase().startsWith("id") ? "id" : "en"
}

const CHAT_TEXT = {
  en: {
    invalidSession: "Invalid or missing session_id",
    messageRequired: "Message is required",
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
    messageRequired: "Pesan wajib diisi",
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

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// ── POST Handler ───────────────────────────────────────────
export async function POST(request: Request) {
  try {
    // 1. Parse & validate request body
    const body = await request.json()
    const { session_id, message, history, lang } = body as {
      session_id: string
      message: string
      history: ChatMessage[]
      lang?: string
    }
    const language = resolveLanguage(lang)
    const text = CHAT_TEXT[language]

    if (!session_id || !UUID_REGEX.test(session_id)) {
      return Response.json({ error: text.invalidSession }, { status: 400 })
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return Response.json({ error: text.messageRequired }, { status: 400 })
    }

    // 2. Rate-limit check: count user messages in this session
    const { count, error: countError } = await supabaseAdmin
      .from("chat_logs")
      .select("id", { count: "exact", head: true })
      .eq("session_id", session_id)
      .eq("role", "user")

    if (countError) {
      console.error("Supabase count error:", countError)
      return Response.json(
        { error: text.rateLimitCheckFailed },
        { status: 500 }
      )
    }

    if ((count ?? 0) >= MAX_QUESTIONS_PER_SESSION) {
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

    // 3. Build conversation contents for Gemini
    const contents = [
      // Include previous conversation history for context
      ...(Array.isArray(history)
        ? history.map((msg: ChatMessage) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          }))
        : []),
      // Current user message
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]

    // 4. Call Gemini API with fallback chain
    let aiResponse: string = text.noAiResponse
    let lastError: unknown = null

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
        break // success — stop trying fallback models
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

        // Other unexpected error — don't try fallback, just throw
        throw err
      }
    }

    if (lastError) {
      // All models exhausted
      console.error("All Gemini models rate-limited:", lastError)
      return Response.json(
        {
          error: text.allModelsUnavailable,
        },
        { status: 503 }
      )
    }

    // 5. Log both messages to Supabase
    const { error: insertError } = await supabaseAdmin
      .from("chat_logs")
      .insert([
        { session_id, role: "user", content: message.trim() },
        { session_id, role: "assistant", content: aiResponse },
      ])

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      // Still return the AI response even if logging fails
    }

    // 6. Return response with remaining question count
    const remaining = MAX_QUESTIONS_PER_SESSION - ((count ?? 0) + 1)

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
