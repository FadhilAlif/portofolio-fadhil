# AGENT.md — Fadhil Alif Portfolio

> Panduan lengkap untuk AI-assisted coding pada project portfolio pribadi **Fadhil Alif Priyatno**.

---

## 📋 Project Overview

| Field         | Value                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Nama**      | `portofolio-fadhil`                                                                                                          |
| **Versi**     | `0.0.1`                                                                                                                      |
| **Tipe**      | Personal Portfolio Website                                                                                                   |
| **Pemilik**   | Fadhil Alif Priyatno — Full-Stack Engineer                                                                                   |
| **Deskripsi** | Website portfolio pribadi yang menampilkan profil, pengalaman kerja, edukasi, skill, proyek, sertifikat, dan halaman kontak. |
| **Status**    | 🟡 Active Development — beberapa halaman masih berupa placeholder                                                            |

---

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16** (`^16.1.6`) — App Router, React Server Components enabled
- **React 19** (`^19.2.4`)
- **TypeScript 5** (`^5.9.3`) — strict mode enabled
- **Turbopack** — digunakan sebagai bundler dev (`next dev --turbopack`)

### Styling

- **Tailwind CSS v4** (`^4.1.18`) — menggunakan `@tailwindcss/postcss` plugin
- **tw-animate-css** (`^1.4.0`) — animasi utility classes
- **shadcn/ui** (`^4.0.2`) — component library, style `radix-lyra`, base color `neutral`
- **CSS Variables** — design tokens via oklch color space di `globals.css`
- **Custom variant**: `@custom-variant dark (&:is(.dark *))` (class-based dark mode)

### Animation

- **Framer Motion / Motion** (`^12.35.2`) — tersedia via dua package:
  - `framer-motion` — digunakan di `dock.tsx`, `ai-chat-dialog.tsx`, `template.tsx`
  - `motion` (alias) — digunakan di `apple-cards-carousel.tsx`, `apple-hello-effect.tsx`
  - ⚠️ **PENTING**: Kedua package ini ada duplikasi. Saat membuat komponen baru, preferensikan `motion/react` untuk konsistensi.

### State Management

- **Zustand** (`^5.0.11`) — global state management (contoh store tersedia di `stores/index.ts`)
- **TanStack Query** (`^5.90.21`) — server state / data fetching, stale time 30 detik
- **nuqs** (`^2.8.9`) — URL search params state management

### Data Fetching

- **Axios** (`^1.13.6`) — HTTP client dengan error handling utility
- **TanStack Query** — caching & revalidation layer

### Icons

- **Phosphor Icons** (`@phosphor-icons/react ^2.1.10`) — icon library utama, sesuai config shadcn
- **Lucide React** (`^0.577.0`) — icon library sekunder, digunakan di navigation & UI
- **Tabler Icons** (`@tabler/icons-react ^3.40.0`) — digunakan di carousel component

### Theming

- **Custom dark mode system** — TIDAK menggunakan `next-themes` untuk rendering (meskipun package terinstall)
- Tema dikelola oleh custom hooks:
  - `useDarkMode` — read/write localStorage, apply `.dark` class ke `<html>`
  - `useThemeAnimation` — toggle tema dengan View Transitions API (circular clip-path animation)
- **Hotkey**: Tekan `D` untuk toggle dark/light mode
- **`next-themes`**: Hanya `useTheme()` digunakan di `skill-category.tsx` untuk `resolvedTheme`
  - ⚠️ **Potensi konflik**: `ThemeProvider` custom dan `next-themes` bisa out of sync. Perlu perhatian khusus.

### Utilities

- **clsx** + **tailwind-merge** — digabung dalam fungsi `cn()` di `lib/utils.ts`
- **class-variance-authority (cva)** — component variant styling
- **react-markdown** — rendering markdown content
- **shiki** — syntax highlighting (terinstall, belum terlihat penggunaannya)
- **sonner** — toast notifications

### Code Quality

- **ESLint** — `eslint-config-next` (core-web-vitals + typescript)
- **Prettier** — semi: false, double quotes, trailing comma es5, `prettier-plugin-tailwindcss`
- **TypeScript** — strict mode, path alias `@/*`

---

## 📁 Project Structure

