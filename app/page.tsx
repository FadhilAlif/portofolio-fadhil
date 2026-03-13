"use client"

import {
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  // PhoneCallIcon,
} from "@phosphor-icons/react"
import { SpotlightBackground } from "@/components/ui/spotlight"
import {
  SkillCategory,
  type SkillCategoryItem,
} from "@/components/ui/skill-category"
import { WorkSection, type WorkItem } from "@/components/section/work-section"
import { PixelImage } from "@/components/icons/pixel-image"
import { FadhilSignatureEffect } from "@/components/ui/apple-hello-effect"

const experiences: WorkItem[] = [
  {
    company: "TELKOMSIGMA",
    location: "Yogyakarta, Indonesia",
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
    logoUrl: "/assets/company-logo/dicoding-icon.png",
    companyUrl: "https://bekup.kemenparekraf.go.id/",
  },
  {
    company: "PT. HORUS TECHNOLOGY",
    location: "Sleman, Yogyakarta",
    role: "Frontend Developer Intern",
    start: "Feb 2025",
    description: [
      "Developed responsive and scalable UI for a SaaS ERP platform (Management, Accounting, Inventory) using Vue, Pinia, and Tailwind CSS.",
      "Integrated frontend features with RESTful APIs and implemented JWT authentication, real-time role updates, and notifications via SSE.",
      "Worked closely with Backend Engineers and System Analysts in an Agile environment to translate business requirements into production-ready features while maintaining clean code standards.",
    ],
    logoUrl: "/assets/company-logo/horus-icon.png",
    companyUrl: "https://horus.co.id/",
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
  },
]

const educations = [
  {
    institution: "UNIVERSITAS 'AISYIYAH YOGYAKARTA",
    location: "Yogyakarta, Indonesia",
    degree: "Undergraduate Information Technology",
    period: "Oct 2021 - Oct 2025",
    gpa: "3.84/4.00 (Cum Laude)",
    description: [
      "Relevant Coursework : Software Engineering, Web & Mobile Development, Database Systems, Computer Networks, Operating Systems, UI/UX Design, Health Information Systems, Enterprise Architecture and Analysis and Others.",
      "Final Thesis : Early Detection Expert System for Diabetes Mellitus Using the Certainty Factor (CF) Method Based on Laravel",
    ],
    logo: "https://placehold.co/100x100/png",
  },
]

type SkillGroup = {
  title: string
  skills: SkillCategoryItem[]
}

