import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import ProjectsClient from "./projects-client"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my software development projects including web applications, mobile apps, and more.",
  openGraph: {
    title: "Projects | Fadhil Alif Priyatno",
    description:
      "Explore my software development projects including web applications, mobile apps, and more.",
    url: `${siteConfig.url}/projects`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
