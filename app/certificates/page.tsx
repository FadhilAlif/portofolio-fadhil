import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import CertificatesClient from "./certificates-client"

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "View my professional certifications and achievements in software engineering, mobile development, AI, and cloud technology.",
  openGraph: {
    title: "Certificates | Fadhil Alif Priyatno",
    description:
      "View my professional certifications and achievements in software engineering, mobile development, AI, and cloud technology.",
    url: `${siteConfig.url}/certificates`,
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `Certificates | ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificates | Fadhil Alif Priyatno",
    description:
      "View my professional certifications and achievements in software engineering, mobile development, AI, and cloud technology.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${siteConfig.url}/certificates`,
  },
}

export default function CertificatesPage() {
  return <CertificatesClient />
}
