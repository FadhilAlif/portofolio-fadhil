import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import ProjectsClient from "./projects-client"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my software development projects including web applications, mobile apps, and AI-powered solutions.",
  openGraph: {
    title: "Projects | Fadhil Alif Priyatno",
    description:
      "Explore my software development projects including web applications, mobile apps, and AI-powered solutions.",
    url: `${siteConfig.url}/projects`,
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `Projects | ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Fadhil Alif Priyatno",
    description:
      "Explore my software development projects including web applications, mobile apps, and AI-powered solutions.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
