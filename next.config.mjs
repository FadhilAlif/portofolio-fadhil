/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public bucket — adjust subdomain as needed
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        // Custom R2 domain (if configured)
        protocol: "https",
        hostname: "**.fadhildev.my.id",
      },
      {
        // Fallback: allow any Cloudflare R2 storage URL
        protocol: "https",
        hostname: "**.cloudflarestorage.com",
      },
    ],
  },
}

export default nextConfig
