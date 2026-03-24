"use client"

import { Bot, Send, X, Loader2, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ReactMarkdown from "react-markdown"

// ── Types ──────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface AiChatDialogProps {
  isOpen: boolean
  onClose: () => void
}

const MAX_QUESTIONS = 7

// ── Component ──────────────────────────────────────────────
export function AiChatDialog({ isOpen, onClose }: AiChatDialogProps) {
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

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || remaining <= 0 || !sessionId) return

    const userMessage = input.trim()
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
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setRemaining(0)
          setError(data.message || "Rate limit reached.")
        } else {
          setError(data.error || "Something went wrong.")
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
      setError("Failed to connect to the server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isLimitReached = remaining <= 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-32 left-1/2 z-100 flex w-[calc(100vw-2rem)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl md:right-auto md:left-12 md:w-87.5 md:translate-x-0"
          style={{ height: "500px", maxHeight: "calc(100vh - 160px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Fadhil AI</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {remaining}/{MAX_QUESTIONS}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleNewSession}
                aria-label="New Session"
                title="Start new session"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close Chat"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-2 text-sm text-foreground">
                  Hi there! 👋 I&apos;m Fadhil&apos;s AI assistant. Ask me anything about his
                  skills, experience, projects, or education. You have{" "}
                  <strong>{MAX_QUESTIONS} questions</strong> per session.
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
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0">
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
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span className="text-muted-foreground">Thinking...</span>
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
                  Session limit reached.{" "}
                  <button
                    onClick={handleNewSession}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Start a new session
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
                    ? "Session limit reached"
                    : "Ask something..."
                }
                className="w-full rounded-full border border-border bg-muted py-2.5 pr-10 pl-4 text-sm transition-colors outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isLimitReached}
              />
              <button
                type="submit"
                aria-label="Send Message"
                disabled={!input.trim() || isLoading || isLimitReached}
                className="absolute right-1.5 rounded-full bg-primary p-1.5 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
