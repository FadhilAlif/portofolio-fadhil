

export default function ContactPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground pb-32">
      <header className="flex items-center justify-between border-b border-border px-6 py-3 sticky top-0 bg-background/80 backdrop-blur z-40">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev / contact
        </span>
      </header>

      <main className="flex flex-1 flex-col w-full max-w-5xl mx-auto px-6">
        <section className="flex flex-col pt-20 pb-10 min-h-[70vh]">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Contact</h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Want to work together? I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Email</span>
                <a href="mailto:hello@fadhil.dev" className="text-lg hover:text-primary transition-colors">hello@fadhil.dev</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Socials</span>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                  <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border flex items-center justify-center min-h-[250px]">
              <p className="text-muted-foreground italic text-center">
                (A contact form could go here)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
