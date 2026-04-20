"use client"

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock"
import { User, FolderGit2, Award, Mail, Bot, Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { AiChatDialog } from "@/components/chat/ai-chat-dialog"
import { cn } from "@/lib/utils"
import { useThemeAnimation } from "@/hooks/use-theme-animation"
import { useIsMobile } from "@/hooks/use-mobile"
import { TranslateIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"
import { getSupportedLanguage } from "@/lib/i18n/config"
import { CLARITY_EVENTS, setClarityTag, trackClarityEvent } from "@/lib/clarity"

export function FloatingDock() {
  const { t, i18n } = useTranslation()
  const { toggleTheme, theme } = useThemeAnimation()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const activeLanguage = getSupportedLanguage(i18n.resolvedLanguage)
  const isLanguageActive = mounted && activeLanguage === "id"
  const activeLanguageFlag =
    activeLanguage === "en"
      ? { label: "ENG", src: "/assets/ENG-flag.png" }
      : { label: "INA", src: "/assets/INA-flag.png" }

  // Avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const handleNavigation = (path: string) => {
    if (path === "/contact") {
      setClarityTag("contact_button_source", "dock")
      trackClarityEvent(CLARITY_EVENTS.contactButtonClick)
    }
    router.push(path)
  }

  const handleLanguageToggle = () => {
    const nextLanguage = activeLanguage === "en" ? "id" : "en"
    void i18n.changeLanguage(nextLanguage)
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
            <DockLabel>{t("dock.about")}</DockLabel>
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
            <DockLabel>{t("dock.projects")}</DockLabel>
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
            <DockLabel>{t("dock.certificates")}</DockLabel>
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
            <DockLabel>{t("dock.contact")}</DockLabel>
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
            <DockLabel>{t("dock.aiChat")}</DockLabel>
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

          <DockItem
            className="group"
            active={isLanguageActive}
            onClick={handleLanguageToggle}
          >
            <DockLabel>{t("dock.language")}</DockLabel>
            <DockIcon>
              <div className="relative flex size-full items-center justify-center">
                <TranslateIcon
                  className={cn(
                    "size-full transition-all duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:scale-70 group-hover:opacity-0",
                    isLanguageActive
                      ? "text-primary"
                      : "text-neutral-600 dark:text-neutral-300"
                  )}
                />
                <div className="absolute inset-0 flex scale-75 items-center justify-center opacity-0 transition-all duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:opacity-100">
                  <span className="relative block size-full overflow-hidden rounded-full">
                    <Image
                      alt={`${activeLanguageFlag.label} flag`}
                      className="object-cover"
                      fill
                      sizes="40px"
                      src={activeLanguageFlag.src}
                    />
                  </span>
                </div>
              </div>
            </DockIcon>
          </DockItem>

          <DockItem onClick={toggleTheme}>
            <DockLabel>{t("dock.theme")}</DockLabel>
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
