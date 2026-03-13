"use client"

import { Bot, Send, X } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface AiChatDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AiChatDialog({ isOpen, onClose }: AiChatDialogProps) {
  const [messages, setMessages] = useState<
    { role: "user" | "system"; text: string }[]
  >([
    {
      role: "system",
      text: "Hi there! I'm Fadhil's AI assistant. Ask me anything about his portfolio or skills.",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: input }])

    // Process "AI" response (mocked)
    const thinkingMessage = input
    setInput("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: `I am just a simple mock right now, but I heard you say: "${thinkingMessage}". Let me get back to you later!`,
        },
      ])
    }, 1000)
  }

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
            </div>
            <button
              onClick={onClose}
              aria-label="Close Chat"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
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
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background p-3">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask something..."
                className="w-full rounded-full border border-border bg-muted py-2.5 pr-10 pl-4 text-sm transition-colors outline-none focus:border-primary/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Send Message"
                disabled={!input.trim()}
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
