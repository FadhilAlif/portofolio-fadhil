import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hubungi Fadhil Alif Priyatno (Fadhil Dev) untuk kolaborasi proyek web, mobile, dan full-stack engineering.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Fadhil Dev",
    description:
      "Mari terhubung dengan Fadhil Alif Priyatno untuk peluang kolaborasi profesional.",
    url: "https://fadhildev.my.id/contact",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
