"use client"

import { Bot, Send, X } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface AiChatDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AiChatDialog({ isOpen, onClose }: AiChatDialogProps) {
  const [messages, setMessages] = useState<{role: 'user'|'system', text: string}[]>([
    { role: "system", text: "Hi there! I'm Fadhil's AI assistant. Ask me anything about his portfolio or skills." }
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
        { role: "system", text: `I am just a simple mock right now, but I heard you say: "${thinkingMessage}". Let me get back to you later!` }
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
          className="fixed bottom-32 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 md:right-auto z-100 w-[calc(100vw-2rem)] md:w-[350px] bg-background border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
          style={{ height: '500px', maxHeight: 'calc(100vh - 160px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-muted/50 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm">Fadhil AI</span>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close Chat"
              className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted text-foreground border border-border rounded-tl-sm'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-background">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask something..."
                className="w-full bg-muted border border-border rounded-full pl-4 pr-10 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                aria-label="Send Message"
                disabled={!input.trim()}
                className="absolute right-1.5 p-1.5 bg-primary text-primary-foreground rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
