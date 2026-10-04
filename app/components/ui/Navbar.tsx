'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal } from 'lucide-react'
import { NAV_ITEMS } from '../../lib/navigation'

export default function Navbar({ hasResume }: { hasResume: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: highlight the section that crosses the middle of the viewport.
  useEffect(() => {
    const sections = NAV_ITEMS
      .map(item => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => !!el)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach(s => observer.observe(s))

    // Back in the hero (above the first section): nothing is active.
    const hero = document.getElementById('hero')
    const heroObserver = hero
      ? new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive('') }, { rootMargin: '-45% 0px -50% 0px' })
      : null
    if (hero) heroObserver?.observe(hero)

    return () => {
      observer.disconnect()
      heroObserver?.disconnect()
    }
  }, [])

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.nav
      aria-label="Main"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || open ? 'cyber-card border-b border-cyan-500/20 py-3' : 'py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group" aria-label="Sagar — back to top">
          <Terminal className="w-6 h-6 text-neon-blue" aria-hidden="true" />
          <span className="font-display text-xl font-bold gradient-text">SAGAR</span>
          <span className="font-mono text-xs text-neon-green animate-pulse" aria-hidden="true">_</span>
        </a>

        {/* Desktop Nav */}
        {/* Tighter spacing at 1024–1279px so 8 links + Resume fit beside the logo */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? 'location' : undefined}
              className={`font-display text-xs uppercase tracking-wider xl:tracking-widest transition-all duration-300 relative group ${active === item.href ? 'text-neon-blue' : 'text-gray-400 hover:text-neon-blue'
                }`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-px bg-neon-blue transition-all duration-300 ${active === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </a>
          ))}
          {hasResume && (
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn px-4 py-2 text-xs border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-cyber-black transition-all duration-300 font-display tracking-widest border-glow-blue"
            >
              Resume
            </a>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-neon-blue p-1 -mr-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden cyber-card border-t border-cyan-500/20 mt-2 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === item.href ? 'location' : undefined}
                  className={`font-display text-xs uppercase tracking-widest transition-colors ${active === item.href ? 'text-neon-blue' : 'text-gray-400 hover:text-neon-blue'}`}
                >
                  {item.label}
                </a>
              ))}
              {hasResume && (
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="cyber-btn self-start mt-2 px-4 py-2 text-xs border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-cyber-black transition-all duration-300 font-display tracking-widest"
                >
                  Resume
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
