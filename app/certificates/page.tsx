

export default function CertificatesPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground pb-32">
      <header className="flex items-center justify-between border-b border-border px-6 py-3 sticky top-0 bg-background/80 backdrop-blur z-40">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev / certificates
        </span>
      </header>

      <main className="flex flex-1 flex-col w-full max-w-5xl mx-auto px-6">
        <section className="flex flex-col pt-20 pb-10 min-h-[70vh]">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Certificates</h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            My professional certifications and awards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors flex flex-col gap-2">
              <h3 className="font-medium">Frontend Developer Certification</h3>
              <p className="text-sm text-muted-foreground">FreeCodeCamp</p>
              <div className="pt-4 border-t border-border mt-auto">
                <span className="text-xs text-muted-foreground">Issued: 2022</span>
              </div>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors flex flex-col gap-2">
              <h3 className="font-medium">AWS Certified Cloud Practitioner</h3>
              <p className="text-sm text-muted-foreground">Amazon Web Services</p>
              <div className="pt-4 border-t border-border mt-auto">
                <span className="text-xs text-muted-foreground">Issued: 2023</span>
              </div>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors flex flex-col gap-2">
              <h3 className="font-medium">React Advanced Patterns</h3>
              <p className="text-sm text-muted-foreground">Frontend Masters</p>
              <div className="pt-4 border-t border-border mt-auto">
                <span className="text-xs text-muted-foreground">Issued: 2024</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
