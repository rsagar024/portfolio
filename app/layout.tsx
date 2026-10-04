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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sagar | Cyberpunk Portfolio',
    description: 'Building futuristic apps & secure digital experiences.',
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
