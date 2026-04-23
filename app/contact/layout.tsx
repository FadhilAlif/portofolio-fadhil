import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Fadhil Alif Priyatno for collaborations, projects, or opportunities.",
  openGraph: {
    title: "Contact | Fadhil Alif Priyatno",
    description:
      "Get in touch with Fadhil Alif Priyatno for collaborations, projects, or opportunities.",
    url: "https://fadhildev.my.id/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://fadhildev.my.id/contact",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
