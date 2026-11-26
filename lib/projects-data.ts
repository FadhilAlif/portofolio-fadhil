// ─── Project Data ────────────────────────────────────────────────────────────
// Central data source for project cards. Kept separate from UI for clean code.
// Images/videos should be hosted on Cloudflare R2 (public bucket).
// Sorted: newest → oldest
// ─────────────────────────────────────────────────────────────────────────────

import { siteConfig } from "@/lib/site-config"
import type { AppLanguage } from "@/lib/i18n/config"

export type ProjectCategory = "web" | "mobile" | "private"

export type ProjectRole =
  | "Full-Stack Engineer"
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

const BASE_PROJECT_FILTERS = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "private", label: "Internal" },
] as const

export type FilterId = (typeof BASE_PROJECT_FILTERS)[number]["id"]

export function getProjectFilters(language: AppLanguage) {
  if (language === "id") {
    return [
      { id: "all", label: "Semua" },
      { id: "web", label: "Web" },
      { id: "mobile", label: "Mobile" },
      { id: "private", label: "Internal" },
    ] as const
  }

  return BASE_PROJECT_FILTERS
}

// ─── Category Helper ─────────────────────────────────────────────────────────

/** Normalize category field to always return an array */
export function getCategories(
  category: ProjectCategory | ProjectCategory[]
): ProjectCategory[] {
  return Array.isArray(category) ? category : [category]
}

// ─── Projects Array ───────────────────────────────────────────────────────────
// Sorted newest → oldest. Replace image/video values with actual R2 URLs.

const R2_URL = `${siteConfig.cdnUrl}/project-avif`

