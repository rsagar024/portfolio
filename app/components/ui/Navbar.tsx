'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal } from 'lucide-react'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Terminal', href: '#terminal' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'cyber-card border-b border-cyan-500/20 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Terminal className="w-6 h-6 text-neon-blue" />
          <span className="font-display text-xl font-bold gradient-text">SAGAR</span>
          <span className="font-mono text-xs text-neon-green animate-pulse">_</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActive(item.href)}
              className={`font-display text-xs uppercase tracking-widest transition-all duration-300 relative group ${
                active === item.href ? 'text-neon-blue' : 'text-gray-400 hover:text-neon-blue'
              }`}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-blue group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            className="cyber-btn px-4 py-2 text-xs border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300 font-display tracking-widest border-glow-blue"
          >
            Resume
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-neon-blue" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden cyber-card border-t border-cyan-500/20 mt-2"
          >
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-xs uppercase tracking-widest text-gray-400 hover:text-neon-blue transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
