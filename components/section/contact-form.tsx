"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { contactSchema, type ContactFormValues } from "@/lib/contact-schema"
import { Button } from "../ui/button"

// ─── Input Field Component ────────────────────────────────────────────────────

function ContactInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  isFocused,
  onFocus,
  onBlur,
  inputProps,
}: {
  id: string
  label: string
  type?: string
  placeholder: string
  error?: string
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}) {
  const hasError = !!error

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-medium tracking-wider text-muted-foreground uppercase"
        >
          {label}
        </label>
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.span
              key="error"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              className="flex items-center gap-1 text-xs text-destructive"
            >
              <AlertCircle className="h-3 w-3" />
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-lg border transition-all duration-300",
          hasError
            ? "border-destructive/60 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
            : isFocused
              ? "border-primary/60 shadow-[0_0_0_3px_rgba(120,119,198,0.12)]"
              : "border-border/60 hover:border-border"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-px bg-linear-to-r transition-opacity duration-300",
            hasError
              ? "from-transparent via-destructive/50 to-transparent opacity-100"
              : isFocused
                ? "from-transparent via-primary/50 to-transparent opacity-100"
                : "from-transparent via-primary/50 to-transparent opacity-0"
          )}
        />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full bg-card/50 px-4 py-3 text-sm text-foreground backdrop-blur-sm outline-none placeholder:text-muted-foreground/50"
          {...inputProps}
        />
      </div>
    </div>
  )
}

// ─── Textarea Field Component ─────────────────────────────────────────────────

function ContactTextarea({
  id,
  label,
  placeholder,
  error,
  isFocused,
  onFocus,
  onBlur,
  textareaProps,
  charCount,
  maxChars,
}: {
  id: string
  label: string
  placeholder: string
  error?: string
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  charCount: number
  maxChars: number
}) {
  const hasError = !!error
  const isNearLimit = charCount > maxChars * 0.85

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-medium tracking-wider text-muted-foreground uppercase"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {hasError && (
              <motion.span
                key="error"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                className="flex items-center gap-1 text-xs text-destructive"
              >
                <AlertCircle className="h-3 w-3" />
                {error}
              </motion.span>
            )}
          </AnimatePresence>
          <span
            className={cn(
              "text-xs tabular-nums transition-colors",
              isNearLimit ? "text-amber-500" : "text-muted-foreground/50"
            )}
          >
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-lg border transition-all duration-300",
          hasError
            ? "border-destructive/60 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
            : isFocused
              ? "border-primary/60 shadow-[0_0_0_3px_rgba(120,119,198,0.12)]"
              : "border-border/60 hover:border-border"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-px bg-linear-to-r transition-opacity duration-300",
            hasError
              ? "from-transparent via-destructive/50 to-transparent opacity-100"
              : isFocused
                ? "from-transparent via-primary/50 to-transparent opacity-100"
                : "from-transparent via-primary/50 to-transparent opacity-0"
          )}
        />
        <textarea
          id={id}
          placeholder={placeholder}
          rows={5}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full resize-none bg-card/50 px-4 py-3 text-sm text-foreground backdrop-blur-sm outline-none placeholder:text-muted-foreground/50"
          {...textareaProps}
        />
      </div>
    </div>
  )
}

// ─── Grid Background ─────────────────────────────────────────────────────────

function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "contact-grid-bg absolute inset-0 opacity-[0.03] dark:opacity-[0.06]",
        className
      )}
    />
  )
}

// ─── Contact Form Component ──────────────────────────────────────────────────

interface ContactFormProps {
  className?: string
}

type FocusedField = "name" | "email" | "message" | null

export function ContactForm({ className }: ContactFormProps) {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [focusedField, setFocusedField] = useState<FocusedField>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", _honey: "" },
  })

  const messageValue = watch("message") ?? ""

  const onSubmit = async (data: ContactFormValues) => {
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = (await response.json()) as {
        success?: boolean
        error?: string
        retryAfter?: number
      }

      if (!response.ok) {
        if (response.status === 429) {
          const mins = result.retryAfter
            ? Math.ceil(result.retryAfter / 60)
            : 60
          setErrorMessage(
            `Too many messages sent. Please wait ${mins} minute(s) before trying again.`
          )
        } else {
          setErrorMessage(
            result.error ?? "Something went wrong. Please try again."
          )
        }
        setSubmitStatus("error")
        return
      }

      setSubmitStatus("success")
      reset()
      // Reset to idle after 6s
      setTimeout(() => setSubmitStatus("idle"), 6000)
    } catch {
      setErrorMessage("Network error. Please check your connection.")
      setSubmitStatus("error")
    }
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-card/80 to-card/40 shadow-xl shadow-black/5 backdrop-blur-sm",
        className
      )}
    >
      {/* Corner grid decorations */}
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 overflow-hidden">
        <GridBackground />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 overflow-hidden">
        <GridBackground />
      </div>

      {/* Top shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative z-10 p-7 sm:p-8">
        <AnimatePresence mode="wait">
          {/* ── Success State ───────────────────────────────────────── */}
          {submitStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="flex min-h-[340px] flex-col items-center justify-center gap-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/25"
              >
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </motion.div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Message sent!
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Thank you for reaching out. I&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>
            </motion.div>
          ) : (
            /* ── Form State ─────────────────────────────────────────── */
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              noValidate
            >
              {/* ── HONEYPOT (visually hidden, traps bots) ── */}
              <div
                aria-hidden="true"
                className="absolute -top-[9999px] left-0 h-0 w-0 overflow-hidden opacity-0"
                tabIndex={-1}
              >
                <label htmlFor="contact-website">Leave this empty</label>
                <input
                  id="contact-website"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                  {...register("_honey")}
                />
              </div>

              {/* ── Name ─────────────────────────────────────────────── */}
              <ContactInput
                id="contact-name"
                label="Name"
                placeholder="Your name"
                error={errors.name?.message}
                isFocused={focusedField === "name"}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                inputProps={{ ...register("name") }}
              />

              {/* ── Email ─────────────────────────────────────────────── */}
              <ContactInput
                id="contact-email"
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                isFocused={focusedField === "email"}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                inputProps={{ ...register("email") }}
              />

              {/* ── Message ───────────────────────────────────────────── */}
              <ContactTextarea
                id="contact-message"
                label="Message"
                placeholder="Type your message here..."
                error={errors.message?.message}
                isFocused={focusedField === "message"}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                textareaProps={{ ...register("message") }}
                charCount={messageValue.length}
                maxChars={5000}
              />

              {/* ── API Error banner ─────────────────────────────────── */}
              <AnimatePresence>
                {submitStatus === "error" && errorMessage && (
                  <motion.div
                    key="api-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Submit button ──────────────────────────────────── */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className={cn(
                  "group relative mt-1 flex items-center justify-center gap-2 overflow-hidden rounded-lg px-6 py-5 text-sm font-medium transition-all duration-300",
                  "bg-foreground text-background",
                  "hover:cursor-pointer hover:bg-foreground/90 active:scale-[0.98]",
                  "disabled:cursor-not-allowed disabled:opacity-70"
                )}
              >
                {/* Shine sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    Send Message
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
