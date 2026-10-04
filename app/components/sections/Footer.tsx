'use client'
import { motion } from 'framer-motion'
import { Terminal, ArrowUp, Heart } from 'lucide-react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { NAV_ITEMS } from '../../lib/navigation'

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative py-16 z-10" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-neon-blue" />
            <span className="font-display text-xl font-bold gradient-text">SAGAR</span>
            <span className="font-mono text-xs text-neon-green animate-pulse">_</span>
          </div>

          {/* Center links */}
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display text-xs tracking-widest text-gray-400 hover:text-neon-blue transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: 'https://github.com/rsagar024', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com/in/rsagar024', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:sagarsahusts@gmail.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }, i) => (
              <a key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label}
                className="w-8 h-8 flex items-center justify-center cyber-card rounded text-gray-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all duration-300">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }} />

        {/* Copyright */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-gray-400">
            © {new Date().getFullYear()} SAGAR. Built with{' '}
            <Heart className="inline w-3 h-3 text-neon-pink mx-1" />
            and too much caffeine.
          </p>
          <p className="font-mono text-xs text-gray-400">
            Flutter · React · TypeScript · Firebase · Cybersecurity
          </p>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={scrollTop}
        aria-label="Back to top"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-12 h-12 cyber-card rounded-xl flex items-center justify-center text-neon-blue hover:border-neon-blue/50 transition-all duration-300 z-50 border-glow-blue"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  )
}
