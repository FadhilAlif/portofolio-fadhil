import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Proyek pilihan Fadhil Alif Priyatno (Fadhil Dev) mencakup web, mobile, dan enterprise systems.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Fadhil Dev",
    description:
      "Eksplorasi proyek terbaru dari Fadhil Alif Priyatno di web, mobile, dan sistem enterprise.",
    url: "https://fadhildev.my.id/projects",
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
