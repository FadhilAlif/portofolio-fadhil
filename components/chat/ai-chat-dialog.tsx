"use client"

import {
  RobotIcon,
  PaperPlaneRightIcon,
  XIcon,
  CircleNotchIcon,
  ArrowClockwiseIcon,
  SparkleIcon,
} from "@phosphor-icons/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { useTranslation } from "react-i18next"
import { getSupportedLanguage } from "@/lib/i18n/config"

// ── Types ──────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface AiChatDialogProps {
  isOpen: boolean
  onClose: () => void
}

const MAX_QUESTIONS = 3

// ── Component ──────────────────────────────────────────────
export function AiChatDialog({ isOpen, onClose }: AiChatDialogProps) {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(MAX_QUESTIONS)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize session on first open
  useEffect(() => {
    if (isOpen && !sessionId) {
      setSessionId(crypto.randomUUID())
    }
  }, [isOpen, sessionId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Reset session
  const handleNewSession = useCallback(() => {
    setSessionId(crypto.randomUUID())
    setMessages([])
    setRemaining(MAX_QUESTIONS)
    setError(null)
    setInput("")
  }, [])

  // Send message (supports direct text for badge clicks)
  const handleSend = async (e?: React.FormEvent, directMessage?: string) => {
    e?.preventDefault()
    const userMessage = (directMessage ?? input).trim()
    if (!userMessage || isLoading || remaining <= 0 || !sessionId) return

    setInput("")
    setError(null)

    // Optimistically add user message
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
          history: messages, // send previous messages as context
          lang: getSupportedLanguage(i18n.resolvedLanguage),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setRemaining(0)
          setError(t("chat.rateLimitReached"))
        } else {
          setError(t("chat.unknownError"))
        }
        return
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ])
      setRemaining(data.remaining ?? remaining - 1)
    } catch {
      setError(t("chat.connectionError"))
    } finally {
      setIsLoading(false)
    }
  }

  const isLimitReached = remaining <= 0
  const suggestionBadges = t("chat.suggestions", {
    returnObjects: true,
  }) as string[]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed right-2 bottom-4 left-2 z-100 flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:right-6 md:bottom-6 md:left-auto md:w-95"
          style={{ height: "min(520px, calc(100vh - 100px))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <RobotIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t("chat.title")}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {remaining}/{MAX_QUESTIONS}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleNewSession}
                aria-label={t("chat.newSessionLabel")}
                title={t("chat.newSessionTitle")}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowClockwiseIcon className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                aria-label={t("chat.closeChatLabel")}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {/* Welcome message + suggestion badges */}
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex w-full justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-2 text-sm text-foreground">
                    {t("chat.welcome", { count: MAX_QUESTIONS })}
                  </div>
                </div>

                {/* Suggestion Badges */}
                <div className="flex flex-wrap gap-2 px-1">
                  {suggestionBadges.map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 }}
                      onClick={() => handleSend(undefined, suggestion)}
                      disabled={isLoading}
                      className="group flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                    >
                      <SparkleIcon className="h-3 w-3 text-primary/60 transition-colors group-hover:text-primary" />
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm border border-border bg-muted text-foreground"
                  } `}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_li]:my-0 [&_ol]:my-1 [&_p]:m-0 [&_ul]:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-3 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <CircleNotchIcon className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span className="text-muted-foreground">
                      {t("chat.thinking")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {error}
                </div>
              </div>
            )}

            {/* Rate limit reached */}
            {isLimitReached && !error && (
              <div className="flex w-full justify-center">
                <div className="rounded-xl bg-muted px-4 py-2 text-center text-xs text-muted-foreground">
                  {t("chat.sessionLimit")}{" "}
                  <button
                    onClick={handleNewSession}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {t("chat.startNewSession")}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background p-3">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isLimitReached
                    ? t("chat.placeholderLimitReached")
                    : t("chat.placeholderAsk")
                }
                className="w-full rounded-full border border-border bg-muted py-2.5 pr-10 pl-4 text-sm transition-colors outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isLimitReached}
              />
              <button
                type="submit"
                aria-label={t("chat.sendMessageLabel")}
                disabled={!input.trim() || isLoading || isLimitReached}
                className="absolute right-1.5 rounded-full bg-primary p-1.5 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <PaperPlaneRightIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
