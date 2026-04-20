export const CLARITY_EVENTS = {
  downloadCvClick: "portfolio_download_cv_click",
  contactButtonClick: "portfolio_contact_button_click",
  socialLinkClick: "portfolio_social_link_click",
  scrollDepth75: "portfolio_scroll_depth_75",
} as const

type ClarityCommand = "event" | "set"
type ClarityFunction = (command: ClarityCommand, ...args: string[]) => void

declare global {
  interface Window {
    clarity?: ClarityFunction
  }
}

function getClarity(): ClarityFunction | null {
  if (typeof window === "undefined") return null
  if (typeof window.clarity !== "function") return null
  return window.clarity
}

export function trackClarityEvent(eventName: string) {
  const clarity = getClarity()
  if (!clarity) return
  clarity("event", eventName)
}

export function setClarityTag(key: string, value: string) {
  const clarity = getClarity()
  if (!clarity) return
  clarity("set", key, value)
}
