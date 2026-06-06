# PRD.md — Product Requirements Document

> **Single source of truth for AI agents working on this project.**
> This document replaces `AGENT.md`. It contains end-to-end product knowledge, technical architecture, coding conventions, known issues, and the improvement roadmap.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Product Goals & Success Metrics](#2-product-goals--success-metrics)
3. [Target Audience](#3-target-audience)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Architecture & Patterns](#6-architecture--patterns)
7. [Design System](#7-design-system)
8. [Key Components Reference](#8-key-components-reference)
9. [Data Architecture](#9-data-architecture)
10. [API Routes](#10-api-routes)
11. [External Dependencies & APIs](#11-external-dependencies--apis)
12. [Coding Conventions](#12-coding-conventions)
13. [Available Scripts](#13-available-scripts)
14. [Deployment](#14-deployment)
15. [Known Issues & Technical Debt](#15-known-issues--technical-debt)
16. [Improvement Roadmap](#16-improvement-roadmap)
17. [Feature Specifications](#17-feature-specifications)
18. [Decision Log](#18-decision-log)
19. [Non-Functional Requirements](#19-non-functional-requirements)
20. [Adding New Features — Quick Guide](#20-adding-new-features--quick-guide)
21. [Tips for AI Agents](#21-tips-for-ai-agents)

---

## 1. Product Overview

| Field       | Value                                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| **Name**    | portofolio-fadhil                                                                    |
| **Version** | 1.0.0                                                                                |
| **Type**    | Personal Portfolio Website                                                           |
| **Owner**   | Fadhil Alif Priyatno — Full-Stack Engineer                                           |
| **Desc**    | Personal portfolio showcasing profile, work experience, education, skills, projects, certificates, and contact |
| **Status**  | 🟢 Production — all core pages implemented, improvement roadmap in progress          |
| **Domain**  | https://fadhildev.my.id                                                              |
| **Repo**    | https://github.com/fadhilalifpriyatno/portofolio-fadhil                              |

### Core Features

- **Bilingual Support** — English and Indonesian with localStorage persistence
- **AI Chat Assistant** — Powered by Google Gemini with fallback chain and Supabase chat log persistence
- **Contact Form** — Email delivery via Resend with Zod validation and honeypot spam protection
- **Analytics & Monitoring** — Vercel Analytics, Vercel Speed Insights, and Microsoft Clarity
- **Responsive Design** — Mobile-first with Tailwind CSS v4
- **Dark/Light Mode** — View Transitions API with circular clip-path animation
- **SEO Optimized** — Dynamic sitemap, robots.txt, and JSON-LD structured data
- **Cloudflare R2 CDN** — Assets served via `https://cdn.fadhildev.my.id/`

---

## 2. Product Goals & Success Metrics

### Goals

This portfolio serves **three audiences simultaneously**:

1. **Recruiters / Hiring Managers** — Must impress at first glance; showcase professionalism, polish, and breadth of skills
2. **Fellow Developers** — Must demonstrate technical depth; clean architecture, modern stack, best practices
3. **Personal Growth** — Serves as a learning playground for cutting-edge web technologies

### Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Lighthouse Performance | > 90 | Lighthouse CI |
| Lighthouse Accessibility | > 95 | Lighthouse CI |
| Lighthouse SEO | 100 | Lighthouse CI |
| First Contentful Paint | < 1.5s | Vercel Speed Insights |
| Cumulative Layout Shift | < 0.1 | Vercel Speed Insights |
| Pages indexed by Google | All pages | Google Search Console |
| Bounce rate | < 50% | Vercel Analytics |
| AI Chat engagement | > 20% of visitors | Supabase query |

---

## 3. Target Audience

### Primary: Tech Recruiters & Hiring Managers

- Visit from LinkedIn/job applications
- Spend < 30 seconds deciding if the candidate is worth interviewing
- Look for: clean design, real projects, clear communication, professional polish
- Need: fast load, mobile-friendly, easy navigation, downloadable CV

### Secondary: Fellow Developers

- Discover via GitHub, tech communities, or blog posts (planned)
- Look for: code quality, modern stack, interesting technical decisions
- Need: source code access, technical blog content, case studies

### Tertiary: Self (Learning & Experimentation)

- Testing new technologies, frameworks, and patterns
- Iterating on design and UX
- Building a public track record of growth

---

## 4. Tech Stack

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

- **Zustand** (`^5.0.11`) — lightweight state (⚠️ currently unused — see Known Issues)
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
- **@supabase/supabase-js** (`^2.100.0`) — database client
- **resend** (`^6.9.3`) — email delivery

### Icons

- **Phosphor Icons** (`@phosphor-icons/react` `^2.1.10`) — primary icon library
- **Lucide React** (`^0.577.0`) — used by shadcn/ui components

### Theming

- Custom dark mode via `useDarkMode` + `useThemeAnimation` hooks
- View Transitions API with circular clip-path animation
- `next-themes` coexists but should be removed (see Known Issues §15)

### Analytics

- **@vercel/analytics** (`^2.0.1`)
- **@vercel/speed-insights** (`^2.0.0`)
- **@microsoft/clarity** (`^1.0.2`)

### Utilities

- `clsx` + `tailwind-merge` → `cn()` utility
- `cva` — class variance authority
- `react-markdown` — markdown rendering
- `sonner` (`^2.0.7`) — toast notifications
- `react-github-calendar` (`^5.0.5`) — GitHub contribution graph

### Code Quality

- **ESLint** with `eslint-config-next`
- **Prettier**: no semicolons, double quotes, trailing comma ES5, tabWidth 2, printWidth 80

---

## 5. Project Structure

```
portofolio-fadhil/
├── app/
│   ├── layout.tsx                    # Root layout with providers, metadata, JSON-LD
│   ├── template.tsx                  # Page transition wrapper (Motion)
│   ├── page.tsx                      # Home page (About) — ⚠️ 607 lines, needs splitting
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
│   ├── section/                      # Page sections:
│   │   ├── animated-section.tsx
│   │   ├── contact-form.tsx
│   │   ├── education-section.tsx
│   │   ├── footer.tsx
│   │   ├── photo-gallery.tsx
│   │   └── work-section.tsx
│   └── ui/                           # Reusable UI components (22 files)
├── hooks/                            # Custom React hooks (8 files)
├── lib/                              # Utilities, data, providers, i18n
│   ├── about-data.ts                 # 23KB — About page content (EN/ID)
│   ├── certificates-data.ts          # 16KB — Certificates content
│   ├── projects-data.ts              # 18KB — Projects content
│   ├── knowledge-base.ts             # AI system prompt
│   ├── contact-schema.ts             # Zod validation schema
│   ├── skill-icons.ts                # Skill icon mappings
│   ├── clarity.ts                    # Microsoft Clarity helpers
│   ├── react-query.tsx               # TanStack Query provider
│   ├── root-provider.tsx             # Provider composition
│   ├── i18n/                         # i18n translation resources
│   └── utils.ts                      # cn() utility
├── types/                            # TypeScript type definitions
├── utils/                            # Helper utilities
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── components.json                   # shadcn/ui config
├── .prettierrc
├── .env.example
└── PRD.md                            # This file
```

---

## 6. Architecture & Patterns

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
- `y`: 20 → 0
- `filter: blur`: 4px → 0
- ⚠️ `exit` animation is defined but non-functional (no `AnimatePresence` in layout)

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

```
useDarkMode (hooks/use-dark-mode.ts)
  → reads localStorage key "usehooks-ts-dark-mode"
  → default theme: dark
  → toggle triggers useThemeAnimation
    → View Transitions API with circular clip-path animation
    → CSS variant: @variant dark (&:is(.dark *))
```

### i18n Flow

```
I18nProvider (components/i18n-provider.tsx)
  → detects language from localStorage key "i18nextLng" or navigator.language
  → default: "en"
  → supported: "en", "id"
  → toggle via dock flag icon
  → resources loaded from lib/i18n/
```

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
  → Rate limit: 3/hour per IP (⚠️ in-memory Map — resets on cold start)
  → Zod validation via contact-schema.ts
  → Honeypot field for spam protection
```

### Data Architecture

- Static data in `lib/*-data.ts` files
- Bilingual content (EN/ID keys)
- CDN via Cloudflare R2: `https://cdn.fadhildev.my.id/`
- Image format: AVIF preferred
- ⚠️ All data files (~57KB total) currently shipped to client bundle

---

## 7. Design System

### Colors

- `oklch` color space via CSS custom properties
- Base color: `neutral`
- Dark variant via `@variant dark`

### Fonts

| Font | Usage | Source |
|------|-------|--------|
| **Geist** | Sans-serif (headings, UI) | `next/font/google` |
| **JetBrains Mono** | Monospace (code, ⚠️ currently body default) | `next/font/google` |
| **Caveat** | Signature / handwriting | `next/font/google` |

### Border Radius

- Base: `0.625rem`

### Animations

| Animation | Implementation |
|-----------|---------------|
| Theme toggle | View Transitions API with circular clip-path |
| Page transitions | Motion (fade + blur + slide) |
| Pixel-fade images | Custom PixelImage component |
| SVG path drawing | SVG path animations |
| Spotlight hover | Mouse-following radial gradient |
| Scroll reveal | Motion scroll-triggered animations |
| Typing effect | TypingAnimation component |
| Auto-carousel | AutoCarousel component |

---

## 8. Key Components Reference

| Component | File | Description |
| --------- | ---- | ----------- |
| SpotlightBackground | `components/ui/spotlight.tsx` | Mouse-following radial gradient spotlight effect |
| Dock | `components/ui/dock.tsx` | macOS-style floating dock |
| FloatingDock | `components/navigation/floating-dock.tsx` | Dock with nav items, theme toggle, language toggle |
| AiChatDialog | `components/chat/ai-chat-dialog.tsx` | AI chat interface with streaming, rate limiting, session tracking |
| ContactForm | `components/section/contact-form.tsx` | Form with Zod validation, honeypot, Resend integration |
| WorkSection | `components/section/work-section.tsx` | Timeline display of work experience |
| EducationSection | `components/section/education-section.tsx` | Education history with animated cards |
| SkillCategory | `components/ui/skill-category.tsx` | Skill group display with TechIcon badges |
| ProjectCard | `components/ui/project-card.tsx` | Project showcase card with image, tags, links |
| AutoCarousel | `components/ui/auto-carousel.tsx` | Auto-scrolling carousel |
| FilterSearchToolbar | `components/ui/filter-search-toolbar.tsx` | Search + filter bar with nuqs URL state |
| MagicCard | `components/ui/magic-card.tsx` | Card with mouse-following gradient border |
| TypingAnimation | `components/ui/typing-animation.tsx` | Text typing effect animation |
| AnimatedSection | `components/section/animated-section.tsx` | Scroll-triggered reveal wrapper |
| Footer | `components/section/footer.tsx` | Site footer |

---

## 9. Data Architecture

### Static Data Files

| File | Size | Content | Bilingual |
|------|------|---------|-----------|
| `lib/about-data.ts` | 23KB | Profile, experience, education, skills, gallery | ✅ EN/ID |
| `lib/projects-data.ts` | 18KB | Project cards with descriptions, tags, links | ✅ EN/ID |
| `lib/certificates-data.ts` | 16KB | Certificate cards with issuers, dates, images | ⚠️ EN only (language param ignored) |
| `lib/knowledge-base.ts` | 8KB | AI chat system prompt | ❌ EN only |
| `lib/skill-icons.ts` | 5KB | Skill name → icon URL mapping | N/A |

### Database (Supabase)

| Table | Purpose | Columns |
|-------|---------|---------|
| `chat_logs` | AI conversation persistence | session_id, role, content, created_at |

### CDN (Cloudflare R2)

- Base URL: `https://cdn.fadhildev.my.id/`
- Used for: profile photos, project screenshots, certificate images, CV PDF
- Format preference: AVIF

---

## 10. API Routes

### POST `/api/chat`

| Aspect | Detail |
|--------|--------|
| Purpose | AI chat with Gemini |
| Auth | None (session-based rate limiting) |
| Rate Limit | 3 messages per session UUID |
| Input | `{ message: string, sessionId: string, history: ChatMessage[], language: "en" \| "id" }` |
| Output | `{ reply: string, remaining: number }` |
| Fallback | gemini-3-flash → gemini-2.5-flash → gemini-1.5-flash |
| Persistence | Logs to Supabase `chat_logs` (graceful failure) |

**⚠️ Known Issues**:
- No input length limit on `message`
- `history` array from client is trusted without validation
- `process.env.GEMINI_API_KEY!` uses non-null assertion

### POST `/api/contact`

| Aspect | Detail |
|--------|--------|
| Purpose | Send contact email via Resend |
| Auth | None (IP-based rate limiting) |
| Rate Limit | 3 per hour per IP |
| Input | Zod-validated: `{ name, email, subject, message, website (honeypot) }` |
| Output | `{ success: boolean, message: string }` |
| Anti-spam | Honeypot field, rate limiting, input validation |

**⚠️ Known Issues**:
- In-memory rate limiter resets on cold start / deployment
- Rate limit Map never cleans up expired entries (memory leak)
- No CSRF protection

---

## 11. External Dependencies & APIs

| Service | Purpose | URL |
| ------- | ------- | --- |
| skillicons.dev | Skill badge images | https://skillicons.dev |
| Google Fonts | Geist, JetBrains Mono, Caveat | https://fonts.google.com |
| Cloudflare R2 | CDN for images and assets | https://cdn.fadhildev.my.id/ |
| Google Gemini API | AI Chat Assistant | https://ai.google.dev |
| Supabase | Chat logs database | https://supabase.com |
| Resend | Email delivery for contact form | https://resend.com |
| Vercel Analytics | Usage analytics | https://vercel.com/analytics |
| Vercel Speed Insights | Performance monitoring | https://vercel.com/speed-insights |
| Microsoft Clarity | Session recording and heatmaps | https://clarity.microsoft.com |
| GitHub API | Contribution calendar data | https://api.github.com |

---

## 12. Coding Conventions

### Mandatory Rules

1. **TypeScript strict mode** enabled
2. **`interface`** for component props (not `type`)
3. **`"use client"`** directive for interactive components (hooks, events, state)
4. **`cn()`** utility from `lib/utils.ts` for all className merging
5. **Tailwind CSS only** — no inline styles
6. **Semantic tokens** for colors (e.g., `bg-background`, `text-foreground`)
7. **Mobile-first** responsive design
8. **`dark:` variant** for dark mode styling
9. **One component per file**
10. **Hooks** in `hooks/` directory with `use-` prefix

### Formatting (Prettier)

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

- **No semicolons** — Prettier enforces this
- **Double quotes** — not single quotes
- **Trailing commas** in ES5-valid positions

### Import Conventions

- **Path alias**: `@/` for imports (e.g., `@/lib/utils`)
- **Motion**: import from `motion/react` — NOT `framer-motion`
- **Tailwind v4**: uses `@import "tailwindcss"` — NOT `@tailwind` directives

### File Naming

- Components: `PascalCase.tsx` or `kebab-case.tsx` (project uses kebab-case)
- Hooks: `use-kebab-case.ts`
- Data files: `kebab-case-data.ts`
- API routes: `route.ts` in directory matching the endpoint

---

## 13. Available Scripts

| Script | Command | Description |
| ------ | ------- | ----------- |
| `dev` | `next dev --turbopack` | Start dev server with Turbopack |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |
| `format` | `prettier --write .` | Format code with Prettier |
| `typecheck` | `tsc --noEmit` | TypeScript type checking |

---

## 14. Deployment

| Aspect | Detail |
|--------|--------|
| **Platform** | Vercel |
| **Build** | `next build` |
| **Runtime** | Node.js (serverless functions for API routes) |
| **Environment** | All env vars configured in Vercel project settings |
| **Domain** | `fadhildev.my.id` (custom domain) |
| **CDN** | Cloudflare R2 for static assets |

### Environment Variables

| Variable | Description | Required |
| -------- | ----------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `RESEND_API_KEY` | Resend email API key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `CONTACT_EMAIL_TO` | Recipient email for contact form | Yes |

---

## 15. Known Issues & Technical Debt

### 🔴 Critical

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| 1 | **No SEO metadata on sub-pages** — all pages use `"use client"` which blocks `export const metadata` | All sub-pages invisible to search engines beyond root metadata | All `page.tsx` files |
| 2 | **Monolithic 607-line home page** — single `"use client"` component with no code splitting | Poor performance, no SSR, 57KB data in client bundle | `app/page.tsx` |
| 3 | **~2MB unused dependencies** — `@google/generative-ai`, `shiki`, `zustand`, `@supabase/ssr`, `axios`, `react-dropzone` never imported | Inflated install/bundle size | `package.json` |

### 🟡 Medium

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| 4 | **Dual theme system** — `next-themes` AND custom `useDarkMode` coexist | Confusing, redundant | `hooks/use-dark-mode.ts`, `components/theme-provider.tsx` |
| 5 | **In-memory rate limiter** — resets on deployment/cold start, never cleans up expired entries | Rate limiting ineffective on Vercel serverless | `app/api/contact/route.ts` |
| 6 | **Hardcoded values** — email, domain, GitHub username, CV URL, WhatsApp number scattered across 10+ files | Maintenance burden, inconsistency | Multiple files |
| 7 | **No security headers** — missing CSP, X-Frame-Options, etc. | Security vulnerability | `next.config.mjs` |
| 8 | **Chat input not validated** — no length limit, client history trusted blindly | Potential abuse | `app/api/chat/route.ts` |
| 9 | **Wildcard image remote patterns** — `**.r2.dev` allows any R2 bucket | Security risk | `next.config.mjs` |
| 10 | **`alternates.languages`** reference `/en` and `/id` routes that don't exist | Invalid HTML link tags, SEO confusion | `app/layout.tsx` |

### 🟢 Low

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| 11 | **Dead code** — commented-out sections, unused components, unused exports | Code clutter | Multiple files (see §16 Sprint 1) |
| 12 | **Unused CSS variables** — sidebar + chart variables from shadcn scaffold | CSS bloat | `app/globals.css` |
| 13 | **`exit` animation non-functional** — no `AnimatePresence` in layout | Dead prop | `app/template.tsx` |
| 14 | **Monospace font as body default** (`html { @apply font-mono }`) | Readability concern | `app/globals.css` |
| 15 | **`getCertificates(_language)` ignores language param** | Certificates never translated | `lib/certificates-data.ts` |
| 16 | **Data integrity** — trailing spaces in IDs, duplicate credential IDs, typo in image filename | Minor bugs | `lib/certificates-data.ts`, `app/layout.tsx` |
| 17 | **Three icon libraries** — `@tabler/icons-react` only used in dead code | Unnecessary dependency | `package.json` |
| 18 | **`setTimeout` hydration workaround** — unusual pattern | Non-idiomatic React | `components/navigation/floating-dock.tsx` |

---

## 16. Improvement Roadmap

### Sprint 1 — Quick Wins (Day 1-2)

> Low-effort, high-impact cleanup.

| Task | Description | Status |
|------|-------------|--------|
| Remove unused deps | Uninstall `@google/generative-ai`, `shiki`, `zustand`, `@supabase/ssr`, `axios`, `react-dropzone`, `@tabler/icons-react`. Move `supabase` CLI to devDeps | ✅ Done |
| Delete dead code | Remove commented-out CodeEditor, availability badge, Stargram project. Delete `handleAxiosError.ts`, `apple-cards-carousel.tsx`, `dropzone.tsx`, `expandable-card-demo-grid.tsx`, `images-badge-demo.tsx`. Remove unused exports from `about-data.ts`. Delete empty `packages/` dir | ✅ Done |
| Remove unused CSS vars | Delete sidebar + chart variables from `globals.css` | ✅ Done |
| Fix data integrity | Trim trailing space in cert ID, fix duplicate credential IDs, fix image filename typo | ✅ Done |
| Fix hydration workaround | Replace `setTimeout` with `useEffect` in `floating-dock.tsx` | ✅ Done |
| Fix domain inconsistency | Standardize to `fadhildev.my.id` everywhere | ✅ Done |
| Fix alternates.languages | Remove invalid `/en` and `/id` alternates from layout metadata | ✅ Done |
| Remove dead exit animation | Remove `exit` prop from `template.tsx` or add `AnimatePresence` | ✅ Done |

### Sprint 2 — Architecture (Day 3-7)

> Structural improvements for SEO, performance, and maintainability.

| Task | Description | Effort |
|------|-------------|--------|
| Create `lib/site-config.ts` | Centralize all hardcoded personal data + URLs into one config object | 🟡 Medium |
| Split monolithic home page | Extract 7 section components from `page.tsx`, make parent a Server Component | 🔴 High |
| Add page-level SEO metadata | Restructure pages: Server Component parent with `metadata` export → Client Component child for interactivity | 🟡 Medium |
| Centralized env validation | Create `lib/env.ts` with Zod schema that validates all env vars at startup | 🟡 Medium |
| Consolidate theme system | Remove `next-themes`, use only custom `useDarkMode` + `useThemeAnimation` | 🟡 Medium |
| Server Components for data | After page split, import data in Server Components and pass as props to reduce client bundle | 🔴 High |

### Sprint 3 — Security & Quality (Day 8-10)

> Harden the application and improve accessibility.

| Task | Description | Effort/Status |
|------|-------------|--------|
| Security headers | Add CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy to `next.config.mjs` `headers()` | 🟡 Medium |
| Chat input validation | Added Upstash Redis ephemeral memory limit, Typewriter effect for simulated typing speed to prevent rapid firing | ✅ Done |
| Persistent rate limiter | Implemented Upstash Redis rate limiting for global API IP shielding and strictly 3 questions per IP per hour. | ✅ Done |
| Scope image patterns | Replace `**.r2.dev` wildcards with specific bucket hostnames | 🟢 Low |
| Accessibility pass | Add `aria-label` to social links, `role="dialog"` + focus trap to chat, `aria-live` to filter results, skip-to-content link | 🟡 Medium |
| Consolidate icon libraries | Remove `@tabler/icons-react`, keep Phosphor (primary) + Lucide (shadcn) | 🟢 Low |
| Chat UX improvements | Replaced SSE with Typewriter frontend simulation, added localStorage session persistence, implemented Semantic LLM caching | ✅ Done |

### Sprint 4+ — New Features (Week 2+)

> Planned features to elevate the portfolio.

| Task | Description | Effort | Priority |
|------|-------------|--------|----------|
| Blog with MDX | MDX files in repo, syntax highlighting (Shiki), reading time, TOC, tags, RSS feed, i18n | 🔴 High | P0 |
| Resume/CV page | Web-native resume with print CSS, always up-to-date from `about-data.ts` | 🟡 Medium | P1 |
| Command palette (⌘K) | `cmdk` library for keyboard-driven navigation, search, toggles | 🟡 Medium | P1 |
| Project case studies | Dynamic route `app/projects/[slug]/page.tsx` with MDX, problem/process/solution format | 🔴 High | P1 |
| Spotify integration | "Currently Playing" widget via Spotify Web API + OAuth token refresh | ❌ Cancelled (Need Pro Subscription) | P2 |
| Testing infrastructure | Vitest (unit), Testing Library (component), Playwright (E2E) | 🔴 High | P2 |
| Micro-interactions | Loading skeletons, scroll progress bar, hover card previews, 404 page, easter eggs | 🟡 Medium | P3 |
| Public stats page | Lighthouse scores, visitor count, chat stats, uptime | 🟡 Medium | P3 |

---

## 17. Feature Specifications

### 17.1 Blog (Sprint 4 — P0)

**Approach**: MDX files stored in repo, rendered with `next-mdx-remote` or `@next/mdx`

**Pages**:
- `/blog` — blog listing with search, tag filter, pagination
- `/blog/[slug]` — individual post with full MDX rendering

**Post Frontmatter**:
```yaml
---
title: "Post Title"
description: "Short description for SEO"
date: "2026-06-01"
tags: ["nextjs", "react"]
language: "en"        # or "id"
readingTime: 5        # auto-calculated
featured: false
---
```

**Features**:
- Syntax highlighting with Shiki (already in deps)
- Auto-generated reading time
- Table of contents from headings
- Tag filtering + search
- RSS feed at `/feed.xml`
- Share buttons (Twitter, LinkedIn)
- Related posts based on tags
- i18n support (separate posts per language)

**File Structure**:
```
content/
├── blog/
│   ├── en/
│   │   └── my-first-post.mdx
│   └── id/
│       └── postingan-pertama.mdx
```

---

### 17.2 Spotify Integration (Sprint 4 — P2)

**Approach**: Spotify Web API with server-side token refresh

**API Route**: `/api/spotify/now-playing`
- Calls Spotify API for currently playing track
- Refreshes OAuth token via refresh token stored in env
- Caches response for 30 seconds (TanStack Query)

**UI**: Small widget showing album art, track name, artist. Animated equalizer bars when playing. "Not playing" state when idle.

---

### 17.3 GitHub Integration (Sprint 4 — P2)

**Approach**: GitHub GraphQL API with ISR caching

**API Route**: `/api/github/stats`
- Pinned repositories with star/fork counts
- Recent commits (last 5)
- Language breakdown (top 5)
- Contribution streak

**Caching**: ISR with `revalidate: 3600` (1 hour)

---

## 18. Decision Log

| # | Decision | Alternatives Considered | Rationale |
|---|----------|------------------------|-----------|
| 1 | MDX in repo for blog | Headless CMS (Sanity/Contentful), Supabase CMS | Developer-friendly, no external deps, versioned in git, zero cost |
| 2 | Keep two icon libraries (Phosphor + Lucide) | Single library for everything | Lucide is required by shadcn/ui components, Phosphor is the primary design choice |
| 3 | Split home page into section components | Refactor as single Server Component | Individual sections need `"use client"` for animations and interactivity |
| 4 | Vitest for testing | Jest, Bun test | Fastest, native ESM support, best Next.js integration |
| 5 | `lib/site-config.ts` for personal data | All in env vars, CMS | Personal data rarely changes; env vars should be reserved for secrets |
| 6 | Remove `next-themes` in favor of custom hooks | Keep both, fully migrate to next-themes | Custom hooks already handle View Transitions API which next-themes cannot do |
| 7 | Zod for env validation | Manual checks, `t3-env` | Already using Zod in the project, consistent tooling |
| 8 | `cmdk` for command palette | `kbar`, custom implementation | Built by Vercel team, pairs with shadcn/ui, well-maintained |
| 9 | Cancel Spotify Integration | Keep it with mock data | Spotify Web API now strictly requires a Premium Subscription to access the player APIs. Removing the feature entirely is cleaner. |

---

## 19. Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5s |
| Client bundle (JS) | < 200KB gzipped |

### Security

- CSP headers on all pages
- Input validation (Zod) on all API routes
- Rate limiting on all API routes (persistent, not in-memory)
- No secrets in client-side code
- Scoped image remote patterns (no wildcards)
- Honeypot anti-spam on forms
- HTML escaping in email templates

### Accessibility

- WCAG 2.1 AA compliance
- All interactive elements keyboard-navigable
- `aria-label` on icon-only buttons/links
- `aria-live` on dynamic content regions
- Focus trap in modal dialogs
- Skip-to-content link
- Sufficient color contrast in both themes

### SEO

- Unique `<title>` and `<meta description>` on every page
- JSON-LD structured data (Person, WebSite, Article for blog)
- Dynamic sitemap including all pages and blog posts
- Canonical URLs
- OpenGraph and Twitter Card meta tags
- Valid `robots.txt`
- Accessible to crawlers (SSR or SSG for critical content)

### Reliability

- Graceful API failure handling (show error states, not crashes)
- Gemini API fallback chain (3 models)
- Chat logs persist even if Supabase fails
- Contact form works even if rate limiter fails

### i18n

- All user-facing text supports EN and ID via `useTranslation()`
- Language persisted in `localStorage`
- Blog posts can exist in both languages independently
- Error messages from API routes are bilingual

---

## 20. Adding New Features — Quick Guide

### Add a New Page

1. Create directory under `app/` (e.g., `app/blog/`)
2. Create `page.tsx` as a **Server Component** with `metadata` export
3. Create a `*-view.tsx` client component for interactivity
4. Add navigation item to Floating Dock in `components/navigation/`
5. Add i18n translations in `lib/i18n/`
6. Update `app/sitemap.ts` to include the new page
7. Update `lib/knowledge-base.ts` so the AI knows about it

### Add a UI Component

1. Create file in `components/ui/your-component.tsx`
2. Use `"use client"` if interactive
3. Use `cn()` for className merging
4. Export as default or named export
5. Follow existing naming conventions (kebab-case filename)

### Add a shadcn/ui Component

```bash
npx shadcn@latest add <component-name>
```

### Add a Hook

1. Create file in `hooks/use-your-hook.ts`
2. Prefix filename with `use-`
3. Follow existing hook patterns

### Add Data / Content

1. Create or update file in `lib/*-data.ts`
2. Use bilingual structure: `{ en: "...", id: "..." }`
3. Reference from components via imports
4. If data is large, import only in Server Components and pass as props

### Add an API Route

1. Create `app/api/your-route/route.ts`
2. Export async function `GET`, `POST`, etc.
3. Add rate limiting (persistent — use Supabase or KV, not in-memory)
4. Add Zod validation for input
5. Add input length limits
6. Return bilingual error messages

---

## 21. Tips for AI Agents

### Must Do

1. **Always add `"use client"`** for components with interactivity (hooks, events, state)
2. **No semicolons** — Prettier enforces this
3. **Use `cn()`** from `lib/utils.ts` for all className merging
4. **Import from `motion/react`** — NOT `framer-motion`
5. **CSS variables** — use semantic tokens like `bg-background`, `text-foreground`, `border-border`
6. **Path alias** — use `@/` for imports (e.g., `@/lib/utils`)
7. **Tailwind v4** — uses `@import "tailwindcss"` not `@tailwind` directives
8. **New pages need**: Dock item, i18n translations, sitemap entry, knowledge-base update
9. **Static data** — keep content in `lib/*-data.ts` files, not hardcoded in components
10. **i18n** — all user-facing text must support EN and ID via `useTranslation()`
11. **Images** — prefer AVIF format, use Cloudflare R2 CDN URLs
12. **API routes** — always add rate limiting (persistent) and Zod input validation
13. **Analytics** — do not remove Vercel Analytics, Speed Insights, or Clarity
14. **SEO** — update `robots.ts` and `sitemap.ts` when adding new pages

### Must NOT Do

1. **Do NOT use `framer-motion`** — use `motion/react` instead
2. **Do NOT add semicolons** — Prettier will remove them
3. **Do NOT use `@tailwind` directives** — Tailwind v4 uses `@import`
4. **Do NOT hardcode personal data** — use `lib/site-config.ts` (to be created)
5. **Do NOT use in-memory rate limiting** — it resets on Vercel cold starts
6. **Do NOT add new icon libraries** — use Phosphor or Lucide only
7. **Do NOT reference `packages/`** — it's empty and should be deleted
8. **Do NOT add inline styles** — use Tailwind CSS classes
9. **Do NOT trust client-submitted data** — always validate server-side
10. **Do NOT use `next-themes` APIs** — the project is migrating away from it

### Important File Paths

| Purpose | Path |
| ------- | ---- |
| Root layout | `app/layout.tsx` |
| Page transitions | `app/template.tsx` |
| Global styles | `app/globals.css` |
| AI Chat API | `app/api/chat/route.ts` |
| Contact API | `app/api/contact/route.ts` |
| Provider tree | `lib/root-provider.tsx` |
| Utility functions | `lib/utils.ts` |
| Knowledge base (AI prompt) | `lib/knowledge-base.ts` |
| Contact validation schema | `lib/contact-schema.ts` |
| About page data | `lib/about-data.ts` |
| Projects data | `lib/projects-data.ts` |
| Certificates data | `lib/certificates-data.ts` |
| Skill icons mapping | `lib/skill-icons.ts` |
| Dark mode hook | `hooks/use-dark-mode.ts` |
| Theme animation hook | `hooks/use-theme-animation.ts` |
| i18n provider | `components/i18n-provider.tsx` |
| Theme provider | `components/theme-provider.tsx` |
| Floating Dock | `components/navigation/` |
| AI Chat dialog | `components/chat/` |
| Contact form | `components/section/contact-form.tsx` |
| shadcn/ui config | `components.json` |
| Prettier config | `.prettierrc` |
| Environment example | `.env.example` |
| This document | `PRD.md` |

---

> **Last Updated**: 2026-06-06
> **Maintained By**: AI Agents + Fadhil Alif Priyatno
