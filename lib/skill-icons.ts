// ─── Skill Icons Map ──────────────────────────────────────────────────────────
// Maps tag strings (lowercase) → skillicons.dev slug
// Full slug list: https://skillicons.dev
// Tags not in this map → fallback to text badge in TechIcon component
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_SLUG_MAP: Readonly<Record<string, string>> = {
  // ── Languages ───────────────────────────────────────────────────────────────
  javascript: "js",
  js: "js",
  typescript: "ts",
  ts: "ts",
  dart: "dart",
  python: "py",
  php: "php",
  kotlin: "kotlin",
  swift: "swift",
  go: "go",
  golang: "go",
  rust: "rust",
  java: "java",
  "c#": "cs",
  "c++": "cpp",
  c: "c",

  // ── Frontend ─────────────────────────────────────────────────────────────────
  react: "react",
  "react.js": "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  vue: "vue",
  "vue.js": "vue",
  "vue.js 3": "vue",
  nuxt: "nuxt",
  "nuxt.js": "nuxtjs",
  nuxtjs: "nuxtjs",
  angular: "angular",
  svelte: "svelte",
  astro: "astro",
  remix: "remix",
  gatsby: "gatsby",
  "tailwind css": "tailwind",
  tailwindcss: "tailwind",
  tailwind: "tailwind",
  bootstrap: "bootstrap",
  html: "html",
  css: "css",
  sass: "sass",
  sass_scss: "sass",
  vite: "vite",
  webpack: "webpack",
  rollup: "rollupjs",
  jquery: "jquery",
  alpinejs: "alpinejs",
  htmx: "htmx",
  "styled-components": "styledcomponents",
  "material-ui": "materialui",

  // ── Backend ──────────────────────────────────────────────────────────────────
  "node.js": "nodejs",
  nodejs: "nodejs",
  "express.js": "express",
  express: "express",
  nestjs: "nestjs",
  laravel: "laravel",
  django: "django",
  blade: "laravel", // Blade is Laravel templating, use Laravel icon
  fastapi: "fastapi",
  flask: "flask",
  spring: "spring",
  ruby: "ruby",
  rails: "rails",
  pinia: "pinia",

  // ── Mobile ───────────────────────────────────────────────────────────────────
  flutter: "flutter",

  // ── Database / Backend Services ──────────────────────────────────────────────
  mysql: "mysql",
  postgresql: "postgres",
  postgres: "postgres",
  mongodb: "mongodb",
  sqlite: "sqlite",
  redis: "redis",
  supabase: "supabase",
  firebase: "firebase",
  dynamodb: "dynamodb",
  planetscale: "planetscale",
  prisma: "prisma",
  sequelize: "sequelize",
  graphql: "graphql",

  // ── ML / AI ──────────────────────────────────────────────────────────────────
  tensorflow: "tensorflow",
  "tensorflow lite": "tensorflow",
  pytorch: "pytorch",
  opencv: "opencv",

  // ── DevOps / Tools ───────────────────────────────────────────────────────────
  docker: "docker",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  kubernetes: "kubernetes",
  nginx: "nginx",
  aws: "aws",
  gcp: "gcp",
  azure: "azure",
  vercel: "vercel",
  netlify: "netlify",
  postman: "postman",
  linux: "linux",
  bash: "bash",
  jenkins: "jenkins",

  // ── Design ───────────────────────────────────────────────────────────────────
  figma: "figma",
  xd: "xd",
}

/**
 * Returns the skillicons.dev slug for a given tech tag.
 * Normalizes the tag to lowercase for lookup.
 * Returns `null` if no matching slug is found — use a text fallback.
 */
export function getSkillSlug(tag: string): string | null {
  return SKILL_SLUG_MAP[tag.toLowerCase().trim()] ?? null
}

/**
 * Returns the full URL for a skillicons.dev icon SVG.
 * Supports theme switching (light/dark).
 */
export function getSkillIconUrl(slug: string, theme: "light" | "dark" = "light"): string {
  return `https://skillicons.dev/icons?i=${encodeURIComponent(slug)}&theme=${theme}`
}
