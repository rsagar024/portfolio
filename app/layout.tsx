import type { Metadata, Viewport } from 'next'
import { Orbitron, Rajdhani, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import CustomCursor from './components/effects/CustomCursor'
import MouseSpotlight from './components/effects/MouseSpotlight'
import Providers from './components/Providers'
import { SITE, SITE_URL } from './lib/site'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600', '700'],
})

// Social share image (public/og-image.png). Absolute URL: with a GitHub Pages basePath, relative
// image paths get the /portfolio prefix twice when resolved against metadataBase.
const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'Sagar — Flutter Developer, Frontend Engineer & Ethical Hacker',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE.title,
  description: SITE.description,
  keywords: ['Flutter', 'React', 'TypeScript', 'Cybersecurity', 'Ethical Hacker', 'Frontend Engineer', 'Firebase', 'Mobile Dev'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Sagar | Cyberpunk Portfolio',
    description: 'Building futuristic apps & secure digital experiences.',
    type: 'website',
    url: '/',
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sagar | Cyberpunk Portfolio',
    description: 'Building futuristic apps & secure digital experiences.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#020408',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} bg-cyber-black text-white antialiased overflow-x-hidden`}>
        <CustomCursor />
        <MouseSpotlight />
        <Providers>{children}</Providers>
        <Toaster
          theme="dark"
          toastOptions={{
            style: { background: 'rgba(5,20,40,0.95)', border: '1px solid #00d4ff', color: '#00d4ff' },
          }}
        />
      </body>
    </html>
  )
}
