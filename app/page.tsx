

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground pb-32">
      <header className="flex items-center justify-between border-b border-border px-6 py-3 sticky top-0 bg-background/80 backdrop-blur z-40">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          fadhil.dev
        </span>
      </header>

      <main className="flex flex-1 flex-col w-full max-w-5xl mx-auto px-6">
        
        {/* About Section (Root Page) */}
        <section className="flex flex-col pt-20 pb-10">
          
          <div className="flex flex-col justify-center min-h-[50vh]">
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">Fadhil Alif</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Full-stack developer · Building things for the web
            </p>
            <div className="prose dark:prose-invert max-w-3xl text-muted-foreground">
              <p>
                Hello! I am Fadhil, a passionate developer with experience in React, Next.js, and modern web technologies.
                My goal is to create beautiful, performant, and accessible user experiences. I love crafting logic and
                building robust architectures out of code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 w-full">
             {/* Skills */}
             <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-medium tracking-tight text-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium border border-border">React</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium border border-border">Next.js</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium border border-border">TypeScript</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium border border-border">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium border border-border">Node.js</span>
                </div>
             </div>

             {/* Experience */}
             <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-medium tracking-tight text-foreground">Experience</h3>
                <div className="flex flex-col gap-6 mt-2">
                  <div className="flex flex-col border-l-2 border-primary/50 pl-4 relative">
                    <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1"></div>
                    <span className="text-sm text-muted-foreground">2023 - Present</span>
                    <h4 className="font-medium mt-1 text-foreground">Full-stack Developer</h4>
                    <span className="text-sm text-muted-foreground">Tech Company</span>
                  </div>
                </div>
             </div>

             {/* Education */}
             <div className="flex flex-col gap-4 md:col-span-2">
                <h3 className="text-2xl font-medium tracking-tight text-foreground">Education</h3>
                <div className="flex flex-col border-l-2 border-primary/50 pl-4 relative mt-2">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1"></div>
                  <span className="text-sm text-muted-foreground">2019 - 2023</span>
                  <h4 className="font-medium mt-1 text-foreground">Bachelor of Computer Science</h4>
                  <span className="text-sm text-muted-foreground">University Name</span>
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  )
}
