"use client"

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock"
import { User, FolderGit2, Award, Mail, Bot, Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AiChatDialog } from "@/components/chat/ai-chat-dialog"
import { cn } from "@/lib/utils"
import { useThemeAnimation } from "@/hooks/use-theme-animation"
import { useIsMobile } from "@/hooks/use-mobile"

export function FloatingDock() {
  const { toggleTheme, theme } = useThemeAnimation()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-99 -translate-x-1/2 pb-[env(safe-area-inset-bottom)] md:bottom-8">
        <Dock
          className="gap-2 px-2.5 sm:gap-4 sm:px-4"
          distance={isMobile ? 90 : 150}
          magnification={isMobile ? 52 : 80}
          panelHeight={isMobile ? 52 : 64}
        >
          <DockItem
            active={pathname === "/"}
            onClick={() => handleNavigation("/")}
          >
            <DockLabel>About</DockLabel>
            <DockIcon>
              <User
                className={cn(
                  "size-full transition-colors",
                  pathname === "/"
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              />
            </DockIcon>
          </DockItem>

          <DockItem
            active={pathname === "/projects"}
            onClick={() => handleNavigation("/projects")}
          >
            <DockLabel>Projects</DockLabel>
            <DockIcon>
              <FolderGit2
                className={cn(
                  "size-full transition-colors",
                  pathname === "/projects"
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              />
            </DockIcon>
          </DockItem>

          <DockItem
            active={pathname === "/certificates"}
            onClick={() => handleNavigation("/certificates")}
          >
            <DockLabel>Certificate</DockLabel>
            <DockIcon>
              <Award
                className={cn(
                  "size-full transition-colors",
                  pathname === "/certificates"
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              />
            </DockIcon>
          </DockItem>

          <DockItem
            active={pathname === "/contact"}
            onClick={() => handleNavigation("/contact")}
          >
            <DockLabel>Contact</DockLabel>
            <DockIcon>
              <Mail
                className={cn(
                  "size-full transition-colors",
                  pathname === "/contact"
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              />
            </DockIcon>
          </DockItem>

          <div className="mx-1.5 h-full w-px bg-border sm:mx-2" />

          <DockItem
            active={isChatOpen}
            onClick={() => setIsChatOpen((prev) => !prev)}
          >
            <DockLabel>AI Chat</DockLabel>
            <DockIcon>
              <Bot
                className={cn(
                  "size-full transition-colors",
                  isChatOpen
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              />
            </DockIcon>
          </DockItem>

          <DockItem onClick={toggleTheme}>
            <DockLabel>Theme</DockLabel>
            <DockIcon>
              {mounted && theme === "dark" ? (
                <Sun className="size-full text-neutral-600 transition-colors dark:text-neutral-300" />
              ) : (
                <Moon className="size-full text-neutral-600 transition-colors dark:text-neutral-300" />
              )}
            </DockIcon>
          </DockItem>
        </Dock>
      </div>

      <AiChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
