import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my software development projects including web applications, mobile apps, and more.",
  openGraph: {
    title: "Projects | Fadhil Alif Priyatno",
    description:
      "Explore my software development projects including web applications, mobile apps, and more.",
    url: "https://fadhildev.my.id/projects",
    type: "website",
  },
  alternates: {
    canonical: "https://fadhildev.my.id/projects",
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
