# AGENT.md — AI Agent Guide for portofolio-fadhil

> This document provides comprehensive guidance for AI agents working on this project. Read it thoroughly before making any changes.

---

## 1. Project Overview

| Field       | Value                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**    | portofolio-fadhil                                                                                                                            |
| **Version** | 1.0.0                                                                                                                                       |
| **Type**    | Personal Portfolio Website                                                                                                                   |
| **Owner**   | Fadhil Alif Priyatno — Full-Stack Engineer                                                                                                   |
| **Desc**    | Website portfolio pribadi yang menampilkan profil, pengalaman kerja, edukasi, skill, proyek, sertifikat, dan halaman kontak                  |
| **Status**  | 🟢 Production Ready — semua halaman utama sudah terimplementasi                                                                              |
| **Domain**  | https://fadhildev.my.id                                                                                                                      |

---

## 2. Tech Stack

### Core
- **Next.js 16** (`^16.1.6`) with App Router and Turbopack
- **React 19** (`^19.2.4`)
- **TypeScript 5** (`^5.9.3`)

### Styling
- **Tailwind CSS v4** (`^4.1.18`) — CSS-first configuration, `@import "tailwindcss"`
- **tw-animate-css** (`^1.4.0`) — animation utilities
- **shadcn/ui** (`^4.0.2`) — style: `radix-lyra`, base color: `neutral`, CSS Variables with `oklch`
- **radix-ui** (`^1.4.3`) — accessible primitives
- **Custom dark variant** — `@variant dark (&:is(.dark *))` in `globals.css`

### Animation
- **Motion** (`^12.38.0`) — NOT framer-motion. All imports from `motion/react`

### State Management
- **Zustand** (`^5.0.11`) — lightweight state
- **TanStack Query** (`^5.90.21`) — server state caching
- **nuqs** (`^2.8.9`) — URL state management

### i18n
- **react-i18next** (`^17.0.2`)
- Languages: EN + ID, default EN
- Persistence: `localStorage` key `i18nextLng`

### Forms
- **react-hook-form** (`^7.71.2`)
- **@hookform/resolvers** (`^5.2.2`)
- **Zod** (`^4.3.6`) — schema validation

### AI / Backend
- **@google/genai** (`^1.46.0`) — primary Gemini SDK
- **@google/generative-ai** (`^0.24.1`) — legacy Gemini SDK
- **@supabase/supabase-js** (`^2.100.0`) — database client
- **@supabase/ssr** (`^0.9.0`) — SSR utilities
- **supabase** (`^2.83.0`) — CLI
- **resend** (`^6.9.3`) — email delivery

### Icons
- **Phosphor Icons** (`@phosphor-icons/react` `^2.1.10`)
- **Lucide React** (`^0.577.0`)
- **Tabler Icons** (`@tabler/icons-react` `^3.40.0`)

### Theming
- Custom dark mode via `useDarkMode` + `useThemeAnimation` hooks
- `next-themes` used only for `resolvedTheme` in `page.tsx`

### Analytics
- **@vercel/analytics** (`^2.0.1`)
- **@vercel/speed-insights** (`^2.0.0`)
- **@microsoft/clarity** (`^1.0.2`)

### Utilities
- `clsx` + `tailwind-merge` → `cn()` utility
- `cva` — class variance authority
- `react-markdown` — markdown rendering
- `shiki` (`^4.0.2`) — syntax highlighting
- `sonner` (`^2.0.7`) — toast notifications
- `react-dropzone` (`^15.0.0`) — file uploads
- `react-github-calendar` (`^5.0.5`) — GitHub contribution graph

### Code Quality
- **ESLint** with `eslint-config-next`
- **Prettier**: no semicolons, double quotes, trailing comma ES5, tabWidth 2, printWidth 80

---

## 3. Project Structure

