

export default function ProjectsPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground pb-32">
      <header className="flex items-center justify-between border-b border-border px-6 py-3 sticky top-0 bg-background/80 backdrop-blur z-40">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev / projects
        </span>
      </header>

      <main className="flex flex-1 flex-col w-full max-w-5xl mx-auto px-6">
        <section className="flex flex-col pt-20 pb-10 min-h-[70vh]">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Projects</h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            A selection of my recent work and personal experiments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Placeholder Project Cards */}
            <div className="flex flex-col gap-4">
              <div className="aspect-video bg-muted rounded-xl border border-border flex items-center justify-center overflow-hidden relative group">
                <span className="text-muted-foreground transition-transform group-hover:scale-110 duration-500">Project 1 Snapshot</span>
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight">Project Alpha</h3>
                <p className="text-sm text-muted-foreground mt-1">A full-stack web application built with Next.js and Tailwind.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="aspect-video bg-muted rounded-xl border border-border flex items-center justify-center overflow-hidden relative group">
                <span className="text-muted-foreground transition-transform group-hover:scale-110 duration-500">Project 2 Snapshot</span>
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight">Project Beta</h3>
                <p className="text-sm text-muted-foreground mt-1">An open-source library for React UI components.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
