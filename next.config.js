/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github-readme-stats.vercel.app', 'avatars.githubusercontent.com'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