```
portofolio-fadhil/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── template.tsx                  # Page transition wrapper
│   ├── page.tsx                      # Home page (About)
│   ├── loading.tsx                   # Global loading UI
│   ├── globals.css                   # Tailwind v4 + CSS variables + dark variant
│   ├── favicon.ico
│   ├── robots.ts                     # Dynamic robots.txt
│   ├── sitemap.ts                    # Dynamic sitemap
│   ├── api/
│   │   ├── chat/route.ts             # AI Chat API (Gemini + Supabase)
│   │   └── contact/route.ts          # Contact form API (Resend email)
│   ├── contact/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── projects/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── certificates/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── metrics/
│       ├── ClarityScrollDepthTracker.tsx
│       └── MicrosoftAnalytics.tsx
├── components/
│   ├── theme-provider.tsx
│   ├── i18n-provider.tsx
│   ├── chat/                         # AI Chat components
│   ├── email/                        # Email template components
│   ├── icons/                        # Icon wrapper components
│   ├── navigation/                   # Dock, nav items
│   ├── section/                      # 6 files:
│   │   ├── animated-section.tsx
│   │   ├── contact-form.tsx
│   │   ├── education-section.tsx
│   │   ├── footer.tsx
│   │   ├── photo-gallery.tsx
│   │   └── work-section.tsx
│   └── ui/                           # 22 files:
│       ├── accordion.tsx
│       ├── apple-cards-carousel.tsx
│       ├── auto-carousel.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── code-editor.tsx
│       ├── dock.tsx
│       ├── dropzone.tsx
│       ├── filter-search-toolbar.tsx
│       ├── hover-border-gradient.tsx
│       ├── images-badge.tsx
│       ├── loading-spinner.tsx
│       ├── magic-card.tsx
│       ├── project-card.tsx
│       ├── skill-category.tsx
│       ├── sonner.tsx
│       ├── spinner.tsx
│       ├── spotlight.tsx
│       ├── tech-icon.tsx
│       ├── theme-toggle.tsx
│       ├── tooltip.tsx
│       └── typing-animation.tsx
├── hooks/                            # 8 files:
│   ├── use-boolean.ts
│   ├── use-dark-mode.ts
│   ├── use-debounce-search.ts
│   ├── use-debounce.ts
│   ├── use-mobile.ts
│   ├── use-outside-click.ts
│   ├── use-read-local-storage.ts
│   └── use-theme-animation.ts
├── lib/                              # 11 files + dir:
│   ├── about-data.ts
│   ├── certificates-data.ts
│   ├── clarity.ts
│   ├── contact-schema.ts
│   ├── i18n/                         # i18n resources
│   ├── knowledge-base.ts
│   ├── projects-data.ts
│   ├── react-query.ts
│   ├── root-provider.tsx
│   ├── skill-icons.ts
│   └── utils.ts
├── types/
├── utils/
├── public/
├── packages/                         # Monorepo skeleton (empty)
├── package.json
├── tsconfig.json
├── next.config.ts
├── components.json
├── .prettierrc
├── .env.example
└── AGENT.md                          # This file
```

---

## 4. Architecture & Patterns

### Provider Tree

```
RootLayout
├── TanstackQueryProvider
│   └── I18nProvider
│       └── ThemeProvider
│           └── NuqsAdapter
│               ├── {children}
│               └── Toaster
├── FloatingDock (outside NuqsAdapter)
├── Analytics (Vercel)
├── MicrosoftAnalytics (Clarity)
└── SpeedInsights (Vercel)
```

### Page Transitions

Motion-based fade + blur transition in `template.tsx`:
- `opacity`: 0 → 1
- `y`: 30 → 0
- `filter: blur`: 4px → 0

### Navigation

Floating Dock with 7 items:
1. About (home)
2. Projects
3. Certificates
4. Contact
5. AI Chat
6. Language Toggle (flag icon)
7. Theme Toggle (sun/moon)

### Dark Mode Flow

- `useDarkMode` reads `localStorage` key `portfolio-theme`
- Default theme: `dark`
- Toggle uses View Transitions API with circular clip-path animation
- `useThemeAnimation` handles the transition timing
- CSS variant: `@variant dark (&:is(.dark *))`

### i18n Flow

- `I18nProvider` detects language from `localStorage` key `i18nextLng` or `navigator.language`
- Default: `en`
- Supported: `en`, `id`
- Toggle via dock flag icon
- Resources loaded from `lib/i18n/`

### AI Chat Architecture

```
Client (AiChatDialog)
  → POST /api/chat
    → Gemini API (fallback chain: gemini-3-flash → gemini-2.5-flash → gemini-1.5-flash)
    → Supabase chat_logs (persist conversation)
  → Rate limit: 3 questions/session (UUID-based)
  → System prompt from lib/knowledge-base.ts
```

### Contact Form Architecture

```
Client (ContactForm)
  → POST /api/contact
    → Resend email delivery
  → Rate limit: 3/hour per IP (in-memory Map)
  → Zod validation via contact-schema.ts
  → Honeypot field for spam protection
```

