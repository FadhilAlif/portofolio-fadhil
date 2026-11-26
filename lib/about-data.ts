import { type EducationItem } from "@/components/section/education-section"
import { type WorkItem } from "@/components/section/work-section"
import { type SkillCategoryItem } from "@/components/ui/skill-category"
import { type AppLanguage } from "@/lib/i18n/config"
import { siteConfig } from "@/lib/site-config"

const WORK_MEDIA_BASE = `${siteConfig.cdnUrl}/work-avif`
const EDU_MEDIA_BASE = `${siteConfig.cdnUrl}/edu-avif`

export type SkillGroup = {
  title: string
  skills: SkillCategoryItem[]
}

type AboutContent = {
  experiences: WorkItem[]
  educations: EducationItem[]
  skillGroups: SkillGroup[]
}

const SHARED_SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Programming Languages",
    skills: [
      { label: "TypeScript", iconId: "ts" },
      { label: "JavaScript", iconId: "js" },
      { label: "C#", iconId: "cs" },
      { label: "Golang", iconId: "go" },
      { label: "PHP", iconId: "php" },
      { label: "Python", iconId: "python" },
      { label: "Dart", iconId: "dart" },
      { label: "Java", iconId: "java" },
      { label: "C", iconId: "c" },
      { label: "Bash", iconId: "bash" },
      { label: "HTML", iconId: "html" },
      { label: "CSS", iconId: "css" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { label: "React", iconId: "react" },
      { label: "Next.js", iconId: "nextjs" },
      { label: "Vue", iconId: "vue" },
      { label: "Nuxt.js", iconId: "nuxtjs" },
      { label: "Laravel", iconId: "laravel" },
      { label: "Express", iconId: "express" },
      { label: "NestJS", iconId: "nestjs" },
      { label: "Django", iconId: "django" },
      { label: "Flutter", iconId: "flutter" },
      { label: "Flask", iconId: "flask" },
      { label: "Pinia", iconId: "pinia" },
      { label: "Tailwind CSS", iconId: "tailwind" },
      { label: "Material UI", iconId: "mui" },
      { label: "Bootstrap", iconId: "bootstrap" },
      { label: "Three.js", iconId: "threejs" },
      { label: ".NET", iconId: "dotnet" },
    ],
  },
  {
    title: "Databases & ORM",
    skills: [
      { label: "PostgreSQL", iconId: "postgres" },
      { label: "MySQL", iconId: "mysql" },
      { label: "MongoDB", iconId: "mongodb" },
      { label: "Supabase", iconId: "supabase" },
      { label: "Firebase", iconId: "firebase" },
      { label: "Prisma", iconId: "prisma" },
    ],
  },
  {
    title: "Other Tools & Platforms",
    skills: [
      { label: "Node.js", iconId: "nodejs" },
      { label: "Bun", iconId: "bun" },
      { label: "Docker", iconId: "docker" },
      { label: "Git", iconId: "git" },
      { label: "GitHub", iconId: "github" },
      { label: "Linux", iconId: "linux" },
      { label: "Vite", iconId: "vite" },
      { label: "Jest", iconId: "jest" },
      { label: "Postman", iconId: "postman" },
      { label: "Vercel", iconId: "vercel" },
      { label: "Cloudflare", iconId: "cloudflare" },
      { label: "GCP", iconId: "gcp" },
      { label: "Jenkins", iconId: "jenkins" },
      { label: "NPM", iconId: "npm" },
      { label: "VS Code", iconId: "vscode" },
      { label: "Android Studio", iconId: "androidstudio" },
      { label: "Figma", iconId: "figma" },
    ],
  },
]

