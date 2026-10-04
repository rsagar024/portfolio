/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site (`out/`) so it can be hosted on GitHub Pages. Live data (GitHub, Play Store)
  // is fetched at build time; .github/workflows/deploy.yml rebuilds daily to keep it fresh.
  output: 'export',
  // GitHub Pages serves project sites from /<repo>; the deploy workflow sets this to "/portfolio".
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Each page is written as <path>/index.html, which static hosts serve without rewrites.
  trailingSlash: true,
  images: {
    // The image optimizer needs a server.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

module.exports = nextConfig
