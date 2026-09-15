import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import HomeClient from "./home-client"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Personal portfolio of Fadhil Alif Priyatno, a Full-Stack Software Engineer specializing in scalable web applications, mobile apps, and AI integrations.",
  openGraph: {
    title: `Fadhil Alif Priyatno - Software Engineer`,
    description:
      "Personal portfolio of Fadhil Alif Priyatno, a Full-Stack Software Engineer specializing in scalable web applications, mobile apps, and AI integrations.",
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Software Engineer Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Fadhil Alif Priyatno - Software Engineer`,
    description:
      "Personal portfolio of Fadhil Alif Priyatno, a Full-Stack Software Engineer specializing in scalable web applications, mobile apps, and AI integrations.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function Page() {
  return <HomeClient />
}
