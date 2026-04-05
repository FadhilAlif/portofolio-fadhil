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
  icon?:
    | "github"
    | "external"
    | "play-store"
    | "app-store"
    | "demo"
    | "download"
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
  /** Project category for filtering — supports multiple categories */
  category: ProjectCategory | ProjectCategory[]
  /** Your role on this project */
  role: ProjectRole
  /** Mark as internal/private company project — shows ribbon, hides GitHub */
  isInternal?: boolean
  /** Featured on the About page */
  featured?: boolean
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

// ─── Category Helper ─────────────────────────────────────────────────────────

/** Normalize category field to always return an array */
export function getCategories(
  category: ProjectCategory | ProjectCategory[]
): ProjectCategory[] {
  return Array.isArray(category) ? category : [category]
}

// ─── Projects Array ───────────────────────────────────────────────────────────
// Sorted newest → oldest. Replace image/video values with actual R2 URLs.

const R2_URL = "https://cdn.fadhildev.my.id/project-avif"

export const projects: ProjectItem[] = [
  {
    title: "Duwitku App",
    dates: "Oct 2025 – Present",
    category: "mobile",
    role: "Mobile Developer",
    featured: true,
    description:
      "A smart, modern finance app built with Flutter to make expense tracking effortless. Features receipt scanning, AI auto-categorization, seamless Supabase sync, and WhatsApp Bot integration.",
    tags: ["Flutter", "Dart", "Supabase"],
    image: `${R2_URL}/duwitku-banner.avif`,
    video: `https://cdn.fadhildev.my.id/project/Duwitku_DemoVideo.mp4`,
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
      {
        type: "Download",
        href: "https://github.com/FadhilAlif/duwitku/releases/download/v3.0.0/Duwitku.apk",
        icon: "download",
      },
    ],
  },
  {
    title: "WBS Public — Whistleblowing System",
    dates: "Dec 2025 – Present",
    association: "Telkomsigma",
    category: ["private", "web"],
    role: "Frontend Engineer",
    featured: true,
    isInternal: true,
    description:
      "A Public WBS that enables external users to securely submit reports with flexible identity options (full, partial, or anonymous). It ensures structured reporting while allowing users to track the status of their submissions.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Django"],
    image: `${R2_URL}/wbs-public-preview.avif`,
  },
  {
    title: "WBS Internal — Whistleblowing System",
    dates: "Dec 2025 – Present",
    association: "Telkomsigma",
    category: ["private", "web"],
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "An internal WBS for the Internal Audit team to manage, validate, and monitor whistleblowing reports end-to-end. It centralizes data from multiple sources, supports structured workflows, and provides dashboards for effective monitoring and decision-making.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Django"],
    image: `${R2_URL}/wbs-internal-preview.avif`,
  },
  {
    title: "PLUSTIX — Pertamina",
    dates: "Feb 2026 – Mar 2026",
    association: "Telkomsigma",
    category: ["private", "web"],
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "A web-based ticketing system for monitoring SPBU shifts and operational issues, featuring Ticket Summary, FAQ, L3 internal tickets, reporting, and a dashboard with filters, insights, and downloadable reports.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: `${R2_URL}/plustix-preview.avif`,
  },
  {
    title: "JSON Polish",
    dates: "Jan 2026",
    category: "web",
    role: "Full-Stack Engineer",
    description:
      "A modern JSON formatting & validation tool with syntax highlighting, diff comparison, auto-fix (quotes, trailing commas, brackets), tabbed editing, file upload/download, and dark/light theme.",
    tags: ["React", "Vite", "TypeScript", "Tailwind CSS"],
    image: `${R2_URL}/json-polish-preview.avif`,
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
    title: "LSM - Invoice Receipt Module",
    dates: "Sep 2025 – Nov 2025",
    association: "Telkomsigma",
    category: ["private", "web"],
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "A web-based module within Logistic Sourcing Management (LSM) that enables Finance teams to track vendor invoice submissions, featuring searchable logs and integrated reporting for better visibility and control.",
    tags: ["Nuxt.js", "TypeScript", "Tailwind CSS"],
    image: `${R2_URL}/lsm-preview.avif`,
  },
  {
    title: "Dishcovery",
    dates: "Sep 2025 – Oct 2025",
    association: "BEKUP — Baparekraf for Startup",
    category: "mobile",
    featured: true,
    role: "Flutter Developer · Team Lead",
    description:
      "A mobile app that preserves Indonesia's traditional culinary heritage through AI-powered image recognition using Gemini API to identify traditional dishes from camera.",
    tags: ["Flutter", "Dart", "Firebase"],
    image: `${R2_URL}/dishcovery-banner.avif`,
    href: "https://github.com/Dishcovery-Dev",
    links: [
      {
        type: "Source",
        href: "https://github.com/Dishcovery-Dev",
        icon: "github",
      },
      {
        type: "Download",
        href: "https://github.com/Dishcovery-Dev/dishcovery-app/releases/download/0.0.1/release.apk",
        icon: "download",
      },
    ],
  },
  {
    title: "ManganKu App",
    dates: "2024",
    association: "BEKUP — Baparekraf for Startup",
    category: "mobile",
    role: "Flutter Developer",
    description:
      "A Flutter app that uses TensorFlow Lite and Firebase ML to recognize food from a photo, then generates nutritional info via Gemini AI and fetches recipes from MealDB & YouTube APIs.",
    tags: ["Flutter", "Firebase", "TensorFlow", "Dart"],
    image: `${R2_URL}/manganku-preview.avif`,
    href: "https://github.com/FadhilAlif/manganku_app",
    links: [
      {
        type: "Source",
        href: "https://github.com/FadhilAlif/manganku_app",
        icon: "github",
      },
      {
        type: "Download",
        href: "https://github.com/FadhilAlif/manganku_app/releases/download/v.1.0.0/manganku-app-v1.0.0.apk",
        icon: "download",
      },
    ],
  },
  {
    title: "TING.ID SaaS ERP",
    dates: "Feb 2025 – Jul 2025",
    association: "Horus Technology",
    category: ["private", "web"],
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "A web-based ERP platform covering management, accounting, and inventory modules. Built responsive and scalable UI using Vue 3, Pinia, and Tailwind CSS with microservice-based API integration.",
    tags: ["Vue.js", "Pinia", "JavaScript", "Tailwind CSS", "Python", "Flask"],
    image: `${R2_URL}/ting-preview.avif`,
  },
  {
    title: "DiabExpert",
    dates: "2025",
    association: "Universitas 'Aisyiyah Yogyakarta",
    category: "web",
    role: "Full-Stack Engineer",
    description:
      "A Web-based expert system for early detection of Type 1 & Type 2 Diabetes Mellitus using the Certainty Factor method. Processes user-reported symptoms and confidence levels to estimate risk.",
    tags: ["Laravel", "MySQL", "Bootstrap"],
    image: `${R2_URL}/diabexpert-preview.avif`,
    href: "https://github.com/FadhilAlif/DiabExpert",
    links: [
      {
        type: "Source",
        href: "https://github.com/FadhilAlif/DiabExpert",
        icon: "github",
      },
    ],
  },
  // {
  //   title: "Stargram",
  //   dates: "2025",
  //   category: "web",
  //   role: "Fullstack Engineer",
  //   description:
  //     "A full-stack social media app — photo uploads, comments, social media links, user auth, and a home feed. Frontend in Vue 3 + PrimeVue, backend in Express.js + Sequelize with JWT auth.",
  //   tags: ["Vue.js", "Pinia", "Express.js", "MySQL", "Sequelize"],
  //   image: `${R2_URL}/stargram-preview.avif`,
  //   href: "https://github.com/FadhilAlif/Stargram-app",
  //   links: [
  //     {
  //       type: "Source",
  //       href: "https://github.com/FadhilAlif/Stargram-app",
  //       icon: "github",
  //     },
  //   ],
  // },
  {
    title: "Apilogy Admin Dashboard",
    dates: "Feb 2024 – Jun 2024",
    association: "Telkom Indonesia — MSIB Batch 6",
    category: ["private", "web"],
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "A web-based admin dashboard for managing users across Apilogy platforms (Developer & Publisher). Built with optimized performance using React,Zustand, TanStack Query, Nest.js and Docker for efficient data handling and scalability.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Nestjs", "Docker"],
    image: `${R2_URL}/apilogy-landing.avif`,
    href: "https://apilogy.id/",
  },
  {
    title: "Cuisine Cash",
    dates: "Nov 2023 – Dec 2023",
    association: "Alterra Academy — MSIB Batch 5",
    category: "web",
    role: "Frontend Engineer",
    description:
      "A cashier web application for restaurants built as an individual capstone project. Implements product management, real-time order processing, and sales reporting dashboard.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    image: `${R2_URL}/cuisinecash-preview.avif`,
    href: "https://cuisine-cash.vercel.app",
    links: [
      {
        type: "Source",
        href: "https://github.com/FadhilAlif/CuisineCash",
        icon: "github",
      },
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
      "A web app that helps farmers manage planting activities with features like watering and fertilizing reminders, planting history, and weather monitoring to support better crop management and decision-making.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    image: `${R2_URL}/agriplant-preview.avif`,
    href: "https://agriculture-react.vercel.app/dashboard",
    links: [
      {
        type: "Source",
        href: "https://github.com/Agriculture-Capstone-Alterra/reactFE",
        icon: "github",
      },
      {
        type: "Demo",
        href: "https://agriculture-react.vercel.app/dashboard",
        icon: "demo",
      },
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
    tags: ["React", "HTML", "CSS", "JavaScript", "Bootstrap"],
    image: `${R2_URL}/tukangin-preview.avif`,
    href: "https://tukangin.vercel.app/",
    links: [
      {
        type: "Github",
        href: "https://github.com/FadhilAlif/react_fadhil-alif-priyatno/",
        icon: "github",
      },
      { type: "Demo", href: "https://tukangin.vercel.app/", icon: "demo" },
    ],
  },
]
