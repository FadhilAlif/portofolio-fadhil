"use client"

import {
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  PhoneCallIcon,
} from "@phosphor-icons/react"

const experiences = [
  {
    company: "TELKOMSIGMA",
    location: "Yogyakarta, Indonesia",
    role: "Full-Stack Engineer",
    period: "Aug 2025 - Present",
    description: [
      "Developed and enhanced enterprise web applications within internal platforms, including the Logistic Sourcing Management (LSM) and Whistleblowing System (WBS) modules, supporting secure, structured, and auditable business processes.",
      "Built and maintained responsive user interfaces with robust form validation, multilingual support, and seamless REST API integration to improve usability and reporting accuracy.",
      "Implemented secure authentication, role-based access control, and data handling mechanisms aligned with enterprise security standards.",
      "Collaborated with cross-functional teams under Agile practices to deliver scalable and maintainable solutions.",
    ],
    logo: "https://placehold.co/100x100/png",
  },
  {
    company: "BEKUP - Baparekraf for Startup",
    location: "Remote",
    role: "Flutter Developer Cohort",
    period: "Jul 2025 - Oct 2025",
    description: [
      "Participated in an intensive national upskilling bootcamp focused on cross-platform mobile application development using Flutter and Dart.",
      "Implemented AI-powered features by integrating Gemini API and Firebase ML to enhance application intelligence.",
      "Applied software engineering best practices including SOLID principles, MVVM architecture, and Git/GitHub workflows.",
      "Led the Capstone Project team, collaborating with mentors and peers to design, develop, and test a functional MVP.",
    ],
    logo: "https://placehold.co/100x100/png",
  },
  {
    company: "PT. HORUS TECHNOLOGY",
    location: "Sleman, Yogyakarta",
    role: "Frontend Developer Intern",
    period: "Feb 2025 - Present",
    description: [
      "Developed responsive and scalable UI for a SaaS ERP platform (Management, Accounting, Inventory) using Vue, Pinia, and Tailwind CSS.",
      "Integrated frontend features with RESTful APIs and implemented JWT authentication, real-time role updates, and notifications via SSE.",
      "Worked closely with Backend Engineers and System Analysts in an Agile environment to translate business requirements into production-ready features while maintaining clean code standards.",
    ],
    logo: "https://placehold.co/100x100/png",
  },
  {
    company: "TELKOM INDONESIA (MSIB Batch 6)",
    location: "Bandung, Jawa Barat",
    role: "Developer Intern",
    period: "Feb 2024 - Jun 2024",
    description: [
      "Developed the Apilogy Admin Dashboard using React, TypeScript, and Tailwind CSS, focusing on user management and performance optimization.",
      "Integrated Docker for containerized deployment, Zustand for state management, and TanStack Query for efficient data fetching.",
      "Collaborated within an Agile Scrum team to improve system reliability, performance, and maintainability.",
    ],
    logo: "https://placehold.co/100x100/png",
  },
  {
    company: "ALTERRA ACADEMY (MSIB Batch 5)",
    location: "Remote",
    role: "Front-End Engineer - Studi Independen",
    period: "Aug 2023 - Dec 2023",
    description: [
      "Completed a 4.5-month intensive training program in HTML, CSS, JavaScript, and React.js, resulting in multiple production-ready applications.",
      "Developed the Cuisine Cash cashier application as an individual project and collaborated on the Agriplant project with cross-functional teams.",
      "Strengthened teamwork, communication, and problem-solving skills within a collaborative Agile learning environment.",
    ],
    logo: "https://placehold.co/100x100/png",
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

export default function Page() {
  const skillIconsOptions =
    "js,ts,dart,go,java,php,c,react,nextjs,vue,nuxtjs,flutter,html,css,tailwind,bootstrap,express,nestjs,flask,postgres,mysql,mongodb,git,github,docker,firebase,supabase,postman,figma"

  return (
    <div className="relative flex min-h-svh flex-col bg-background pb-32 text-foreground">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
        {/* Hero & About Section */}
        <section className="flex flex-col border-b border-border pt-20 pb-10">
          <div className="flex min-h-[40vh] flex-col justify-center">
            <h1 className="mb-2 text-4xl font-semibold tracking-tight md:text-5xl">
              FADHIL ALIF PRIYATNO
            </h1>
            <h2 className="mb-6 text-2xl font-medium text-muted-foreground md:text-3xl">
              Full-Stack Engineer
            </h2>

            <div className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <MapPinIcon className="h-4 w-4" /> Bantul, Yogyakarta
              </span>
              <a
                href="tel:+6285727304551"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <PhoneCallIcon className="h-4 w-4" /> +62 85727304551
              </a>
              <a
                href="mailto:fadhil.alifp@gmail.com"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <EnvelopeIcon className="h-4 w-4" /> fadhil.alifp@gmail.com
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <LinkedinLogoIcon className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <GithubLogoIcon className="h-4 w-4" /> Github
              </a>
            </div>

            <div className="prose dark:prose-invert max-w-3xl leading-relaxed text-muted-foreground">
              <p>
                Fresh Graduate in Information Technology currently working as a
                Full-Stack Engineer at Telkomsigma, a subsidiary of PT Telkom
                Indonesia. Experienced in building enterprise systems and
                scalable web and mobile applications using modern frontend and
                backend technologies. Strong in Agile collaboration,
                cross-functional teamwork, and delivering secure, reliable, and
                user-focused digital solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Content Columns */}
        <div className="mt-12 grid w-full grid-cols-1 gap-12">
          {/* Experience Section */}
          <section className="flex w-full flex-col gap-6">
            <h3 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
              Experience
            </h3>
            <div className="mt-4 flex flex-col gap-8">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col gap-4 sm:flex-row"
                >
                  <div className="shrink-0 pt-1">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border shadow-sm transition-colors group-hover:border-primary/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="mb-1 flex flex-col gap-y-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">
                          {exp.role}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            {exp.company}
                          </span>
                          <span className="hidden text-sm text-muted-foreground sm:inline">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {exp.location}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium whitespace-nowrap text-muted-foreground">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {exp.description.map((desc, i) => (
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
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              Skills
            </h3>
            <p className="text-sm text-muted-foreground">
              A selection of tools, languages, and frameworks I use to build
              digital solutions.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {/* Light Theme Icons */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mx-auto w-full max-w-3xl md:mx-0 dark:hidden"
                src={`https://skillicons.dev/icons?i=${skillIconsOptions}&theme=light&perline=12`}
                alt="Skills Icons"
              />
              {/* Dark Theme Icons */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mx-auto hidden w-full max-w-3xl md:mx-0 dark:block"
                src={`https://skillicons.dev/icons?i=${skillIconsOptions}&theme=dark&perline=12`}
                alt="Skills Icons"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