### Data Architecture

- Static data in `lib/*-data.ts` files
- Bilingual content (EN/ID keys)
- CDN via Cloudflare R2: `https://cdn.fadhildev.my.id/`
- Image format: AVIF preferred

---

## 5. Coding Conventions

- **TypeScript strict mode** enabled
- Use `interface` for props (not `type`)
- `"use client"` directive for interactive components
- `cn()` utility for className merging (from `lib/utils.ts`)
- Tailwind CSS always — no inline styles
- Semantic tokens for colors (e.g., `bg-background`, `text-foreground`)
- Mobile-first responsive design
- `dark:` variant for dark mode styling
- One component per file
- Hooks in `hooks/` directory with `use-` prefix
- **Prettier config**: no semicolons, double quotes, tabWidth 2, trailingComma es5, printWidth 80

---

## 6. Available Scripts

| Script        | Command                        | Description                     |
| ------------- | ------------------------------ | ------------------------------- |
| `dev`         | `next dev --turbopack`         | Start dev server with Turbopack |
| `build`       | `next build`                   | Production build                |
| `start`       | `next start`                   | Start production server         |
| `lint`        | `next lint`                    | Run ESLint                      |
| `format`      | `prettier --write .`           | Format code with Prettier       |
| `typecheck`   | `tsc --noEmit`                 | TypeScript type checking        |

---

## 7. Design System

### Colors
- `oklch` color space via CSS custom properties
- Base color: `neutral`
- Dark variant via `@variant dark`

### Fonts
- **Sans**: Geist (via `next/font/google`)
- **Mono**: JetBrains Mono (via `next/font/google`)
- **Signature**: Caveat (via `next/font/google`)

### Border Radius
- Base: `0.625rem`

### Animations
- View Transitions API (theme toggle)
- Motion (page transitions, scroll reveals)
- Pixel-fade effect (PixelImage component)
- SVG path animations
- Spotlight hover effect
- Scroll-triggered animations
- Typing animation
- Auto-carousel

---

## 8. Key Components Reference

| Component              | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| SpotlightBackground    | Mouse-following radial gradient spotlight effect                             |
| PixelImage             | Image with pixelated fade-in animation on load                               |
| Dock                   | macOS-style floating dock navigation bar                                     |
| AiChatDialog           | AI chat interface with streaming responses, rate limiting, session tracking  |
| ContactForm            | Form with Zod validation, honeypot spam protection, Resend integration       |
| WorkSection            | Timeline display of work experience with animated entries                    |
| EducationSection       | Education history with animated cards                                        |
| SkillCategory          | Skill group display with TechIcon badges                                     |
| ProjectCard            | Project showcase card with image, tags, links                                |
| AutoCarousel           | Auto-scrolling carousel for certificates                                     |
| FilterSearchToolbar    | Search + filter bar with nuqs URL state                                      |
| MagicCard              | Card with mouse-following gradient border effect                             |
| TypingAnimation        | Text typing effect animation                                                 |
| AnimatedSection        | Scroll-triggered reveal animation wrapper                                    |
| Footer                 | Site footer with links and copyright                                         |

---

## 9. External Dependencies & APIs

| Service              | Purpose                                    | URL                                    |
| -------------------- | ------------------------------------------ | -------------------------------------- |
| skillicons.dev       | Skill badge images                         | https://skillicons.dev                 |
| Google Fonts         | Geist, JetBrains Mono, Caveat fonts        | https://fonts.google.com               |
| Cloudflare R2        | CDN for images and assets                  | https://cdn.fadhildev.my.id/           |
| Google Gemini API    | AI Chat Assistant                          | https://ai.google.dev                  |
| Supabase             | Chat logs database                         | https://supabase.com                   |
| Resend               | Email delivery for contact form            | https://resend.com                     |
| Vercel Analytics     | Usage analytics                            | https://vercel.com/analytics           |
| Vercel Speed Insights| Performance monitoring                     | https://vercel.com/speed-insights      |
| Microsoft Clarity    | Session recording and heatmaps             | https://clarity.microsoft.com          |
| GitHub API           | Contribution calendar data                 | https://api.github.com                 |

---

## 10. Important File Paths