```
portofolio-fadhil/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: fonts, providers, floating dock
│   ├── template.tsx              # Page transition wrapper (framer-motion fade+blur)
│   ├── page.tsx                  # Homepage: Hero, Experience, Education, Skills
│   ├── loading.tsx               # Global loading spinner
│   ├── globals.css               # Design tokens, Tailwind config, view-transition styles
│   ├── contact/page.tsx          # 🟡 Contact page (placeholder form)
│   ├── projects/page.tsx         # 🟡 Projects page (placeholder cards)
│   └── certificates/page.tsx     # 🟡 Certificates page (placeholder data)
│
├── components/
│   ├── theme-provider.tsx        # Custom ThemeProvider + keyboard shortcut (D key)
│   ├── chat/
│   │   └── ai-chat-dialog.tsx    # Mock AI chat dialog (non-functional AI)
│   ├── icons/
│   │   └── pixel-image.tsx       # Animated pixelated image reveal component
│   ├── navigation/
│   │   └── floating-dock.tsx     # macOS-style dock navigation (bottom-fixed)
│   ├── section/
│   │   └── work-section.tsx      # Accordion-based work experience section
│   └── ui/                       # Reusable UI components
│       ├── accordion.tsx         # Radix accordion primitive
│       ├── apple-cards-carousel.tsx  # Apple-style card carousel with modal
│       ├── apple-hello-effect.tsx    # SVG handwriting animation (signature)
│       ├── badge.tsx             # Badge component
│       ├── button.tsx            # Button component (shadcn)
│       ├── code-editor.tsx       # Code editor component
│       ├── dock.tsx              # macOS dock UI (magnification effect)
│       ├── dropzone.tsx          # File dropzone
│       ├── loading-spinner.tsx   # Full-screen loading spinner
│       ├── project-card.tsx      # Project card with image, tags, links
│       ├── skill-category.tsx    # Skill icons grid (skillicons.dev API)
│       ├── sonner.tsx            # Toast notification wrapper
│       ├── spinner.tsx           # Spinner animation variants
│       ├── spotlight.tsx         # Interactive spotlight background effect
│       ├── theme-toggle.tsx      # Theme toggle button
│       └── tooltip.tsx           # Tooltip component
│
├── hooks/
│   ├── use-boolean.tsx           # Boolean state with toggle/set utilities
│   ├── use-dark-mode.tsx         # Dark mode with localStorage persistence
│   ├── use-debounce.ts           # Generic debounce hook
│   ├── use-debounce-search.ts    # Debounced search with URL sync
│   ├── use-mobile.ts             # Mobile viewport detection
│   ├── use-outside-click.ts      # Click outside detection
│   ├── use-read-local-storage.tsx # Read localStorage with SSR safety
│   └── use-theme-animation.ts    # View Transitions API theme toggle
│
├── lib/
│   ├── react-query.tsx           # TanStack Query provider
│   ├── root-provider.tsx         # Combined providers wrapper
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
│
├── stores/
│   └── index.ts                  # Zustand store (example counter)
│
├── types/
│   └── index.ts                  # Shared types (Pagination, ResponseMessage, etc.)
│
├── utils/
│   ├── handleAxiosError.ts       # Axios error handler with toast notifications
│   └── sanitizeData.ts           # Data & URL sanitization utilities
│
├── public/
│   └── assets/
│       ├── fadhil-photo-profie.png   # Profile photo
│       ├── fadhil-background-bw.png  # Background image
│       └── company-logo/             # Company logos for experience section
│
├── packages/                     # Monorepo packages (empty, placeholder)
│   ├── eslint-config/
│   └── ui/
│
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── next.config.mjs
├── eslint.config.mjs
├── components.json               # shadcn configuration
├── .prettierrc
└── .gitignore
```

---

## 🏗️ Architecture & Patterns

### Provider Tree

```
<html>
  <body>
    <Suspense fallback={<LoadingSpinner />}>
      <RootProvider>
        ├── TanstackQueryProvider    (React Query)
        │   └── ThemeProvider        (Custom dark mode context)
        │       └── NuqsAdapter      (URL state management)
        │           ├── {children}   (Page content)
        │           ├── <Toaster />  (Sonner notifications)
        │           └── <FloatingDock /> (Navigation)
      </RootProvider>
    </Suspense>
  </body>
</html>
```

### Page Transitions

Semua halaman di-wrap oleh `app/template.tsx` yang menambahkan transisi fade+blur menggunakan `framer-motion`:

```tsx
initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
exit={{ opacity: 0, y: 30, filter: "blur(4px)" }}
```

### Navigation

- **Floating Dock** — fixed bottom-center, macOS-style dengan magnetic magnification
- Halaman: `/` (About), `/projects`, `/certificates`, `/contact`
- Fitur tambahan di dock: **AI Chat** (mock) dan **Theme Toggle**
- Navigasi menggunakan `next/navigation` (`useRouter().push()`)

### Dark Mode Flow

