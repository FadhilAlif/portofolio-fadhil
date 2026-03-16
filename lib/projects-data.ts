// ─── Project Data ────────────────────────────────────────────────────────────
// Central data source for project cards. Kept separate from UI for clean code.
// Images/videos should be hosted on Cloudflare R2 (public bucket).
// Sorted: newest → oldest
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectCategory = "web" | "mobile" | "private"

export type ProjectRole =
  | "Full-Stack Engineer"
  | "Fullstack Engineer"
  | "Frontend Engineer"
  | "Backend Engineer"
  | "Mobile Developer"
  | "Flutter Developer"
  | "Flutter Developer · Team Lead"
  | "UI/UX Designer"

export interface ProjectLink {
  type: string
  href: string
  icon?: "github" | "external" | "play-store" | "app-store" | "demo"
}

export interface ProjectItem {
  /** Project title */
  title: string
  /** Short description shown on the card */
  description: string
  /** Date range */
  dates: string
  /** Associated organization (optional) */
  association?: string
  /** Tech tags */
  tags: readonly string[]
  /** Project category for filtering */
  category: ProjectCategory
  /** Your role on this project */
  role: ProjectRole
  /** Mark as internal/private company project — shows ribbon, hides GitHub */
  isInternal?: boolean
  /** External link (opens on click) — omit for internal-only projects */
  href?: string
  /** Image URL from Cloudflare R2 */
  image?: string
  /** Video URL from Cloudflare R2 (takes priority over image) */
  video?: string
  /** Action links (GitHub, Demo, etc.) */
  links?: readonly ProjectLink[]
}

// ─── Filter Config ────────────────────────────────────────────────────────────

export const PROJECT_FILTERS = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "private", label: "Internal" },
] as const

export type FilterId = (typeof PROJECT_FILTERS)[number]["id"]

// ─── Projects Array ───────────────────────────────────────────────────────────
// Sorted newest → oldest. Replace image/video values with your actual R2 URLs.

const R2_URL = "https://cdn.fadhildev.my.id/project"

