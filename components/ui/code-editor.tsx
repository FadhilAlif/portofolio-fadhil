"use client"

import { Check, Copy } from "lucide-react"
import { type UseInViewOptions, useInView } from "motion/react"
import { useThemeContext } from "@/components/theme-provider"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Copy Button ──────────────────────────────────────────────────────────────

interface CopyButtonProps {
  content: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "ghost" | "outline"
  className?: string
  onCopy?: (content: string) => void
}

function CopyButton({
  content,
  size = "default",
  variant = "default",
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      onCopy?.(content)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Button
      className={cn("h-8 w-8 p-0", className)}
      onClick={handleCopy}
      size={size}
      variant={variant}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

// ─── Code Editor ──────────────────────────────────────────────────────────────

type CodeEditorProps = Omit<React.ComponentProps<"div">, "onCopy"> & {
  children: string
  lang: string
  themes?: {
    light: string
    dark: string
  }
  duration?: number
  delay?: number
  header?: boolean
  dots?: boolean
  icon?: React.ReactNode
  cursor?: boolean
  inView?: boolean
  inViewMargin?: UseInViewOptions["margin"]
  inViewOnce?: boolean
  copyButton?: boolean
  writing?: boolean
  title?: string
  onDone?: () => void
  onCopy?: (content: string) => void
}

function CodeEditor({
  children: code,
  lang,
  themes = {
    light: "github-light",
    dark: "github-dark",
  },
  duration = 5,
  delay = 0,
  className,
  header = true,
  dots = true,
  icon,
  cursor = false,
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  copyButton = false,
  writing = true,
  title,
  onDone,
  onCopy,
  ...props
}: CodeEditorProps) {
  const { isDarkMode } = useThemeContext()
  const resolvedTheme = isDarkMode ? "dark" : "light"

  const editorRef = React.useRef<HTMLDivElement>(null)
  const [visibleCode, setVisibleCode] = React.useState("")
  const [highlightedCode, setHighlightedCode] = React.useState("")
  const [isDone, setIsDone] = React.useState(false)

  const inViewResult = useInView(editorRef, {
    once: inViewOnce,
    margin: inViewMargin,
  })
  const isInView = !inView || inViewResult

  // ── Syntax highlighting (debounced to prevent race conditions) ──────────

  const highlightRequestRef = React.useRef(0)

  React.useEffect(() => {
    if (!(visibleCode.length && isInView)) {
      return
    }

    const requestId = ++highlightRequestRef.current

    const debounceTimer = setTimeout(async () => {
      try {
        const { codeToHtml } = await import("shiki")

        const highlighted = await codeToHtml(visibleCode, {
          lang,
          themes: {
            light: themes.light,
            dark: themes.dark,
          },
          defaultColor: resolvedTheme === "dark" ? "dark" : "light",
        })

        // Only apply if this is still the latest request
        if (requestId === highlightRequestRef.current) {
          setHighlightedCode(highlighted)
        }
      } catch (e) {
        console.error(`Language "${lang}" could not be loaded.`, e)
      }
    }, 150)

    return () => clearTimeout(debounceTimer)
  }, [lang, themes, isInView, visibleCode, resolvedTheme])

  // ── Typing animation ─────────────────────────────────────────────────────

  const indexRef = React.useRef(0)

  React.useEffect(() => {
    if (!writing) {
      setVisibleCode(code)
      setIsDone(true)
      onDone?.()
      return
    }

    if (!(code.length && isInView)) {
      return
    }

    // Reset index on re-mount
    indexRef.current = 0
    setVisibleCode("")

    const totalDuration = duration * 1000
    const totalChars = code.length
    const charInterval = totalDuration / totalChars
    let intervalId: NodeJS.Timeout

    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        indexRef.current += 1

        if (indexRef.current <= totalChars) {
          // Use slice for idempotent state — safe with React StrictMode
          setVisibleCode(code.slice(0, indexRef.current))
          editorRef.current?.scrollTo({
            top: editorRef.current?.scrollHeight,
            behavior: "smooth",
          })
        } else {
          clearInterval(intervalId)
          setIsDone(true)
          onDone?.()
        }
      }, charInterval)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, duration, delay, isInView, writing])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-muted/50",
        className
      )}
      data-slot="code-editor"
      {...(props as React.ComponentProps<"div">)}
    >
      {/* Header bar */}
      {header ? (
        <div className="relative flex h-10 flex-row items-center justify-between gap-y-2 border-b border-border/75 bg-muted px-4 dark:border-border/50">
          {dots && (
            <div className="flex flex-row gap-x-2">
              <div className="size-2 rounded-full bg-red-500" />
              <div className="size-2 rounded-full bg-yellow-500" />
              <div className="size-2 rounded-full bg-green-500" />
            </div>
          )}

          {title && (
            <div
              className={cn(
                "flex flex-row items-center gap-2",
                dots &&
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              )}
            >
              {icon ? (
                typeof icon === "string" ? (
                  <div
                    className="text-muted-foreground [&_svg]:size-3.5"
                    dangerouslySetInnerHTML={{ __html: icon }}
                  />
                ) : (
                  <div className="text-muted-foreground [&_svg]:size-3.5">
                    {icon}
                  </div>
                )
              ) : null}
              <figcaption className="flex-1 truncate text-[13px] text-muted-foreground">
                {title}
              </figcaption>
            </div>
          )}

          {copyButton ? (
            <CopyButton
              className="-me-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
              content={code}
              onCopy={onCopy}
              size="sm"
              variant="ghost"
            />
          ) : null}
        </div>
      ) : (
        copyButton && (
          <CopyButton
            className="absolute top-2 right-2 z-2 bg-transparent backdrop-blur-md hover:bg-black/5 dark:hover:bg-white/10"
            content={code}
            onCopy={onCopy}
            size="sm"
            variant="ghost"
          />
        )
      )}

      {/* Code content */}
      <div
        className="relative w-full flex-1 overflow-auto p-4 font-mono text-sm"
        ref={editorRef}
      >
        <div
          className={cn(
            "[&>pre,&_code]:bg-transparent! [&>pre,&_code]:[background:transparent_!important] [&>pre,&_code]:border-none [&_code]:text-[13px]!",
            cursor &&
              !isDone &&
              "[&_.line:last-of-type::after]:content-['|'] [&_.line:last-of-type::after]:animate-pulse [&_.line:last-of-type::after]:inline-block [&_.line:last-of-type::after]:w-[1ch] [&_.line:last-of-type::after]:-translate-px"
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  )
}

export { CodeEditor, CopyButton, type CodeEditorProps, type CopyButtonProps }
