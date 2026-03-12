"use client"

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock"
import {
  User,
  FolderGit2,
  Award,
  Mail,
  Bot,
  Sun,
  Moon
} from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AiChatDialog } from "@/components/chat/ai-chat-dialog"
import { cn } from "@/lib/utils"
import { useThemeAnimation } from "@/hooks/use-theme-animation"

export function FloatingDock() {
  const { toggleTheme, theme } = useThemeAnimation()
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
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-99 pb-[env(safe-area-inset-bottom)]">
        <Dock>
          <DockItem
            active={pathname === "/"}
            onClick={() => handleNavigation("/")}
          >
            <DockLabel>About</DockLabel>
            <DockIcon>
              <User className={cn("size-full transition-colors", pathname === "/" ? "text-primary" : "text-neutral-600 dark:text-neutral-300")} />
            </DockIcon>
          </DockItem>
          
          <DockItem
            active={pathname === "/projects"}
            onClick={() => handleNavigation("/projects")}
          >
            <DockLabel>Projects</DockLabel>
            <DockIcon>
              <FolderGit2 className={cn("size-full transition-colors", pathname === "/projects" ? "text-primary" : "text-neutral-600 dark:text-neutral-300")} />
            </DockIcon>
          </DockItem>
          
          <DockItem
            active={pathname === "/certificates"}
            onClick={() => handleNavigation("/certificates")}
          >
            <DockLabel>Certificate</DockLabel>
            <DockIcon>
              <Award className={cn("size-full transition-colors", pathname === "/certificates" ? "text-primary" : "text-neutral-600 dark:text-neutral-300")} />
            </DockIcon>
          </DockItem>
          
          <DockItem
            active={pathname === "/contact"}
            onClick={() => handleNavigation("/contact")}
          >
            <DockLabel>Contact</DockLabel>
            <DockIcon>
              <Mail className={cn("size-full transition-colors", pathname === "/contact" ? "text-primary" : "text-neutral-600 dark:text-neutral-300")} />
            </DockIcon>
          </DockItem>

          <div className="w-px h-full bg-border mx-2" />

          <DockItem active={isChatOpen} onClick={() => setIsChatOpen((prev) => !prev)}>
            <DockLabel>AI Chat</DockLabel>
            <DockIcon>
              <Bot className={cn("size-full transition-colors", isChatOpen ? "text-primary" : "text-neutral-600 dark:text-neutral-300")} />
            </DockIcon>
          </DockItem>

          <DockItem onClick={toggleTheme}>
            <DockLabel>Theme</DockLabel>
            <DockIcon>
              {mounted && theme === "dark" ? (
                <Sun className="size-full text-neutral-600 dark:text-neutral-300 transition-colors" />
              ) : (
                <Moon className="size-full text-neutral-600 dark:text-neutral-300 transition-colors" />
              )}
            </DockIcon>
          </DockItem>
        </Dock>
      </div>

      <AiChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
