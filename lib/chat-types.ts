import { z } from "zod"

export const MAX_QUESTIONS_PER_HOUR = 6

export const CHAT_ACTION_IDS = [
  "download_cv",
  "copy_email",
  "open_contact",
  "open_projects",
  "open_certificates",
  "open_linkedin",
  "open_github",
  "open_whatsapp",
] as const

export type ChatActionId = (typeof CHAT_ACTION_IDS)[number]

export const chatActionIdSchema = z.enum(CHAT_ACTION_IDS)

export const chatMetaSchema = z.object({
  followUps: z
    .array(z.string().trim().min(1).max(140))
    .max(3)
    .default([])
    .transform((items) => Array.from(new Set(items)).slice(0, 3)),
  actions: z
    .array(chatActionIdSchema)
    .max(3)
    .default([])
    .transform((items) => Array.from(new Set(items)).slice(0, 3)),
})

export type ChatMeta = z.infer<typeof chatMetaSchema>

export const chatStructuredReplySchema = chatMetaSchema.extend({
  answer: z.string().min(1),
})

export type ChatStructuredReply = z.infer<typeof chatStructuredReplySchema>

export type ChatStreamEvent =
  | { type: "delta"; text: string }
  | {
      type: "meta"
      actions: ChatActionId[]
      followUps: string[]
      remaining: number
    }
  | { type: "done" }
  | { type: "error"; message: string }

export const chatHistoryItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
  actions: z.array(chatActionIdSchema).max(3).optional(),
  followUps: z.array(z.string().trim().min(1).max(140)).max(3).optional(),
})

export type ChatHistoryItem = z.infer<typeof chatHistoryItemSchema>

export interface ChatSessionStateResponse {
  remaining: number
  maxQuestions: number
  history: ChatHistoryItem[]
}