export const projects: ProjectItem[] = [
  {
    title: "WBS Public — Whistleblowing System",
    dates: "Dec 2025 – Apr 2026",
    association: "Telkomsigma",
    category: ["private", "web"],
    role: "Full-Stack Engineer",
    featured: true,
    isInternal: true,
    description:
      "Public Whistleblowing System built from scratch with Next.js and Django serving 1,200+ employees. Enables secure report submissions with flexible identity options (full, partial, or anonymous), i18n support, and real-time submission tracking.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Django"],
    image: `${R2_URL}/wbs-public-preview.avif`,
  },
  {
    title: "WBS Internal — Whistleblowing System",
    dates: "Dec 2025 – Apr 2026",
    association: "Telkomsigma",
    category: ["private", "web"],
    role: "Full-Stack Engineer",
    isInternal: true,
    description:
      "Internal audit and admin platform built with Next.js and Django serving 1,200+ employees. Centralizes whistleblowing reports with RBAC-based complaint workflows, full audit trails, and monitoring dashboards.",
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
      "Shift Management and Ticket Summary module for the PlusTix Pertamina helpdesk platform built with Next.js. Consolidates SPBU operational analytics dashboards, exportable reports, L3 internal tickets, and rating & review insights into a unified view.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: `${R2_URL}/plustix-preview.avif`,
  },
  {
    title: "JSON Polish",
    dates: "Jan 2026",
    category: "web",
    role: "Full-Stack Engineer",
    description:
      "A modern JSON formatting & validation tool for my personal use with syntax highlighting, diff comparison, auto-fix (quotes, trailing commas, brackets), tabbed editing, file upload/download, and dark/light theme.",
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
    title: "Duwitku App",
    dates: "Oct 2025 – Dec 2025",
    category: "mobile",
    role: "Mobile Developer",
    featured: true,
    description:
      "A smart personal finance mobile app built with Flutter to automate expense tracking and eliminate manual entry. Features AI receipt scanning via Gemini API, Supabase sync, and WhatsApp Bot integration (WAHA).",
    tags: ["Flutter", "Dart", "Supabase"],
    image: `${R2_URL}/duwitku-banner.avif`,
    video: `${siteConfig.cdnUrl}/project/Duwitku_DemoVideo.mp4`,
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
    title: "LSM - Invoice Receipt Module",
    dates: "Sep 2025 – Nov 2025",
    association: "Telkomsigma",
    category: ["private", "web"],
    role: "Full-Stack Engineer",
    isInternal: true,
    description:
      "Invoice Receipt module for the Logistic Sourcing Management (LSM) platform built with Nuxt.js and Django. Equips Finance teams with a centralized, searchable vendor invoice log and integrated reporting for full lifecycle visibility.",
    tags: ["Nuxt.js", "TypeScript", "Tailwind CSS", "Django"],
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
      "A Flutter mobile app preserving Indonesia's traditional culinary heritage using Gemini API image recognition to identify traditional dishes and nearby food locations, backed by Firebase and Google Sign-In.",
    tags: ["Flutter", "Dart", "Firebase"],
    image: `${R2_URL}/dishcovery-banner.avif`,
    video:
      `${siteConfig.cdnUrl}/project/Dishcovery_Product_Launch_Video.mp4`,
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
      "A SaaS ERP platform covering Management, Accounting, and Inventory modules. Built responsive, cross-browser UI with Vue 3, Pinia, Tailwind CSS, and PrimeVue, integrating Flask microservices and real-time SSE role-update notifications.",
    tags: ["Vue.js", "Pinia", "JavaScript", "Tailwind CSS", "Python", "Flask"],
    image: `${R2_URL}/ting-preview.avif`,
    href: "https://ting.id",
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
  {
    title: "Apilogy Admin Dashboard",
    dates: "Feb 2024 – Jul 2024",
    association: "Telkom Indonesia — MSIB Batch 6",
    category: ["private", "web"],
    role: "Frontend Engineer",
    isInternal: true,
    description:
      "Internal admin dashboard for managing users across Apilogy platforms (Developer & Publisher) with RBAC. Built with React, TypeScript, Tailwind CSS, Legion UI, Zustand, TanStack Query, NestJS, and Docker.",
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

const PROJECT_DESCRIPTION_ID: Record<string, string> = {
  "Duwitku App":
    "Aplikasi keuangan pribadi berbasis Flutter untuk mengotomatisasi pencatatan pengeluaran tanpa input manual, dilengkapi scan struk AI (Gemini API), sinkronisasi Supabase, dan integrasi WhatsApp Bot (WAHA).",
  "WBS Public — Whistleblowing System":
    "Sistem WBS publik yang dibangun dari awal dengan Next.js dan Django untuk 1.200+ karyawan, mendukung pelaporan aman (identitas penuh, sebagian, atau anonim), i18n, serta pelacakan status laporan.",
  "WBS Internal — Whistleblowing System":
    "Platform admin dan audit internal berbasis Next.js dan Django untuk 1.200+ karyawan, memusatkan laporan whistleblowing dengan workflow RBAC, audit trail lengkap, dan dashboard monitoring.",
  "PLUSTIX — Pertamina":
    "Modul Shift Management dan Ticket Summary pada platform helpdesk PlusTix Pertamina berbasis Next.js yang menyatukan dashboard analitik operasional SPBU, ekspor laporan, tiket L3, serta insight rating & review.",
  "JSON Polish":
    "Tool modern untuk formatting dan validasi JSON dengan syntax highlighting, diff comparison, auto-fix (quotes, trailing comma, brackets), editor bertab, upload/download file, serta dark/light theme.",
  "LSM - Invoice Receipt Module":
    "Modul Invoice Receipt pada platform Logistic Sourcing Management (LSM) berbasis Nuxt.js dan Django yang memberi tim Finance log invoice vendor terpusat, mudah dicari, dan pelaporan terintegrasi.",
  Dishcovery:
    "Aplikasi mobile Flutter pelestarian kuliner tradisional Indonesia menggunakan pengenalan gambar berbasis Gemini API untuk mengidentifikasi hidangan dan lokasi kuliner terdekat, dengan Firebase dan Google Sign-In.",
  "ManganKu App":
    "Aplikasi Flutter yang memanfaatkan TensorFlow Lite dan Firebase ML untuk mengenali makanan dari foto, lalu menghasilkan informasi nutrisi via Gemini AI serta resep dari MealDB dan YouTube API.",
  "TING.ID SaaS ERP":
    "Platform ERP SaaS untuk modul Management, Accounting, dan Inventory. Dibangun responsif dengan Vue 3, Pinia, Tailwind CSS, PrimeVue, integrasi microservice Flask, serta notifikasi role real-time via SSE.",
  DiabExpert:
    "Sistem pakar berbasis web untuk deteksi dini Diabetes Mellitus tipe 1 dan tipe 2 menggunakan metode Certainty Factor, memproses gejala dan tingkat keyakinan pengguna.",
  "Apilogy Admin Dashboard":
    "Dashboard admin internal untuk manajemen user dan RBAC pada platform Apilogy (Developer & Publisher), dibangun dengan React, TypeScript, Tailwind CSS, Legion UI, Zustand, TanStack Query, NestJS, dan Docker.",
  "Cuisine Cash":
    "Aplikasi kasir restoran berbasis web sebagai proyek capstone individu, dilengkapi manajemen produk, pemrosesan pesanan real-time, dan dashboard laporan penjualan.",
  Agriplant:
    "Aplikasi web yang membantu petani mengelola aktivitas tanam dengan pengingat penyiraman/pemupukan, riwayat tanam, dan pemantauan cuaca untuk pengambilan keputusan yang lebih baik.",
  "Tukangin Landing Page":
    "Landing page responsif untuk marketplace jasa rumah tangga, dikembangkan sebagai tugas Code Competence di Alterra Academy menggunakan React dan Bootstrap.",
}

export function getProjects(language: AppLanguage): ProjectItem[] {
  if (language === "en") {
    return projects
  }

  return projects.map((project) => ({
    ...project,
    description: PROJECT_DESCRIPTION_ID[project.title] ?? project.description,
  }))
}

export const PROJECT_FILTERS = BASE_PROJECT_FILTERS
