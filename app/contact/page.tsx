import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import ContactClient from "./contact-client"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Fadhil Alif Priyatno for collaborations, projects, or opportunities.",
  openGraph: {
    title: "Contact | Fadhil Alif Priyatno",
    description:
      "Get in touch with Fadhil Alif Priyatno for collaborations, projects, or opportunities.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
}

export default function ContactPage() {
  return <ContactClient />
}