| File                          | Path                                          |
| ----------------------------- | --------------------------------------------- |
| Root layout                   | `app/layout.tsx`                              |
| Page transitions              | `app/template.tsx`                            |
| Global styles                 | `app/globals.css`                             |
| AI Chat API                   | `app/api/chat/route.ts`                       |
| Contact API                   | `app/api/contact/route.ts`                    |
| Provider tree                 | `lib/root-provider.tsx`                       |
| Utility functions             | `lib/utils.ts`                                |
| Knowledge base (AI prompt)    | `lib/knowledge-base.ts`                       |
| Contact validation schema     | `lib/contact-schema.ts`                       |
| About page data               | `lib/about-data.ts`                           |
| Projects data                 | `lib/projects-data.ts`                        |
| Certificates data             | `lib/certificates-data.ts`                    |
| Skill icons mapping           | `lib/skill-icons.ts`                          |
| Dark mode hook                | `hooks/use-dark-mode.ts`                      |
| Theme animation hook          | `hooks/use-theme-animation.ts`                |
| i18n provider                 | `components/i18n-provider.tsx`                |
| Theme provider                | `components/theme-provider.tsx`               |
| Floating Dock                 | `components/navigation/`                      |
| AI Chat dialog                | `components/chat/`                            |
| Contact form                  | `components/section/contact-form.tsx`         |
| shadcn/ui config              | `components.json`                             |
| Prettier config               | `.prettierrc`                                 |
| Environment example           | `.env.example`                                |

---

## 11. Known Issues & TODOs

### Theme System Conflict
- `next-themes` and custom dark mode (`useDarkMode`) coexist with overlapping responsibilities
- `next-themes` is only used for `resolvedTheme` in `page.tsx`
- Consider consolidating into a single theme system

### Monorepo Skeleton
- `packages/` directory exists but is empty
- No actual monorepo packages configured
- Either remove or populate with shared packages

### Store Example
- Zustand store example exists but may not be actively used
- Review and clean up unused state management code

### Image Tag Imports
- Some images use direct `<img>` tags instead of Next.js `<Image>` component
- Consider migrating to `<Image>` for optimization

### No Testing
- No test framework configured (no Jest, Vitest, Playwright)
- Consider adding unit and integration tests

### Legacy Google AI SDK
- Both `@google/genai` (new) and `@google/generative-ai` (legacy) are installed
- Plan migration to use only `@google/genai`

---

## 12. Adding New Features Quick Guide

### Add a New Page
1. Create directory under `app/` (e.g., `app/blog/`)
2. Add `layout.tsx` and `page.tsx`
3. Add navigation item to Floating Dock in `components/navigation/`
4. Add i18n translations in `lib/i18n/`

### Add a UI Component
1. Create file in `components/ui/your-component.tsx`
2. Use `"use client"` if interactive
3. Use `cn()` for className merging
4. Export as default

### Add a shadcn/ui Component
```bash
npx shadcn@latest add <component-name>
```

### Add a Hook
1. Create file in `hooks/use-your-hook.ts`
2. Prefix with `use-`
3. Follow existing hook patterns

### Add Data / Content
1. Create or update file in `lib/*-data.ts`
2. Use bilingual structure: `{ en: "...", id: "..." }`
3. Reference from components via imports

### Add an API Route
1. Create `app/api/your-route/route.ts`
2. Export async function `GET`, `POST`, etc.
3. Add rate limiting if needed
4. Add Zod validation for input

---

## 13. Tips for AI Agents

1. **Always add `"use client"`** for components with interactivity (hooks, events, state)
2. **No semicolons** — Prettier enforces this. Do not add them
3. **Use `cn()`** from `lib/utils.ts` for all className merging
4. **Import from `motion/react`** — NOT `framer-motion`
5. **CSS variables** — use semantic tokens like `bg-background`, `text-foreground`, `border-border`
6. **Path alias** — use `@/` for imports (e.g., `@/lib/utils`)
7. **Tailwind v4** — uses `@import "tailwindcss"` not `@tailwind` directives
8. **Dock navigation** — new pages need a Dock item in `components/navigation/`
9. **Static data** — keep content in `lib/*-data.ts` files, not hardcoded in components
10. **Monorepo packages** — `packages/` is empty skeleton, do not reference it
11. **i18n** — all user-facing text must support EN and ID via `useTranslation()`
12. **Images** — prefer AVIF format, use Cloudflare R2 CDN URLs
13. **API routes** — always add rate limiting and input validation
14. **Analytics** — do not remove Vercel Analytics, Speed Insights, or Clarity
15. **SEO** — update `robots.ts` and `sitemap.ts` when adding new pages
