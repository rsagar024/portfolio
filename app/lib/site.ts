// Canonical site URL used for metadata, sitemap, robots and structured data.
// Set NEXT_PUBLIC_SITE_URL to your real domain. On Vercel, the project's production
// domain is used automatically when it isn't set.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || 'https://sagar.dev').replace(/\/+$/, '')

export const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'rsagar024'

// GitHub Pages serves the site from /<repo>; files in public/ need this prefix (next.config.js basePath).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
export const RESUME_URL = `${BASE_PATH}/resume.pdf`

export const SITE = {
  name: 'Sagar',
  title: 'Sagar | Flutter Dev · Frontend Eng · Ethical Hacker',
  description:
    'Sagar — Flutter developer, React frontend engineer & ethical hacker with 3.4+ years building futuristic apps and secure digital experiences.',
  email: 'sagarsahusts@gmail.com',
  github: 'https://github.com/rsagar024',
  linkedin: 'https://linkedin.com/in/rsagar024',
}