const englishContent: AboutContent = {
  experiences: [
    {
      company: "TELKOMSIGMA (Telkom Indonesia Subsidiary)",
      location: "Jakarta",
      role: "Junior Full-Stack Engineer",
      start: "Aug 2025",
      description: [
        "Modernized PIS-MARS (Pertamina Information System - Marine Archive & Reporting System), a .NET and Blazor application, by refactoring legacy workflows, REST APIs, database schemas, and UI components, resolving critical workflow issues and improving system reliability.",
        "Developed the Shift Management and Ticket Summary module for the PlusTix Pertamina helpdesk platform using Next.js, consolidating analytics dashboards, exportable reports, and rating & review insights into a single unified view.",
        "Built the Whistleblowing System (WBS) Public and Admin applications from scratch using Next.js and Django, serving 1,200+ employees with i18n, RBAC-based complaint workflows, and full audit trails.",
        "Developed the Invoice Receipt module for the Logistic Sourcing Management (LSM) platform using Nuxt.js and Django, equipping Finance teams with a centralized, searchable vendor invoice log and integrated reporting.",
      ],
      logoUrl: "/assets/company-logo/telkomsigma-icon.jpeg",
      companyUrl: "https://www.telkomsigma.co.id/",
      gallery: [
        {
          id: "telkomsigma-1",
          title: "HUT-17 Telkomsigma",
          description:
            "A celebratory image from the 17th anniversary event, representing company culture and team spirit.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkomsigma-HUT.avif`,
        },
        {
          id: "telkomsigma-2",
          title: "Hari Batik Nasional",
          description:
            "Celebrating the national day of batik, showcasing the cultural heritage and pride.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkomsigma-Hari%20Batik.avif`,
        },
        {
          id: "telkomsigma-3",
          title: "BOD x Telsigers",
          description:
            "Board of Directors meeting with Telsigers, symbolizing leadership engagement and strategic discussions.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkomsigma-Direksi-BOD.avif`,
        },
      ],
    },
    {
      company: "BEKUP (Baparekraf for Startup)",
      location: "Remote",
      role: "Flutter Developer Cohort",
      start: "Jul 2025",
      end: "Nov 2025",
      description: [
        "Selected as one of 100 participants in BEKUP Create 2025, a 5-month upskilling program by the Indonesian Ministry of Creative Economy and Dicoding focused on Flutter development, AI integration, and agile product delivery.",
        "Led a team of 4 to design and ship Dishcovery, a mobile Flutter app preserving Indonesia's traditional culinary heritage using Firebase and Google Sign-In authentication, delivering a functional MVP on schedule.",
        "Applied MVVM architecture, SOLID principles, and GitHub collaborative workflows across a 4-person team while integrating the Gemini API for AI-powered dish recognition.",
      ],
      logoUrl: "/assets/company-logo/bekup-icon.webp",
      companyUrl: "https://www.bekup-ekraf.id/program-bekup-create",
      gallery: [
        {
          id: "bekup-1",
          title: "BEKUP ILT Session",
          description:
            "A snapshot from the Instructor-Led Training (ILT) sessions, highlighting interactive learning and hands-on coding activities.",
          imageUrl: `${WORK_MEDIA_BASE}/BEKUP-Class.avif`,
        },
        {
          id: "bekup-2",
          title: "Dokumen Kelulusan",
          description:
            "Graduation certificate, marking the successful completion of the BEKUP program.",
          imageUrl: `${WORK_MEDIA_BASE}/BEKUP-Kelulusan.avif`,
        },
      ],
    },
    {
      company: "HORUS TECHNOLOGY",
      location: "Yogyakarta",
      role: "Frontend Developer Intern",
      start: "Feb 2025",
      end: "Jul 2025",
      description: [
        "Developed the frontend for 3 ERP modules (Management, Accounting, Inventory) of the TING SaaS platform using Vue 3 and Tailwind CSS, integrating Flask-based microservices via RESTful APIs and managing state with Pinia.",
        "Eliminated page-refresh dependencies for permission changes by implementing real-time role-update notifications via Server-Sent Events (SSE), improving system responsiveness across a multi-role ERP environment.",
        "Translated business requirements into production-ready Vue 3 features by partnering with Backend Engineers and System Analysts in an Agile environment while maintaining modular, clean code.",
      ],
      logoUrl: "/assets/company-logo/horus-icon.png",
      companyUrl: "https://horus.co.id/",
      gallery: [
        {
          id: "horus-1",
          title: "Horus Office",
          description:
            "Horus Technology office environment, representing the workspace and company culture.",
          imageUrl: `${WORK_MEDIA_BASE}/Horus-Office.avif`,
        },
        {
          id: "horus-2",
          title: "Horus Technology Team",
          description:
            "A team photo representing collaboration and team spirit.",
          imageUrl: `${WORK_MEDIA_BASE}/Horus-Technology-Team.avif`,
        },
        {
          id: "horus-3",
          title: "My Farewell with Ting.ID Team",
          description:
            "My internship farewell, celebrating the learning journey and team collaboration.",
          imageUrl: `${WORK_MEDIA_BASE}/Horus-Farewell.avif`,
        },
      ],
    },
    {
      company: "TELKOM INDONESIA",
      location: "Bandung",
      role: "Developer Intern - (MSIB Batch 6)",
      start: "Feb 2024",
      end: "Jul 2024",
      description: [
        "Developed the User Management feature for the Apilogy Admin Dashboard using React, TypeScript, NestJS, and Tailwind CSS with Legion UI, implementing Role-Based Access Control (RBAC) across the internal admin platform.",
        "Improved dashboard responsiveness and developer experience by integrating TanStack Query (data fetching, caching) and Zustand (state management) to reduce redundant API calls, and containerized the app with Docker.",
        "Collaborated in an Agile Scrum environment with mentors, backend engineers, and UI/UX designers to deliver features across sprints.",
      ],
      logoUrl: "/assets/company-logo/telkom-icon.png",
      companyUrl: "https://www.telkom.co.id/",
      gallery: [
        {
          id: "telkom-1",
          title: "Telkom Indonesia",
          description:
            "My picture during the internship, representing my role and experience at Telkom Indonesia.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkom%20Indonesia-Fadhil.avif`,
        },
        {
          id: "telkom-2",
          title: "Daily Scrum Apilogy Team",
          description:
            "One of our daily stand-up meetings, showcasing team communication and alignment.",
          imageUrl: `${WORK_MEDIA_BASE}/Daily-Scrum-Apilogy.avif`,
        },
        {
          id: "telkom-3",
          title: "IndigoHub DBT Office Bandung",
          description:
            "Indigohub co-working space in Bandung, where the internship took place, representing the work environment and company culture.",
          imageUrl: `${WORK_MEDIA_BASE}/Indigohub-DBT.avif`,
        },
      ],
    },
    {
      company: "ALTERRA ACADEMY",
      location: "Remote",
      role: "Frontend Engineer Student - (MSIB Batch 5)",
      start: "Aug 2023",
      end: "Dec 2023",
      description: [
        "Completed the competitive 5-month Alterra Academy Frontend Engineering program (MSIB Batch 5), building multiple production-ready applications with ReactJS, JavaScript, TypeScript, and Tailwind CSS.",
        "Developed Cuisine Cash, a full-featured POS application, implementing product catalog management, cart logic, and transaction history using ReactJS and RESTful API integration.",
        "Collaborated in a cross-functional team to design and develop Agriplant web and mobile, an agricultural tech platform built with React and Axios, applying Scrum methodology and Redux for state management.",
      ],
      logoUrl: "/assets/company-logo/alterra-icon.png",
      companyUrl: "https://www.alterra.id/",
      gallery: [
        {
          id: "alterra-1",
          title: "Farewell Session",
          description:
            "A commemorative visual for the bootcamp's closing ceremony, celebrating the learning journey and cohort achievements.",
          imageUrl: `${WORK_MEDIA_BASE}/Alterra-Farewell.avif`,
        },
      ],
    },
  ],
  educations: [
    {
      institution: "Universitas 'Aisyiyah Yogyakarta",
      location: "Yogyakarta, Indonesia",
      degree: "B.Sc. Information Technology",
      period: "Oct 2021 – Oct 2025",
      gpa: "GPA: 3.84 / 4.00 (Cum Laude)",
      description: [
        "Relevant coursework: Software Engineering, Web & Mobile Development, Database Systems, Computer Networks, Operating Systems, UI/UX Design, Health Information Systems, Enterprise Architecture and Analysis.",
        "Final Thesis: Early Detection Expert System for Diabetes Mellitus using the Certainty Factor (CF) method built with Laravel.",
      ],
      logo: "/assets/company-logo/unisa-icon.webp",
      gallery: [
        {
          id: "unisa-1",
          title: "After Graduation Ceremony",
          description:
            "A photo taken after the graduation ceremony, symbolizing the culmination of academic achievements and the transition to professional life.",
          imageUrl: `${EDU_MEDIA_BASE}/Edu-Cumlaude-Fadhil.avif`,
        },
        {
          id: "unisa-2",
          title: "Graduated with Cum Laude Honors",
          description:
            "A snapshot of the graduation certificate highlighting the Cum Laude distinction, representing academic excellence and dedication.",
          imageUrl: `${EDU_MEDIA_BASE}/Edu-Graduated.avif`,
        },
        {
          id: "unisa-3",
          title: "Graduation Day Celebration",
          description:
            "A celebratory moment during the graduation day, capturing the joy and pride of completing the degree program.",
          imageUrl: `${EDU_MEDIA_BASE}/Edu-Wisuda-Fadhil.avif`,
        },
      ],
    },
  ],
  skillGroups: SHARED_SKILL_GROUPS,
}

