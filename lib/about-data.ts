import { type EducationItem } from "@/components/section/education-section"
import { type WorkItem } from "@/components/section/work-section"
import { type SkillCategoryItem } from "@/components/ui/skill-category"

const WORK_MEDIA_BASE = "https://cdn.fadhildev.my.id/work-avif"
const EDU_MEDIA_BASE = "https://cdn.fadhildev.my.id/edu-avif"

export const experiences: WorkItem[] = [
  {
    company: "TELKOMSIGMA (Telkom Indonesia Subsidiary)",
    location: "Yogyakarta",
    role: "Full-Stack Engineer",
    start: "Aug 2025",
    description: [
      "Developed and enhanced enterprise web applications within internal platforms, including the Logistic Sourcing Management (LSM) and Whistleblowing System (WBS) modules, supporting secure, structured, and auditable business processes.",
      "Built and maintained responsive user interfaces with robust form validation, multilingual support, and seamless REST API integration to improve usability and reporting accuracy.",
      "Implemented secure authentication, role-based access control, and data handling mechanisms aligned with enterprise security standards.",
      "Collaborated with cross-functional teams under Agile practices to deliver scalable and maintainable solutions.",
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
    end: "Oct 2025",
    description: [
      "Participated in an intensive national upskilling bootcamp focused on cross-platform mobile application development using Flutter and Dart.",
      "Implemented AI-powered features by integrating Gemini API and Firebase ML to enhance application intelligence.",
      "Applied software engineering best practices including SOLID principles, MVVM architecture, and Git/GitHub workflows.",
      "Led the Capstone Project team, collaborating with mentors and peers to design, develop, and test a functional MVP.",
    ],
    logoUrl: "/assets/company-logo/bekup-icon.webp",
    companyUrl: "https://bekup.kemenparekraf.go.id/",
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
    location: "Sleman, Yogyakarta",
    role: "Frontend Developer Intern",
    start: "Feb 2025",
    end: "Jul 2025",
    description: [
      "Developed responsive and scalable UI for a SaaS ERP platform (Management, Accounting, Inventory) using Vue, Pinia, and Tailwind CSS.",
      "Integrated frontend features with RESTful APIs and implemented JWT authentication, real-time role updates, and notifications via SSE.",
      "Worked closely with Backend Engineers and System Analysts in an Agile environment to translate business requirements into production-ready features while maintaining clean code standards.",
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
        description: "A team photo representing collaboration and team spirit.",
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
    location: "Bandung, Jawa Barat",
    role: "Developer Intern - (MSIB Batch 6)",
    start: "Feb 2024",
    end: "Jun 2024",
    description: [
      "Developed the Apilogy Admin Dashboard using React, TypeScript, and Tailwind CSS, focusing on user management and performance optimization.",
      "Integrated Docker for containerized deployment, Zustand for state management, and TanStack Query for efficient data fetching.",
      "Collaborated within an Agile Scrum team to improve system reliability, performance, and maintainability.",
    ],
    logoUrl: "/assets/company-logo/telkom-icon.png",
    companyUrl: "https://www.telkom.co.id/",
    gallery: [
      {
        id: "telkom-1",
        title: "Telkom Indonesia Fadhil",
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
    role: "Front-End Engineer - (MSIB Batch 5)",
    start: "Aug 2023",
    end: "Dec 2023",
    description: [
      "Completed a 4.5-month bootcamp program in HTML, CSS, JavaScript, and React.js, resulting in multiple production-ready applications.",
      "Developed the Cuisine Cash cashier application as an individual project and collaborated on the Agriplant project with cross-functional teams.",
      "Strengthened teamwork, communication, and problem-solving skills within a collaborative Agile learning environment.",
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
]

export const educations: EducationItem[] = [
  {
    institution: "Universitas 'Aisyiyah Yogyakarta",
    location: "Yogyakarta, Indonesia",
    degree: "B.Sc. Information Technology",
    period: "Oct 2021 – Oct 2025",
    gpa: "GPA: 3.84 / 4.00 (Cum Laude)",
    description: [
      "Relevant coursework: Software Engineering, Web & Mobile Development, Database Systems, Computer Networks, Operating Systems, UI/UX Design, Health Information Systems, Enterprise Architecture.",
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
]

export type SkillGroup = {
  title: string
  skills: SkillCategoryItem[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming Languages",
    skills: [
      { label: "TypeScript", iconId: "ts" },
      { label: "JavaScript", iconId: "js" },
      { label: "Golang", iconId: "go" },
      { label: "PHP", iconId: "php" },
      { label: "Python", iconId: "python" },
      { label: "Dart", iconId: "dart" },
      { label: "Java", iconId: "java" },
      { label: "C", iconId: "c" },
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
      { label: "Flutter", iconId: "flutter" },
      { label: "Flask", iconId: "flask" },
      { label: "Pinia", iconId: "pinia" },
      { label: "Tailwind CSS", iconId: "tailwind" },
      { label: "Material UI", iconId: "mui" },
      { label: "Bootstrap", iconId: "bootstrap" },
      { label: "Three.js", iconId: "threejs" },
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

// ─── About Code (for CodeEditor) ────────────────────────────────────────────

// export const aboutCode = `// about-me.ts — Fadhil Alif Priyatno

// const aboutFadhil = {
//   name: "Fadhil Alif Priyatno",
//   role: "Full-Stack Engineer",
//   location: "Yogyakarta",
//   education: {
//     degree: "B.Sc. Information Technology",
//     university: "Universitas 'Aisyiyah Yogyakarta",
//     gpa: "3.84 / 4.00 (Cum Laude)",
//   },
//   currentCompany: "Telkomsigma (Telkom Indonesia Subsidiary)",
//   skills: {
//     languages: ["TypeScript", "JavaScript", "Dart", "Go", "PHP"],
//     frontend: ["React", "Next.js", "Vue", "Nuxt.js", "Tailwind CSS"],
//     backend: ["Express", "NestJS", "Flask", "Laravel"],
//     mobile: ["Flutter", "Firebase ML"],
//     databases: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"],
//     tools: ["Docker", "Git", "Figma", "Jenkins", "Vercel"],
//   },
//   contact: {
//     email: "fadhil.alifp@gmail.com",
//     linkedin: "linkedin.com/in/fadhilalifpriyatno",
//     github: "github.com/fadhilalif",
//   },
// }

// export default aboutFadhil`