1. `useDarkMode` hook membaca localStorage key `portfolio-theme`
2. Default: dark mode (`defaultValue: true`)
3. Toggle menggunakan `useThemeAnimation` yang memanfaatkan **View Transitions API**
4. Animasi berupa circular clip-path expand dari posisi klik
5. Fallback: langsung set class jika browser tidak support View Transitions

### Component Naming Conventions

- **UI primitives**: `components/ui/*.tsx` — reusable, tidak terikat business logic
- **Section components**: `components/section/*.tsx` — section-level page building blocks
- **Navigation**: `components/navigation/*.tsx`
- **Icons/Illustrations**: `components/icons/*.tsx`
- **Feature components**: `components/chat/*.tsx`, dll.

---

## 📝 Coding Conventions

### TypeScript

- Strict mode enabled
- Gunakan `interface` untuk props dan object shapes
- Export named types bersama component file
- Path alias: `@/*` dari root project

### React

- Semua komponen interaktif HARUS memiliki `"use client"` di baris pertama
- Server Components digunakan di pages yang tidak butuh client-side interactivity
- Prefer functional components + hooks
- Gunakan `cn()` untuk conditional classNames

### Styling

- **SELALU gunakan Tailwind CSS** untuk styling — hindari inline styles kecuali untuk dynamic values
- Design tokens didefinisikan sebagai CSS variables di `globals.css` (oklch color space)
- Gunakan semantic token names: `bg-background`, `text-foreground`, `border-border`, dll.
- Responsive: mobile-first (`className="text-sm md:text-lg"`)
- Dark mode: gunakan Tailwind `dark:` variant

### File Organization

- Satu komponen per file (boleh ada sub-components internal)
- Tiap file UI component boleh punya section `// Demo` di akhir file untuk testing isolasi
- Hooks di folder `hooks/`, PREFIX `use-` dengan kebab-case
- Types centralized di `types/index.ts`, atau co-located di file component

### Formatting (Prettier)

```json
{
  "endOfLine": "lf",
  "semi": false, // ⚠️ TANPA semicolon
  "singleQuote": false, // Double quotes
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

---

## ⚙️ Available Scripts

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start dev server dengan Turbopack             |
| `npm run build`     | Production build                              |
| `npm start`         | Start production server                       |
| `npm run lint`      | Run ESLint                                    |
| `npm run format`    | Format semua `.ts`, `.tsx` files via Prettier |
| `npm run typecheck` | TypeScript type checking tanpa emit           |

---

## 🎨 Design System

### Color Tokens (oklch)

- **Light mode**: Background putih, foreground hitam, desain clean & minimal
- **Dark mode**: Background `oklch(0.145 0 0)` (almost black), foreground putih
- Semua warna menggunakan **oklch color space** untuk perceptual uniformity
- Primary color: monochrome (dark in light mode, light in dark mode)

### Typography

- **Sans**: Geist (`--font-sans`)
- **Mono**: JetBrains Mono (`--font-mono`) — digunakan sebagai default body font
- Font loaded via `next/font/google`

### Border Radius

- Base: `0.625rem`, dengan computed variants (sm, md, lg, xl, 2xl, 3xl, 4xl)

### Animations

- View Transition API untuk theme switching
- Framer Motion untuk page transitions, dock magnification, carousel
- Custom pixel-fade animation untuk profile image
- SVG path animation untuk signature effect
- Spotlight background dengan mouse-following gradient

---

## 🔧 Key Components Reference

### `SpotlightBackground`

Background interaktif dengan gradient yang mengikuti posisi mouse. Mendukung ambient drift saat tidak ada aktivitas mouse.

### `PixelImage`

Komponen gambar dengan efek pixelated reveal animation. Mendukung configurable grid, grayscale animation, dan replay.

### `FadhilSignatureEffect`

Animasi SVG tulisan tangan "Fadhil" menggunakan clip-path reveal animation.

### `Dock` / `DockItem` / `DockIcon` / `DockLabel`

Komponen dock macOS-style dengan efek magnetic magnification. Menggunakan `useMotionValue` dan `useSpring` dari framer-motion.

### `WorkSection`

Section pengalaman kerja menggunakan Radix Accordion. Setiap item menampilkan logo perusahaan, role, period, dan deskripsi expandable.

### `SkillCategory`

Menampilkan skill icons menggunakan API `skillicons.dev`. Auto-switch antara light/dark theme icons.

### `ProjectCard`

Card komponen untuk menampilkan project dengan image/video, tags, links, dan markdown description.

### `AiChatDialog`

Dialog chat AI mock (belum terintegrasi dengan backend AI). Fixed position di bottom-left.

---

## 🚧 Known Issues & TODOs

### Incomplete Pages

- `app/projects/page.tsx` — masih dummy placeholder data
- `app/certificates/page.tsx` — masih dummy placeholder data
- `app/contact/page.tsx` — form belum diimplementasi, links masih `#`