const indonesianContent: AboutContent = {
  experiences: [
    {
      company: "TELKOMSIGMA (Telkom Indonesia Subsidiary)",
      location: "Jakarta",
      role: "Junior Full-Stack Engineer",
      start: "Aug 2025",
      description: [
        "Memodernisasi PIS-MARS (Pertamina Information System - Marine Archive & Reporting System) berbasis .NET dan Blazor dengan merefaktor workflow legacy, REST API, skema database, dan komponen UI untuk menyelesaikan kendala kritikal serta meningkatkan keandalan sistem.",
        "Mengembangkan modul Shift Management dan Ticket Summary untuk platform helpdesk PlusTix Pertamina menggunakan Next.js, menyatukan dashboard analitik, laporan yang dapat diekspor, serta insight rating & review dalam satu tampilan terpadu.",
        "Membangun aplikasi Whistleblowing System (WBS) Publik dan Admin dari awal menggunakan Next.js dan Django yang melayani 1.200+ karyawan dengan dukungan i18n, alur pengaduan berbasis RBAC, dan audit trail lengkap.",
        "Mengembangkan modul Invoice Receipt pada platform Logistic Sourcing Management (LSM) menggunakan Nuxt.js dan Django untuk menyediakan log invoice vendor yang terpusat, mudah dicari, dan terintegrasi bagi tim Finance.",
      ],
      logoUrl: "/assets/company-logo/telkomsigma-icon.jpeg",
      companyUrl: "https://www.telkomsigma.co.id/",
      gallery: [
        {
          id: "telkomsigma-1",
          title: "HUT-17 Telkomsigma",
          description:
            "Momen perayaan ulang tahun ke-17 yang merepresentasikan budaya perusahaan dan semangat tim.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkomsigma-HUT.avif`,
        },
        {
          id: "telkomsigma-2",
          title: "Hari Batik Nasional",
          description:
            "Perayaan Hari Batik Nasional yang menampilkan warisan budaya dan kebanggaan nasional.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkomsigma-Hari%20Batik.avif`,
        },
        {
          id: "telkomsigma-3",
          title: "BOD x Telsigers",
          description:
            "Pertemuan Board of Directors bersama Telsigers yang mencerminkan keterlibatan kepemimpinan dan diskusi strategis.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkomsigma-Direksi-BOD.avif`,
        },
      ],
    },
    {
      company: "BEKUP (Baparekraf for Startup)",
      location: "Remote",
      role: "Flutter Developer Cohort",
      start: "Jul 2025",
      end: "Nov 2025",
      description: [
        "Terpilih sebagai salah satu dari 100 peserta BEKUP Create 2025, program upskilling 5 bulan dari Kementerian Ekonomi Kreatif RI dan Dicoding yang berfokus pada pengembangan Flutter, integrasi AI, dan agile product delivery.",
        "Memimpin tim beranggotakan 4 orang untuk merancang dan meluncurkan Dishcovery, aplikasi mobile Flutter pelestarian kuliner tradisional Indonesia menggunakan Firebase dan Google Sign-In hingga MVP fungsional tepat waktu.",
        "Menerapkan arsitektur MVVM, prinsip SOLID, dan workflow kolaboratif GitHub dalam tim 4 orang sekaligus mengintegrasikan Gemini API untuk pengenalan hidangan berbasis AI.",
      ],
      logoUrl: "/assets/company-logo/bekup-icon.webp",
      companyUrl: "https://www.bekup-ekraf.id/program-bekup-create",
      gallery: [
        {
          id: "bekup-1",
          title: "Sesi ILT BEKUP",
          description:
            "Cuplikan sesi Instructor-Led Training (ILT) yang menonjolkan pembelajaran interaktif dan praktik coding langsung.",
          imageUrl: `${WORK_MEDIA_BASE}/BEKUP-Class.avif`,
        },
        {
          id: "bekup-2",
          title: "Dokumen Kelulusan",
          description:
            "Dokumen kelulusan sebagai bukti penyelesaian program BEKUP.",
          imageUrl: `${WORK_MEDIA_BASE}/BEKUP-Kelulusan.avif`,
        },
      ],
    },
    {
      company: "HORUS TECHNOLOGY",
      location: "Yogyakarta",
      role: "Frontend Developer Intern",
      start: "Feb 2025",
      end: "Jul 2025",
      description: [
        "Mengembangkan frontend untuk 3 modul ERP (Management, Accounting, Inventory) pada platform TING SaaS menggunakan Vue 3 dan Tailwind CSS dengan integrasi microservice Flask via RESTful API dan state management Pinia.",
        "Menghilangkan ketergantungan refresh halaman saat perubahan izin akses melalui implementasi notifikasi pembaruan role real-time berbasis Server-Sent Events (SSE).",
        "Menerjemahkan kebutuhan bisnis menjadi fitur Vue 3 siap produksi bersama Backend Engineer dan System Analyst dalam lingkungan Agile dengan standar clean code yang modular.",
      ],
      logoUrl: "/assets/company-logo/horus-icon.png",
      companyUrl: "https://horus.co.id/",
      gallery: [
        {
          id: "horus-1",
          title: "Kantor Horus",
          description:
            "Lingkungan kantor Horus Technology yang merepresentasikan ruang kerja dan budaya perusahaan.",
          imageUrl: `${WORK_MEDIA_BASE}/Horus-Office.avif`,
        },
        {
          id: "horus-2",
          title: "Tim Horus Technology",
          description:
            "Foto tim yang menggambarkan kolaborasi dan semangat kebersamaan.",
          imageUrl: `${WORK_MEDIA_BASE}/Horus-Technology-Team.avif`,
        },
        {
          id: "horus-3",
          title: "Perpisahan Saya bersama Tim Ting.ID",
          description:
            "Momen perpisahan magang yang menandai perjalanan belajar dan kolaborasi tim.",
          imageUrl: `${WORK_MEDIA_BASE}/Horus-Farewell.avif`,
        },
      ],
    },
    {
      company: "TELKOM INDONESIA",
      location: "Bandung",
      role: "Developer Intern - (MSIB Batch 6)",
      start: "Feb 2024",
      end: "Jul 2024",
      description: [
        "Mengembangkan fitur User Management pada Apilogy Admin Dashboard menggunakan React, TypeScript, NestJS, dan Tailwind CSS dengan Legion UI, termasuk implementasi Role-Based Access Control (RBAC).",
        "Meningkatkan responsivitas dashboard dan developer experience dengan mengintegrasikan TanStack Query (data fetching & caching) dan Zustand untuk mengurangi panggilan API berulang, serta kontainerisasi dengan Docker.",
        "Berkolaborasi dalam lingkungan Agile Scrum bersama mentor, backend engineer, dan UI/UX designer untuk menyelesaikan fitur di setiap sprint.",
      ],
      logoUrl: "/assets/company-logo/telkom-icon.png",
      companyUrl: "https://www.telkom.co.id/",
      gallery: [
        {
          id: "telkom-1",
          title: "Telkom Indonesia",
          description:
            "Foto saya selama masa magang yang merepresentasikan peran dan pengalaman di Telkom Indonesia.",
          imageUrl: `${WORK_MEDIA_BASE}/Telkom%20Indonesia-Fadhil.avif`,
        },
        {
          id: "telkom-2",
          title: "Daily Scrum Tim Apilogy",
          description:
            "Salah satu sesi daily stand-up yang menunjukkan komunikasi dan sinkronisasi tim.",
          imageUrl: `${WORK_MEDIA_BASE}/Daily-Scrum-Apilogy.avif`,
        },
        {
          id: "telkom-3",
          title: "Kantor IndigoHub DBT Bandung",
          description:
            "Ruang kerja bersama Indigohub di Bandung tempat magang berlangsung, merepresentasikan lingkungan kerja dan budaya perusahaan.",
          imageUrl: `${WORK_MEDIA_BASE}/Indigohub-DBT.avif`,
        },
      ],
    },
    {
      company: "ALTERRA ACADEMY",
      location: "Remote",
      role: "Frontend Engineer Student - (MSIB Batch 5)",
      start: "Aug 2023",
      end: "Dec 2023",
      description: [
        "Menyelesaikan program Frontend Engineering Alterra Academy selama 5 bulan (MSIB Batch 5) dan membangun beberapa aplikasi siap produksi dengan ReactJS, JavaScript, TypeScript, dan Tailwind CSS.",
        "Mengembangkan Cuisine Cash, aplikasi POS lengkap dengan manajemen katalog produk, logika keranjang, dan riwayat transaksi menggunakan ReactJS serta integrasi RESTful API.",
        "Berkolaborasi dalam tim lintas fungsi merancang dan membangun Agriplant (web & mobile) menggunakan React, Axios, metodologi Scrum, dan Redux untuk state management.",
      ],
      logoUrl: "/assets/company-logo/alterra-icon.png",
      companyUrl: "https://www.alterra.id/",
      gallery: [
        {
          id: "alterra-1",
          title: "Sesi Perpisahan",
          description:
            "Visual kenangan untuk acara penutupan bootcamp yang merayakan perjalanan belajar dan capaian cohort.",
          imageUrl: `${WORK_MEDIA_BASE}/Alterra-Farewell.avif`,
        },
      ],
    },
  ],
  educations: [
    {
      institution: "Universitas 'Aisyiyah Yogyakarta",
      location: "Yogyakarta, Indonesia",
      degree: "S1 Teknologi Informasi",
      period: "Oct 2021 – Oct 2025",
      gpa: "IPK: 3.84 / 4.00 (Cum Laude)",
      description: [
        "Mata kuliah relevan: Rekayasa Perangkat Lunak, Pengembangan Web & Mobile, Sistem Basis Data, Jaringan Komputer, Sistem Operasi, Desain UI/UX, Sistem Informasi Kesehatan, Arsitektur dan Analisis Enterprise.",
        "Skripsi: Sistem pakar deteksi dini Diabetes Mellitus menggunakan metode Certainty Factor (CF) berbasis Laravel.",
      ],
      logo: "/assets/company-logo/unisa-icon.webp",
      gallery: [
        {
          id: "unisa-1",
          title: "Setelah Upacara Wisuda",
          description:
            "Foto setelah wisuda yang melambangkan puncak capaian akademik dan transisi menuju dunia profesional.",
          imageUrl: `${EDU_MEDIA_BASE}/Edu-Cumlaude-Fadhil.avif`,
        },
        {
          id: "unisa-2",
          title: "Lulus dengan Predikat Cum Laude",
          description:
            "Cuplikan sertifikat kelulusan dengan predikat Cum Laude sebagai simbol keunggulan akademik dan dedikasi.",
          imageUrl: `${EDU_MEDIA_BASE}/Edu-Graduated.avif`,
        },
        {
          id: "unisa-3",
          title: "Perayaan Hari Wisuda",
          description:
            "Momen perayaan saat hari wisuda yang menangkap kebahagiaan dan kebanggaan menyelesaikan studi.",
          imageUrl: `${EDU_MEDIA_BASE}/Edu-Wisuda-Fadhil.avif`,
        },
      ],
    },
  ],
  skillGroups: [
    { ...SHARED_SKILL_GROUPS[0], title: "Bahasa Pemrograman" },
    { ...SHARED_SKILL_GROUPS[1], title: "Framework & Library" },
    { ...SHARED_SKILL_GROUPS[2], title: "Database & ORM" },
    { ...SHARED_SKILL_GROUPS[3], title: "Tools & Platform Lainnya" },
  ],
}

const aboutByLanguage: Record<AppLanguage, AboutContent> = {
  en: englishContent,
  id: indonesianContent,
}

export function getAboutData(language: AppLanguage): AboutContent {
  return aboutByLanguage[language] ?? aboutByLanguage.en
}
