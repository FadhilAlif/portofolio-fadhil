"use client"

import {
  RobotIcon,
  PaperPlaneRightIcon,
  StopIcon,
  XIcon,
  SparkleIcon,
  WarningCircleIcon,
  ArrowClockwiseIcon,
  DownloadIcon,
  EnvelopeIcon,
  FolderIcon,
  CertificateIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
  WhatsappLogoIcon,
  ArrowUpRightIcon,
  ArrowBendDownRightIcon,
  NotePencilIcon,
} from "@phosphor-icons/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import ReactMarkdown from "react-markdown"
import { useTranslation } from "react-i18next"
import { getSupportedLanguage } from "@/lib/i18n/config"
import { useIsMobile } from "@/hooks/use-mobile"
import { TextShimmer } from "@/components/arc/text-shimmer/text-shimmer"
import { BottomSheet } from "@/components/arc/bottom-sheet/bottom-sheet"
import { CopyButton } from "@/components/arc/copy-button/copy-button"
import { siteConfig } from "@/lib/site-config"
import { CLARITY_EVENTS, setClarityTag, trackClarityEvent } from "@/lib/clarity"
import {
  MAX_QUESTIONS_PER_HOUR,
  type ChatActionId,
  type ChatSessionStateResponse,
} from "@/lib/chat-types"
import { parseSseEventLine } from "@/lib/chat-stream"

// ── Types ──────────────────────────────────────────────────
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  actions?: ChatActionId[]
  followUps?: string[]
  error?: boolean
  isStreaming?: boolean
}

interface AiChatDialogProps {
  isOpen: boolean
  onClose: () => void
}

const VISIBLE_SUGGESTIONS = 3
const MAX_CHARS = 1000

