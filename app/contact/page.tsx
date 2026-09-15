import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import ContactClient from "./contact-client"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Fadhil Alif Priyatno for software engineering collaborations, project inquiries, or full-time opportunities.",
  openGraph: {
    title: "Contact | Fadhil Alif Priyatno",
    description:
      "Get in touch with Fadhil Alif Priyatno for software engineering collaborations, project inquiries, or full-time opportunities.",
    url: `${siteConfig.url}/contact`,
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `Contact | ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Fadhil Alif Priyatno",
    description:
      "Get in touch with Fadhil Alif Priyatno for software engineering collaborations, project inquiries, or full-time opportunities.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
}

export default function ContactPage() {
  return <ContactClient />
}
