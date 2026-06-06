import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import CertificatesClient from "./certificates-client"

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "View my professional certifications and achievements in software development and technology.",
  openGraph: {
    title: "Certificates | Fadhil Alif Priyatno",
    description:
      "View my professional certifications and achievements in software development and technology.",
    url: `${siteConfig.url}/certificates`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/certificates`,
  },
}

export default function CertificatesPage() {
  return <CertificatesClient />
}
