import type { Metadata, Viewport } from 'next'
import { Orbitron, Rajdhani, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import CustomCursor from './components/effects/CustomCursor'
import MouseSpotlight from './components/effects/MouseSpotlight'

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
  metadataBase: new URL('https://sagar.dev'),
  title: 'Sagar | Flutter Dev · Frontend Eng · Ethical Hacker',
  description: 'Sagar — Flutter developer, Angular frontend engineer & ethical hacker with 2.5+ years building futuristic apps and secure digital experiences.',
  keywords: ['Flutter', 'Angular', 'TypeScript', 'Cybersecurity', 'Ethical Hacker', 'Frontend Engineer', 'Firebase', 'Mobile Dev'],
  openGraph: {
    title: 'Sagar | Cyberpunk Portfolio',
    description: 'Building futuristic apps & secure digital experiences.',
    type: 'website',
    url: 'https://sagar.dev',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
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
        {children}
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