const skillGroups: SkillGroup[] = [
  {
    title: "Programming Languages",
    skills: [
      { label: "JavaScript", iconId: "js" },
      { label: "TypeScript", iconId: "ts" },
      { label: "Dart", iconId: "dart" },
      { label: "Golang", iconId: "go" },
      { label: "Java", iconId: "java" },
      { label: "PHP", iconId: "php" },
      { label: "C", iconId: "c" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { label: "React", iconId: "react" },
      { label: "Next.js", iconId: "nextjs" },
      { label: "Vue", iconId: "vue" },
      { label: "Nuxt.js", iconId: "nuxtjs" },
      { label: "Flutter", iconId: "flutter" },
      { label: "HTML", iconId: "html" },
      { label: "CSS", iconId: "css" },
      { label: "Tailwind CSS", iconId: "tailwind" },
      { label: "Bootstrap", iconId: "bootstrap" },
      { label: "Express", iconId: "express" },
      { label: "NestJS", iconId: "nestjs" },
      { label: "Flask", iconId: "flask" },
      { label: "Pinia", iconId: "pinia" },
      { label: "vite", iconId: "vite" },
      // { label: "RESTful APIs", iconId: null },
      // { label: "Fiber", iconId: null },
      // { label: "Zustand", iconId: null },
      // { label: "TanStack Query", iconId: null },
    ],
  },
  {
    title: "Databases",
    skills: [
      { label: "PostgreSQL", iconId: "postgres" },
      { label: "MySQL", iconId: "mysql" },
      { label: "MongoDB", iconId: "mongodb" },
      { label: "Firebase", iconId: "firebase" },
      { label: "Supabase", iconId: "supabase" },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { label: "Git", iconId: "git" },
      { label: "GitHub", iconId: "github" },
      { label: "Docker", iconId: "docker" },
      { label: "Postman", iconId: "postman" },
      { label: "Figma", iconId: "figma" },
      { label: "Jenkins", iconId: "jenkins" },
      { label: "Vercel", iconId: "vercel" },
      // { label: "Trello", iconId: null },
      // { label: "Canva", iconId: null },
    ],
  },
]

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background pb-32 text-foreground">
      <SpotlightBackground
        className="fixed inset-0 z-0 bg-background"
        colors={["rgba(120, 119, 198, 0.35)", "rgba(59, 130, 246, 0.25)"]}
        ambient={true}
      />
      {/* <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev
        </span>
      </header> */}

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        {/* Hero & About Section */}
        <section className="relative mt-4 mb-8 flex w-full flex-col border-b border-border/50 py-12 md:py-20">
          <div className="relative z-10 flex min-h-[40vh] flex-col-reverse justify-center gap-12 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col text-center md:text-left">
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                FADHIL ALIF PRIYATNO
              </h1>
              <h2 className="mb-6 text-xl font-medium text-primary/80 md:text-2xl">
                Full-Stack Engineer
              </h2>

              <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground md:justify-start lg:text-base">
                <span className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                  <MapPinIcon className="h-4 w-4" /> Bantul, Yogyakarta
                </span>
                {/*<a
                  href="tel:+6285727304551"
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <PhoneCallIcon className="h-4 w-4" /> +62 85727304551
                </a>*/}
                <a
                  href="mailto:fadhil.alifp@gmail.com"
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <EnvelopeIcon className="h-4 w-4" /> fadhil.alifp@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/fadhilalifpriyatno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <LinkedinLogoIcon className="h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="https://github.com/fadhilalif"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <GithubLogoIcon className="h-4 w-4" /> Github
                </a>
              </div>

              <div className="prose dark:prose-invert mx-auto max-w-2xl leading-relaxed text-muted-foreground md:mx-0 lg:text-lg">
                <p>
                  Fresh Graduate in Information Technology currently working as
                  a Full-Stack Engineer at Telkomsigma, a subsidiary of PT
                  Telkom Indonesia. Experienced in building enterprise systems
                  and scalable web and mobile applications using modern frontend
                  and backend technologies. Strong in Agile collaboration,
                  cross-functional teamwork, and delivering secure, reliable,
                  and user-focused digital solutions.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-center gap-6">
              <div className="relative flex h-72 w-56 rotate-2 transform items-center justify-center overflow-hidden rounded-[2rem] border-[6px] border-background bg-background shadow-xl ring-1 ring-border/50 transition-transform duration-300 hover:rotate-0 md:h-80 md:w-64 lg:h-90 lg:w-70">
                <PixelImage
                  src="/assets/fadhil-photo-profie.png"
                  grid="8x8"
                  className="h-full w-full object-cover grayscale-0"
                  grayscaleAnimation={true}
                  pixelFadeInDuration={800}
                />
              </div>
              <FadhilSignatureEffect
                className="h-20 pb-4 text-foreground/80 md:h-24"
                speed={1.2}
              />
            </div>
          </div>
        </section>

        {/* Dynamic Content Columns */}
        <div className="mt-12 grid w-full grid-cols-1 gap-12">
          {/* Experience Section */}
          <section className="flex w-full flex-col gap-6">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              Experience
            </h3>
            <WorkSection items={experiences} />
          </section>

          {/* Education Section */}
          <section className="flex w-full flex-col gap-6 border-t border-border pt-12">
            <h3 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
              Education
            </h3>
            <div className="mt-4 flex flex-col gap-8">
              {educations.map((edu, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col gap-4 sm:flex-row"
                >
                  <div className="shrink-0 pt-1">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border shadow-sm transition-colors group-hover:border-primary/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={edu.logo}
                        alt={`${edu.institution} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="mb-1 flex flex-col gap-y-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">
                          {edu.institution}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            {edu.degree}
                          </span>
                          <span className="hidden text-sm text-muted-foreground sm:inline">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {edu.location}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium whitespace-nowrap text-muted-foreground">
                        {edu.period}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-foreground">
                      {edu.gpa}
                    </div>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {edu.description.map((desc, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1 text-primary/50">•</span>
                          <span className="leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="flex w-full flex-col gap-6 border-t border-border pt-12">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                Skills
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A selection of tools, languages, and frameworks I use to build
                digital solutions.
              </p>
            </div>
            <div className="mt-2 flex flex-col divide-y divide-border/50">
              {skillGroups.map((group) => (
                <SkillCategory
                  key={group.title}
                  title={group.title}
                  skills={group.skills}
                  perLine={12}
                  className="py-6 first:pt-0 last:pb-0"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
