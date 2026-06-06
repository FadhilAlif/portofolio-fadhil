import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import HomeClient from "./home-client"

export const metadata: Metadata = {
  title: {
    default: `Home | ${siteConfig.domain}`,
    template: `%s | ${siteConfig.domain}`,
  },
  description: "Personal portfolio of Fadhil Alif Priyatno, a Full-Stack Software Engineer.",
  openGraph: {
    title: `Fadhil Alif Priyatno - Software Engineer`,
    description: "Personal portfolio of Fadhil Alif Priyatno, a Full-Stack Software Engineer.",
    url: siteConfig.url,
    type: "website",
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function Page() {
  return <HomeClient />
}
