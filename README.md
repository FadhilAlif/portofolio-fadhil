# Fadhil Alif Priyatno — Portfolio

Personal portfolio website showcasing projects, certificates, and professional experience. Built with Next.js 16, React 19, and TypeScript.

**Live Site**: https://fadhildev.my.id

---

## Features

- **Bilingual Support** — English and Indonesian with localStorage persistence
- **AI Chat Assistant** — Powered by Google Gemini with fallback chain and Supabase chat log persistence
- **Contact Form** — Email delivery via Resend with Zod validation and honeypot spam protection
- **Analytics & Monitoring** — Vercel Analytics, Vercel Speed Insights, and Microsoft Clarity
- **Responsive Design** — Mobile-first with Tailwind CSS v4
- **Dark/Light Mode** — View Transitions API with circular clip-path animation
- **SEO Optimized** — Dynamic sitemap, robots.txt, and JSON-LD structured data
- **Cloudflare R2 CDN** — Assets served via `https://cdn.fadhildev.my.id/`

---

## Tech Stack

| Category       | Technologies                                                                 |
| -------------- | ---------------------------------------------------------------------------- |
| **Framework**  | Next.js 16, React 19, TypeScript 5                                           |
| **Styling**    | Tailwind CSS v4, shadcn/ui, radix-ui, oklch colors                           |
| **Animation**  | Motion (motion/react)                                                        |
| **State**      | Zustand, TanStack Query, nuqs                                                |
| **i18n**       | react-i18next (EN + ID)                                                      |
| **Forms**      | react-hook-form, Zod                                                         |
| **AI**         | Google Gemini API (@google/genai)                                            |
| **Database**   | Supabase                                                                     |
| **Email**      | Resend                                                                       |
| **Analytics**  | Vercel Analytics, Vercel Speed Insights, Microsoft Clarity                   |
| **Icons**      | Phosphor Icons, Lucide React, Tabler Icons                                   |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/fadhilalifpriyatno/portofolio-fadhil.git
cd portofolio-fadhil

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` with your API keys (see [Environment Variables](#environment-variables)).

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

## Environment Variables

| Variable                    | Description                          | Required |
| --------------------------- | ------------------------------------ | -------- |
| `GEMINI_API_KEY`            | Google Gemini API key                | Yes      |
| `RESEND_API_KEY`            | Resend email API key                 | Yes      |
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase project URL                 | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key            | Yes      |
| `CONTACT_EMAIL_TO`          | Recipient email for contact form     | Yes      |

---

## Project Structure

```
portofolio-fadhil/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── components/             # React components (ui, section, navigation, chat)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, data, providers, i18n resources
├── types/                  # TypeScript type definitions
├── utils/                  # Helper utilities
├── public/                 # Static assets
├── packages/               # Monorepo skeleton (empty)
├── package.json
├── tsconfig.json
├── next.config.ts
├── components.json
└── .env.example
```

---

## Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start dev server with Turbopack          |
| `npm run build`     | Production build                         |
| `npm start`         | Start production server                  |
| `npm run lint`      | Run ESLint                               |
| `npm run format`    | Format code with Prettier                |
| `npm run typecheck` | TypeScript type checking                 |

---

## Deployment

This project is deployed on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy Steps

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

---

## License

MIT License. See [LICENSE](LICENSE) for details.
