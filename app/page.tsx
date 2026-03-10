import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev
        </span>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium tracking-tight">Fadhil Alif</h1>
          <p className="text-sm text-muted-foreground">
            Full-stack developer · Building things for the web
          </p>
        </div>

        <div className="flex flex-col gap-1 rounded-none border border-border bg-card px-6 py-4 text-left text-xs text-muted-foreground">
          <p>
            Press{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              d
            </kbd>{" "}
            to toggle dark / light mode
          </p>
          <p>Or click the icon in the top-right corner.</p>
          <p className="mt-1 text-[10px] opacity-60">
            Powered by View Transitions API · circular animation from click
            origin
          </p>
        </div>
      </main>
    </div>
  )
}