### Technical Debt

1. **Duplikasi motion packages**: `framer-motion` dan `motion` terinstall bersamaan. Idealnya unified ke satu package.
2. **Theme system conflict**: `next-themes` terinstall tetapi `ThemeProvider` custom digunakan. `skill-category.tsx` menggunakan `useTheme()` dari `next-themes` yang bisa konflik dengan custom theme management.
3. **Monorepo skeleton**: Folder `packages/eslint-config` dan `packages/ui` kosong (hanya ada node_modules), kemungkinan leftover dari setup awal.
4. **Store example**: `stores/index.ts` masih berisi counter example, belum ada actual store.
5. **Education logo placeholder**: `edu.logo` menggunakan `placehold.co`, perlu diganti dengan asset asli.
6. **Image tag imports**: Beberapa komponen menggunakan `<img>` dengan eslint-disable instead of `next/image`.
7. **No testing**: Belum ada test setup (unit tests, e2e tests).

---

## 🧩 Adding New Features — Quick Guide

### Menambahkan halaman baru

1. Buat folder di `app/[nama-halaman]/page.tsx`
2. Tambahkan navigation item di `components/navigation/floating-dock.tsx`
3. Jika butuh client interactivity, tambahkan `"use client"` di baris pertama

### Menambahkan komponen UI baru

1. Buat file di `components/ui/[nama-komponen].tsx`
2. Gunakan `cn()` dari `@/lib/utils` untuk className merging
3. Export types beserta component
4. Opsional: tambahkan `// Demo` section di akhir file

### Menambahkan shadcn component

```bash
npx shadcn@latest add [component-name]
```

Config mengacu ke `components.json` — output ke `components/ui/`

### Menambahkan custom hook

1. Buat file di `hooks/use-[nama].ts`
2. Prefix dengan `use-` (kebab-case)
3. Tambahkan `"use client"` jika hook menggunakan browser APIs

### Menambahkan data/konten baru

- Data statis (experience, skills, education) didefinisikan langsung di page file (`app/page.tsx`)
- Untuk data dinamis, gunakan TanStack Query + Axios pattern yang sudah ada

---

## 🔑 Important File Paths

| Purpose              | Path                                      |
| -------------------- | ----------------------------------------- |
| Homepage             | `app/page.tsx`                            |
| Root layout          | `app/layout.tsx`                          |
| Global styles        | `app/globals.css`                         |
| Combined providers   | `lib/root-provider.tsx`                   |
| Theme provider       | `components/theme-provider.tsx`           |
| Navigation dock      | `components/navigation/floating-dock.tsx` |
| Theme animation hook | `hooks/use-theme-animation.ts`            |
| Dark mode hook       | `hooks/use-dark-mode.tsx`                 |
| Utility: cn()        | `lib/utils.ts`                            |
| Shared types         | `types/index.ts`                          |
| shadcn config        | `components.json`                         |
| TypeScript config    | `tsconfig.json`                           |
| Prettier config      | `.prettierrc`                             |
| ESLint config        | `eslint.config.mjs`                       |

---

## 🌐 External Dependencies & APIs

| Service        | Usage                                    |
| -------------- | ---------------------------------------- |
| skillicons.dev | Rendering skill/tech stack icons         |
| placehold.co   | Placeholder images (education logo)      |
| Google Fonts   | Geist + JetBrains Mono (via `next/font`) |

---

## 💡 Tips for AI Agents

1. **Selalu gunakan `"use client"`** untuk komponen yang menggunakan hooks, event handlers, atau browser APIs.
2. **Jangan tambahkan semicolons** — project menggunakan Prettier tanpa semi.
3. **Gunakan `cn()`** dari `@/lib/utils` untuk class merging, BUKAN string concatenation.
4. **Import animasi dari `motion/react`** untuk konsistensi (bukan `framer-motion`).
5. **Perhatikan theming**: Gunakan CSS variable tokens (`bg-background`, `text-foreground`) bukan hardcoded colors.
6. **Path alias `@/*`** tersedia — hindari relative imports yang panjang.
7. **Tailwind v4 syntax**: Project menggunakan `@import "tailwindcss"` dan `@theme inline` block, bukan `tailwind.config.js`.
8. **Saat menambahkan page baru**: Selalu update dock navigation agar page accessible.
9. **Data statis**: Experience, skills, education data langsung di `app/page.tsx` — tidak ada CMS atau database.
10. **Monorepo packages**: Folder `packages/` bisa diabaikan — tidak aktif digunakan.
