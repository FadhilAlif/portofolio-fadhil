import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Sertifikasi dan pencapaian profesional Fadhil Alif Priyatno (Fadhil Dev) dalam pengembangan software.",
  alternates: {
    canonical: "/certificates",
  },
  openGraph: {
    title: "Certificates | Fadhil Dev",
    description:
      "Lihat sertifikasi dan pencapaian terbaru Fadhil Alif Priyatno di bidang teknologi.",
    url: "https://fadhildev.my.id/certificates",
  },
}

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