// ── Helpers ────────────────────────────────────────────────
/** Fisher-Yates shuffle — returns a new array */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Inline Action CTAs ─────────────────────────────────────
function ChatActionRow({
  actions,
  onNavigate,
}: {
  actions: ChatActionId[]
  onNavigate: (path: string) => void
}) {
  const { t } = useTranslation()

  const trackSocial = (platform: string) => {
    setClarityTag("social_platform", platform)
    trackClarityEvent(CLARITY_EVENTS.socialLinkClick)
  }

  const pillClass =
    "inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-card/80 px-2.5 text-[11px] font-medium text-foreground transition-colors hover:cursor-pointer hover:border-primary/40 hover:bg-muted"

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-2 flex flex-wrap items-center gap-1.5"
    >
      {actions.map((action) => {
        switch (action) {
          case "download_cv":
            return (
              <a
                key={action}
                href={siteConfig.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setClarityTag("download_asset", "cv")
                  trackClarityEvent(CLARITY_EVENTS.downloadCvClick)
                }}
                className={pillClass}
              >
                <DownloadIcon className="h-3.5 w-3.5 text-primary" />
                {t("chat.actions.download_cv")}
              </a>
            )
          case "copy_email":
            return (
              <CopyButton
                key={action}
                value={siteConfig.email}
                label={t("chat.actions.copy_email")}
                variant="outline"
                onCopied={() => trackSocial("email")}
                className="h-7! min-h-7! rounded-lg! px-2.5! text-[11px]!"
              />
            )
          case "open_contact":
            return (
              <button
                key={action}
                type="button"
                onClick={() => {
                  setClarityTag("contact_button_source", "ai_chat")
                  trackClarityEvent(CLARITY_EVENTS.contactButtonClick)
                  onNavigate("/contact")
                }}
                className={pillClass}
              >
                <EnvelopeIcon className="h-3.5 w-3.5 text-primary" />
                {t("chat.actions.open_contact")}
                <ArrowUpRightIcon className="h-3 w-3 text-muted-foreground" />
              </button>
            )
          case "open_projects":
            return (
              <button
                key={action}
                type="button"
                onClick={() => onNavigate("/projects")}
                className={pillClass}
              >
                <FolderIcon className="h-3.5 w-3.5 text-primary" />
                {t("chat.actions.open_projects")}
                <ArrowUpRightIcon className="h-3 w-3 text-muted-foreground" />
              </button>
            )
          case "open_certificates":
            return (
              <button
                key={action}
                type="button"
                onClick={() => onNavigate("/certificates")}
                className={pillClass}
              >
                <CertificateIcon className="h-3.5 w-3.5 text-primary" />
                {t("chat.actions.open_certificates")}
                <ArrowUpRightIcon className="h-3 w-3 text-muted-foreground" />
              </button>
            )
          case "open_linkedin":
            return (
              <a
                key={action}
                href={siteConfig.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial("linkedin")}
                className={pillClass}
              >
                <LinkedinLogoIcon className="h-3.5 w-3.5 text-primary" />
                {t("chat.actions.open_linkedin")}
                <ArrowUpRightIcon className="h-3 w-3 text-muted-foreground" />
              </a>
            )
          case "open_github":
            return (
              <a
                key={action}
                href={siteConfig.github.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial("github")}
                className={pillClass}
              >
                <GithubLogoIcon className="h-3.5 w-3.5 text-primary" />
                {t("chat.actions.open_github")}
                <ArrowUpRightIcon className="h-3 w-3 text-muted-foreground" />
              </a>
            )
          case "open_whatsapp":
            return (
              <a
                key={action}
                href={`https://wa.me/${siteConfig.whatsapp.number}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial("whatsapp")}
                className={pillClass}
              >
                <WhatsappLogoIcon className="h-3.5 w-3.5 text-primary" />
                {t("chat.actions.open_whatsapp")}
                <ArrowUpRightIcon className="h-3 w-3 text-muted-foreground" />
              </a>
            )
          default:
            return null
        }
      })}
    </motion.div>
  )
}

// ── Component ──────────────────────────────────────────────
export function AiChatDialog({ isOpen, onClose }: AiChatDialogProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(MAX_QUESTIONS_PER_HOUR)
  const [error, setError] = useState<string | null>(null)
  const [contextualFollowUps, setContextualFollowUps] = useState<string[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const syncedSessionRef = useRef<string | null>(null)

  const handleNavigate = useCallback(
    (path: string) => {
      onClose()
      router.push(path)
    },
    [onClose, router]
  )

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    )
    setIsLoading(false)
    setIsStreaming(false)
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isNearBottomRef.current = distanceFromBottom < 80
  }, [])

  // Abort any in-flight stream on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // ── Suggestion badges: show 3 at a time, shuffle on "load more" ──
  const allSuggestions = useMemo(
    () => t("chat.suggestions", { returnObjects: true }) as string[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.resolvedLanguage]
  )
  const [visibleSuggestions, setVisibleSuggestions] = useState<string[]>([])

  // Initialize visible suggestions when allSuggestions changes
  useEffect(() => {
    setVisibleSuggestions(shuffle(allSuggestions).slice(0, VISIBLE_SUGGESTIONS))
  }, [allSuggestions])

  const handleLoadMoreSuggestions = useCallback(() => {
    setContextualFollowUps([])
    setVisibleSuggestions((prev) => {
      // Pick 3 that are NOT currently showing (if possible)
      const rest = allSuggestions.filter((s) => !prev.includes(s))
      if (rest.length >= VISIBLE_SUGGESTIONS) {
        return shuffle(rest).slice(0, VISIBLE_SUGGESTIONS)
      }
      // Fallback: just reshuffle all
      return shuffle(allSuggestions).slice(0, VISIBLE_SUGGESTIONS)
    })
  }, [allSuggestions])

  // Initialize session from localStorage or create new (validate UUID syntax)
  useEffect(() => {
    if (isOpen && !sessionId) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      const stored = localStorage.getItem("chat_session_id")
      if (stored && uuidPattern.test(stored)) {
        setSessionId(stored)
      } else {
        const newId = crypto.randomUUID()
        localStorage.setItem("chat_session_id", newId)
        setSessionId(newId)
      }
    }
  }, [isOpen, sessionId])

  // Sync conversation history & server-authoritative quota when dialog opens
  useEffect(() => {
    if (!isOpen || !sessionId || syncedSessionRef.current === sessionId) {
      return
    }

    const controller = new AbortController()
    setIsSyncing(true)

    fetch(`/api/chat?session_id=${encodeURIComponent(sessionId)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) =>
        res.ok ? (res.json() as Promise<ChatSessionStateResponse>) : null
      )
      .then((data) => {
        if (!data || controller.signal.aborted) return
        syncedSessionRef.current = sessionId
        if (typeof data.remaining === "number") {
          setRemaining(data.remaining)
        }
        if (Array.isArray(data.history) && data.history.length > 0) {
          let restoredMessages = false
          setMessages((prev) => {
            if (prev.length > 0) return prev
            restoredMessages = true
            return data.history.map((item) => ({
              id: crypto.randomUUID(),
              role: item.role,
              content: item.content,
              actions: item.actions,
              followUps: item.followUps,
              isStreaming: false,
            }))
          })
          if (restoredMessages) {
            const lastAssistant = [...data.history]
              .reverse()
              .find((item) => item.role === "assistant")
            if (lastAssistant?.followUps && lastAssistant.followUps.length > 0) {
              setContextualFollowUps(lastAssistant.followUps)
            }
          }
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        // Non-fatal: chat continues to work even if sync fails
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsSyncing(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [isOpen, sessionId])

  const handleNewChat = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    const newId = crypto.randomUUID()
    try {
      localStorage.setItem("chat_session_id", newId)
    } catch {
      // Ignore storage errors in restricted browser modes
    }
    syncedSessionRef.current = newId
    setSessionId(newId)
    setMessages([])
    setContextualFollowUps([])
    setError(null)
    setInput("")
    setIsLoading(false)
    setIsStreaming(false)
    setIsSyncing(false)
    setVisibleSuggestions(shuffle(allSuggestions).slice(0, VISIBLE_SUGGESTIONS))
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [allSuggestions])

  // Smart Auto-Scroll: only scroll to bottom when the user is already near the bottom
  useEffect(() => {
    if (!isNearBottomRef.current) return
    messagesEndRef.current?.scrollIntoView({
      behavior: isStreaming ? "auto" : "smooth",
    })
  }, [messages, isLoading, isStreaming, contextualFollowUps])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Escape handler for desktop floating dialog (BottomSheet handles Escape via Radix Dialog on mobile)
  useEffect(() => {
    if (!isOpen || isMobile) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isMobile, onClose])

  // Send message (supports direct text for badge clicks & real SSE token streaming)
  const handleSend = async (
    e?: React.FormEvent,
    directMessage?: string,
    retryId?: string
  ) => {
    e?.preventDefault()
    let userMessage = directMessage

    if (retryId) {
      const msg = messages.find((m) => m.id === retryId)
      if (msg) userMessage = msg.content
    } else {
      userMessage = userMessage ?? input.trim()
    }

    if (
      !userMessage ||
      isLoading ||
      isStreaming ||
      remaining <= 0 ||
      !sessionId
    ) {
      return
    }

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    isNearBottomRef.current = true
    setInput("")
    setError(null)
    setContextualFollowUps([])
    setIsLoading(true)
    setIsStreaming(false)

    // Remove old errored message if retrying
    if (retryId) {
      setMessages((prev) => prev.filter((m) => m.id !== retryId))
    }

    const newMessageId = crypto.randomUUID()
    let assistantMessageId: string | null = null

    // Optimistically add user message
    setMessages((prev) => [
      ...prev.filter((m) => !m.error || m.role !== "user"),
      { id: newMessageId, role: "user", content: userMessage as string },
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
          lang: getSupportedLanguage(i18n.resolvedLanguage),
        }),
      })

      if (!res.ok) {
        if (res.status === 429) {
          setRemaining(0)
          setError(t("chat.rateLimitReached"))
        } else {
          setError(t("chat.unknownError"))
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === newMessageId ? { ...m, error: true } : m))
        )
        return
      }

      const contentType = res.headers.get("content-type") ?? ""

      // Real SSE Streaming Path
      if (contentType.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder("utf-8")
        let sseBuffer = ""
        let receivedMeta = false

        const processLine = (line: string) => {
          const event = parseSseEventLine(line)
          if (!event) return

          if (event.type === "delta" && event.text) {
            if (!assistantMessageId) {
              assistantMessageId = crypto.randomUUID()
              const createdId = assistantMessageId
              setIsLoading(false)
              setIsStreaming(true)
              setMessages((prev) => [
                ...prev,
                {
                  id: createdId,
                  role: "assistant",
                  content: event.text,
                  isStreaming: true,
                },
              ])
            } else {
              const targetId = assistantMessageId
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === targetId
                    ? { ...m, content: m.content + event.text }
                    : m
                )
              )
            }
          } else if (event.type === "meta") {
            receivedMeta = true
            const targetId = assistantMessageId
            if (targetId) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === targetId
                    ? {
                        ...m,
                        actions: event.actions,
                        followUps: event.followUps,
                      }
                    : m
                )
              )
            }
            setContextualFollowUps(event.followUps)
            setRemaining(event.remaining)
          } else if (event.type === "done") {
            const targetId = assistantMessageId
            if (targetId) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === targetId ? { ...m, isStreaming: false } : m
                )
              )
            }
            setIsStreaming(false)
            setIsLoading(false)
          } else if (event.type === "error") {
            setError(event.message || t("chat.unknownError"))
            const targetId = assistantMessageId
            if (targetId) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === targetId ? { ...m, isStreaming: false } : m
                )
              )
            }
            setIsStreaming(false)
            setIsLoading(false)
          }
        }

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          sseBuffer += decoder.decode(value, { stream: true })
          const lines = sseBuffer.split("\n")
          sseBuffer = lines.pop() ?? ""
          for (const line of lines) {
            processLine(line)
          }
        }

        if (sseBuffer.trim()) {
          processLine(sseBuffer)
        }

        // Ensure streaming state settles cleanly if stream closed without explicit done frame
        if (assistantMessageId) {
          const targetId = assistantMessageId
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetId ? { ...m, isStreaming: false } : m
            )
          )
        }
        if (!receivedMeta && !controller.signal.aborted) {
          setRemaining((prev) => Math.max(0, prev - 1))
        }
        return
      }

      // JSON Fallback Path (backwards compatibility)
      const data = await res.json()
      const actions = Array.isArray(data.actions)
        ? (data.actions as ChatActionId[])
        : []
      const followUps = Array.isArray(data.followUps)
        ? (data.followUps as string[]).filter(
            (item): item is string =>
              typeof item === "string" && item.trim().length > 0
          )
        : []

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
          actions,
          followUps,
          isStreaming: false,
        },
      ])
      setContextualFollowUps(followUps)
      setRemaining(data.remaining ?? remaining - 1)
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // User stopped generation cleanly
        if (assistantMessageId) {
          const targetId = assistantMessageId
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetId ? { ...m, isStreaming: false } : m
            )
          )
        }
        return
      }
      setError(t("chat.connectionError"))
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessageId ? { ...m, error: true } : m))
      )
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const isLimitReached = remaining <= 0
  const isBusy = isLoading || isStreaming

  const chatMessagesContent = (
    <>
      {/* Syncing indicator or Welcome message */}
      {isSyncing && messages.length === 0 ? (
        <div className="flex w-full justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
            <TextShimmer active={isSyncing} className="text-xs font-medium">
              {t("chat.syncingSession")}
            </TextShimmer>
          </div>
        </div>
      ) : (
        messages.length === 0 && (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-2 text-sm text-foreground">
              {t("chat.welcome", { count: MAX_QUESTIONS_PER_HOUR })}
            </div>
          </div>
        )
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
        >
          <div
            className={`max-w-[85%] overflow-x-auto rounded-2xl px-4 py-2 text-sm wrap-break-word ${
              msg.role === "user"
                ? msg.error
                  ? "rounded-tr-sm border border-destructive bg-destructive/10 text-destructive"
                  : "rounded-tr-sm bg-primary text-primary-foreground"
                : "rounded-tl-sm border border-border bg-muted text-foreground"
            } `}
          >
            {msg.role === "assistant" ? (
              <div className="prose prose-sm dark:prose-invert max-w-none [&_a]:break-all [&_li]:my-0 [&_ol]:my-1 [&_p]:m-0 [&_ul]:my-1">
                <ReactMarkdown
                  components={{
                    a: ({ ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
                {msg.isStreaming && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-3.5 w-1.5 animate-blink-cursor align-middle bg-primary/80"
                  />
                )}
              </div>
            ) : (
              <p className="m-0 whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>
          {msg.role === "assistant" &&
            !msg.isStreaming &&
            msg.actions &&
            msg.actions.length > 0 && (
              <ChatActionRow
                actions={msg.actions}
                onNavigate={handleNavigate}
              />
            )}
          {msg.error && msg.role === "user" && (
            <button
              onClick={() => handleSend(undefined, undefined, msg.id)}
              className="mt-1 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowClockwiseIcon className="h-3 w-3" /> Retry
            </button>
          )}
        </div>
      ))}

      {/* Loading indicator (ArcUI TextShimmer) */}
      {isLoading && (
        <div className="flex w-full justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <SparkleIcon
                className="h-3.5 w-3.5 shrink-0 text-primary/70"
                weight="fill"
              />
              <TextShimmer active={isLoading} className="text-sm font-medium">
                {t("chat.thinking")}
              </TextShimmer>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Follow-ups or Starter Suggestion Badges */}
      {!isBusy && !isLimitReached && (
        <div className="flex flex-col gap-2 px-1">
          {contextualFollowUps.length > 0 && (
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground/80 uppercase">
              {t("chat.followUpLabel")}
            </span>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <AnimatePresence mode="popLayout">
              {(contextualFollowUps.length > 0
                ? contextualFollowUps
                : visibleSuggestions
              ).map((suggestion) => {
                const isFollowUp = contextualFollowUps.length > 0
                return (
                  <motion.button
                    key={suggestion}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      handleSend(undefined, suggestion)
                      if (!isFollowUp) {
                        handleLoadMoreSuggestions()
                      }
                    }}
                    disabled={isLoading}
                    className="group flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs font-medium text-muted-foreground transition-all hover:cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isFollowUp ? (
                      <ArrowBendDownRightIcon className="h-3 w-3 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
                    ) : (
                      <SparkleIcon className="h-3 w-3 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
                    )}
                    <span>{suggestion}</span>
                  </motion.button>
                )
              })}
            </AnimatePresence>

            {/* Load more / switch back to starter suggestions */}
            <motion.button
              layout
              onClick={handleLoadMoreSuggestions}
              title={
                contextualFollowUps.length > 0
                  ? t("chat.moreTopics")
                  : t("chat.loadMoreSuggestions")
              }
              aria-label={
                contextualFollowUps.length > 0
                  ? t("chat.moreTopics")
                  : t("chat.loadMoreSuggestions")
              }
              className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <SparkleIcon
                className="h-3.5 w-3.5 transition-transform group-hover:rotate-45"
                weight="fill"
              />
            </motion.button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex w-full justify-start">
          <div className="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-sm border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <WarningCircleIcon className="h-4 w-4 shrink-0" />
            {error}
          </div>
        </div>
      )}

      {/* Rate limit reached */}
      {isLimitReached && !error && (
        <div className="flex w-full justify-center">
          <div className="rounded-xl bg-muted px-4 py-2 text-center text-xs text-muted-foreground">
            {t("chat.sessionLimit")}
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  )

  const chatComposer = (
    <div className="flex flex-col gap-1">
      <form onSubmit={handleSend} className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          maxLength={MAX_CHARS}
          placeholder={
            isLimitReached
              ? t("chat.placeholderLimitReached")
              : t("chat.placeholderAsk")
          }
          className="w-full rounded-full border border-border bg-muted py-2.5 pr-10 pl-4 text-sm transition-colors outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isBusy || isLimitReached}
        />
        {isBusy ? (
          <button
            type="button"
            onClick={handleStop}
            aria-label={t("chat.stopGeneratingLabel")}
            title={t("chat.stopGeneratingLabel")}
            className="absolute right-1.5 rounded-full bg-destructive/90 p-1.5 text-white transition-opacity hover:cursor-pointer hover:opacity-90"
          >
            <StopIcon className="h-4 w-4" weight="fill" />
          </button>
        ) : (
          <button
            type="submit"
            aria-label={t("chat.sendMessageLabel")}
            disabled={!input.trim() || isLimitReached}
            className="absolute right-1.5 rounded-full bg-primary p-1.5 text-primary-foreground transition-opacity hover:cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PaperPlaneRightIcon className="h-4 w-4" />
          </button>
        )}
      </form>
      <div
        className={`px-2 text-right text-[10px] ${input.length >= MAX_CHARS ? "text-destructive" : "text-muted-foreground/60"}`}
      >
        {input.length}/{MAX_CHARS}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <BottomSheet
        open={isOpen}
        onOpenChange={(next) => {
          if (!next) onClose()
        }}
        title={t("chat.title")}
        description={`${remaining}/${MAX_QUESTIONS_PER_HOUR}`}
        detents={[0.68, 0.92]}
        initialDetent={1}
        closeLabel={t("chat.closeChatLabel")}
      >
        <div className="flex min-h-full flex-col justify-between gap-4">
          <div className="flex flex-col gap-4 pt-1">
            {messages.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNewChat}
                  disabled={isBusy}
                  aria-label={t("chat.newChatLabel")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:cursor-pointer hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <NotePencilIcon className="h-3.5 w-3.5" />
                  {t("chat.newChatLabel")}
                </button>
              </div>
            )}
            {chatMessagesContent}
          </div>
          <div className="sticky bottom-0 -mx-4 border-t border-border bg-[var(--surface-raised)]/95 px-4 pt-3 pb-1 backdrop-blur-sm">
            {chatComposer}
          </div>
        </div>
      </BottomSheet>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("chat.title")}
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
                {remaining}/{MAX_QUESTIONS_PER_HOUR}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleNewChat}
                  disabled={isBusy}
                  title={t("chat.newChatLabel")}
                  aria-label={t("chat.newChatLabel")}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:cursor-pointer hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <NotePencilIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label={t("chat.closeChatLabel")}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:cursor-pointer hover:bg-muted hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
          >
            {chatMessagesContent}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background p-3">
            {chatComposer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
