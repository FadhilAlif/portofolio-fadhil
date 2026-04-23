import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "View my professional certifications and achievements in software development and technology.",
  openGraph: {
    title: "Certificates | Fadhil Alif Priyatno",
    description:
      "View my professional certifications and achievements in software development and technology.",
    url: "https://fadhildev.my.id/certificates",
    type: "website",
  },
  alternates: {
    canonical: "https://fadhildev.my.id/certificates",
  },
}

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