export const projects: ProjectItem[] = [
  // ── 2025 – Present ────────────────────────────────────────────────────────

  {
    title: "Duwitku App",
    dates: "Oct 2025 – Present",
    category: "mobile",
    role: "Mobile Developer",
    description:
      "A smart, modern finance app built with Flutter to make expense tracking effortless. Features receipt scanning, AI auto-categorization, seamless Supabase sync, and WhatsApp Bot integration.",
    tags: ["Flutter", "Dart", "Supabase"],
    image: `${R2_URL}/duwitku-banner.png`,
    href: "https://duwitku-landing.vercel.app/",
    links: [
      {
        type: "Source",
        href: "https://github.com/FadhilAlif/duwitku",
        icon: "github",
      },
      {
        type: "Demo",
        href: "https://www.youtube.com/watch?v=OUzAlu1hCzo",
        icon: "demo",
      },
    ],
  },
  {
    title: "WBS Public — Whistleblowing System",
    dates: "Dec 2025 – Present",
    association: "Telkomsigma",
    category: "private",
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "A secure, fast whistleblowing platform built with Next.js and TypeScript. Supports anonymous & confidential reporting, admin report management.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Django"],
    image: `${R2_URL}/wbs-public-preview.png`,
  },
  {
    title: "WBS Internal — Whistleblowing System",
    dates: "Dec 2025 – Present",
    association: "Telkomsigma",
    category: "private",
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "A secure, fast whistleblowing platform built with Next.js and TypeScript. Supports anonymous & confidential reporting, admin report management.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Django"],
    image: `${R2_URL}/wbs-internal-preview.png`,
  },
  {
    title: "PLUSTIX — Pertamina",
    dates: "Feb 2026 – Mar 2026",
    association: "Telkomsigma",
    category: "private",
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "Enhancement of the PlusTix Pertamina module - Ticket Summary, FAQ, L3 internal ticketing, reporting, and a Dashboard with filter, rating & review insights, and downloadable reports.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: `${R2_URL}/plustix-preview.png`,
  },
  {
    title: "LSM - Invoice Receipt Module",
    dates: "Sep 2025 – Nov 2025",
    association: "Telkomsigma",
    category: "private",
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "Enhancement of Invoice Receipt module in the Logistic Sourcing Management (LSM) that enables Finance teams to track vendor invoice submissions with searchable logs and integrated reporting.",
    tags: ["Nuxt.js", "Django", "TypeScript", "Tailwind CSS"],
    image: `${R2_URL}/lsm-preview.png`,
  },
  {
    title: "Dishcovery",
    dates: "Sep 2025 – Oct 2025",
    association: "BEKUP — Baparekraf for Startup",
    category: "mobile",
    role: "Flutter Developer · Team Lead",
    description:
      "A mobile app that preserves Indonesia's traditional culinary heritage through AI-powered image recognition using Gemini API to identify traditional dishes from camera.",
    tags: ["Flutter", "Dart", "Firebase"],
    image: `${R2_URL}/dishcovery-banner.jpg`,
    href: "https://github.com/Dishcovery-Dev",
    links: [
      {
        type: "Source",
        href: "https://github.com/Dishcovery-Dev",
        icon: "github",
      },
    ],
  },
  {
    title: "DiabExpert",
    dates: "2025",
    association: "Universitas 'Aisyiyah Yogyakarta",
    category: "web",
    role: "Full-Stack Engineer",
    description:
      "Web-based expert system for early detection of Type 1 & Type 2 Diabetes Mellitus using the Certainty Factor method. Processes user-reported symptoms and confidence levels to estimate risk.",
    tags: ["Laravel", "MySQL", "Bootstrap", "Blade"],
    image: `${R2_URL}/diabexpert-preview.png`,
  },
  {
    title: "TING.ID SaaS ERP",
    dates: "Feb 2025 – Jul 2025",
    association: "Horus Technology",
    category: "private",
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "Contributed to an in-house ERP platform covering Management, Accounting, and Inventory modules. Built responsive UI with Vue 3, Pinia, and Tailwind CSS with microservice-based API integration.",
    tags: ["Vue.js", "Pinia", "JavaScript", "Tailwind CSS"],
    image: `${R2_URL}/ting-preview.png`,
  },

  // ── 2024 ──────────────────────────────────────────────────────────────────

  {
    title: "Apilogy Admin Dashboard",
    dates: "Feb 2024 – Jun 2024",
    association: "Telkom Indonesia — MSIB Batch 6",
    category: "private",
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "Developed the Apilogy Admin Dashboard focusing on user management and performance optimization. Integrated Docker, Zustand for state management, and TanStack Query for efficient data fetching.",
    tags: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "Docker",
    ],
    image: `${R2_URL}/apilogy-landing.png`,
    href: "https://admin-new-staging.apilogy.id/",
  },
  {
    title: "ManganKu App",
    dates: "2024",
    association: "BEKUP — Baparekraf for Startup",
    category: "mobile",
    role: "Flutter Developer",
    description:
      "A Flutter app that uses TensorFlow Lite and Firebase ML to recognize food from a photo, then generates nutritional info via Gemini AI and fetches recipes from MealDB & YouTube APIs.",
    tags: ["Flutter", "Firebase", "TensorFlow Lite", "Gemini", "Dart"],
    image: `${R2_URL}/manganku-preview.png`,
    href: "https://github.com/FadhilAlif/manganku_app",
    links: [
      {
        type: "Source",
        href: "https://github.com/FadhilAlif/manganku_app",
        icon: "github",
      },
    ],
  },
  {
    title: "JSON Polish",
    dates: "2026",
    category: "web",
    role: "Full-Stack Engineer",
    description:
      "A modern JSON formatting & validation tool with syntax highlighting, diff comparison, auto-fix (quotes, trailing commas, brackets), tabbed editing, file upload/download, and dark/light theme.",
    tags: ["React", "TypeScript", "Vite", "shadcn/ui", "Tailwind CSS"],
    image: `${R2_URL}/json-polish-preview.png`,
    href: "https://json-polish.vercel.app/",
    links: [
      {
        type: "Source",
        href: "https://github.com/FadhilAlif/json-polish",
        icon: "github",
      },
      { type: "Demo", href: "https://json-polish.vercel.app/", icon: "demo" },
    ],
  },
  {
    title: "Stargram",
    dates: "2024",
    category: "web",
    role: "Fullstack Engineer",
    description:
      "A full-stack social media app — photo uploads, comments, social media links, user auth, and a home feed. Frontend in Vue 3 + PrimeVue, backend in Express.js + Sequelize with JWT auth.",
    tags: ["Vue.js 3", "Pinia", "Express.js", "Sequelize", "MySQL", "JWT"],
    image: `${R2_URL}/stargram-preview.png`,
    href: "https://github.com/FadhilAlif/Stargram-app",
    links: [
      {
        type: "Source",
        href: "https://github.com/FadhilAlif/Stargram-app",
        icon: "github",
      },
    ],
  },

  // ── 2023 ──────────────────────────────────────────────────────────────────

  {
    title: "Cuisine Cash",
    dates: "Nov 2023 – Dec 2023",
    association: "Alterra Academy — MSIB Batch 5",
    category: "web",
    role: "Frontend Engineer",
    description:
      "A cashier web application for restaurants built as an individual capstone project. Implements product management, real-time order processing, and sales reporting dashboard.",
    tags: ["React", "JavaScript", "Tailwind CSS", "REST API"],
    image: `${R2_URL}/cuisinecash-preview.png`,
    href: "https://cuisine-cash.vercel.app",
    links: [
      { type: "Source", href: "https://github.com/fadhilalif", icon: "github" },
      { type: "Demo", href: "https://cuisine-cash.vercel.app", icon: "demo" },
    ],
  },
  {
    title: "Agriplant",
    dates: "Oct 2023 – Nov 2023",
    association: "Alterra Academy — MSIB Batch 5",
    category: "web",
    role: "Frontend Engineer",
    description:
      "A collaborative agri-tech web platform that connects farmers with buyers, providing crop listings, real-time market prices, and agricultural advisory content.",
    tags: ["React", "JavaScript", "Tailwind CSS", "REST API"],
    image: `${R2_URL}/agriplant-preview.png`,
    href: "https://github.com/fadhilalif",
    links: [
      { type: "Source", href: "https://github.com/fadhilalif", icon: "github" },
    ],
  },
  {
    title: "Tukangin Landing Page",
    dates: "Sep 2023",
    association: "Alterra Academy — MSIB Batch 5",
    category: "web",
    role: "Frontend Engineer",
    description:
      "Responsive landing page for a home services marketplace, built as a Code Competence learning task at Alterra Academy using React and Bootstrap.",
    tags: ["React", "Bootstrap", "JavaScript"],
    image: `${R2_URL}/tukangin-preview.png`,
    href: "https://tukangin.vercel.app/",
    links: [
      { type: "Demo", href: "https://tukangin.vercel.app/", icon: "demo" },
    ],
  },
]
