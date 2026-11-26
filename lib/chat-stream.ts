import { chatMetaSchema, type ChatMeta, type ChatStreamEvent } from "@/lib/chat-types"

export const META_START = "<<<META>>>"
export const META_END = "<<<END_META>>>"

export interface DelimitedStreamSplitter {
  /** Feed an incoming model text chunk; returns safe Markdown text ready to stream to the client. */
  push: (chunk: string) => string
  /** Flush remaining buffered text and parse validated trailing metadata. */
  flush: () => { remainingText: string; meta: ChatMeta }
}

function parseMetaBuffer(raw: string): ChatMeta {
  const withoutEnd = raw.includes(META_END)
    ? raw.slice(0, raw.indexOf(META_END))
    : raw

  const cleaned = withoutEnd
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  if (!cleaned) {
    return { actions: [], followUps: [] }
  }

  try {
    const parsed: unknown = JSON.parse(cleaned)
    const validated = chatMetaSchema.safeParse(parsed)
    if (validated.success) {
      return validated.data
    }
  } catch {
    // Gracefully fall back if the model produced incomplete or malformed metadata
  }

  return { actions: [], followUps: [] }
}

/**
 * Splits a single-pass Markdown + trailing `<<<META>>>{...}<<<END_META>>>` stream
 * so Markdown tokens stream live with zero delimiter leakage across arbitrary chunk boundaries.
 */
export function createDelimitedStreamSplitter(): DelimitedStreamSplitter {
  let pending = ""
  let inMeta = false
  let metaBuffer = ""
  const lookbehind = META_START.length - 1

  return {
    push(chunk: string): string {
      if (!chunk) return ""

      if (inMeta) {
        metaBuffer += chunk
        return ""
      }

      pending += chunk
      const startIndex = pending.indexOf(META_START)
      if (startIndex !== -1) {
        const safeText = pending.slice(0, startIndex)
        metaBuffer = pending.slice(startIndex + META_START.length)
        pending = ""
        inMeta = true
        return safeText
      }

      if (pending.length <= lookbehind) {
        return ""
      }

      const emitLength = pending.length - lookbehind
      const safeText = pending.slice(0, emitLength)
      pending = pending.slice(emitLength)
      return safeText
    },

    flush(): { remainingText: string; meta: ChatMeta } {
      const remainingText = inMeta ? "" : pending
      pending = ""
      return {
        remainingText,
        meta: parseMetaBuffer(metaBuffer),
      }
    },
  }
}

/** Encodes a ChatStreamEvent into a standard Server-Sent Events (SSE) data frame. */
export function formatSseEvent(event: ChatStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`
}

/** Parses one SSE `data: ...` payload line into a ChatStreamEvent, or null if invalid. */
export function parseSseEventLine(line: string): ChatStreamEvent | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith("data:")) return null
  const jsonText = trimmed.slice(5).trim()
  if (!jsonText) return null

  try {
    const parsed: unknown = JSON.parse(jsonText)
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "type" in parsed &&
      typeof (parsed as { type: unknown }).type === "string"
    ) {
      return parsed as ChatStreamEvent
    }
  } catch {
    // Ignore malformed SSE lines
  }

  return null
}
