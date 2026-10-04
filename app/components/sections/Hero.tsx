'use client'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Mail, ChevronDown, Download } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMediaQuery, DESKTOP } from '../../lib/useMediaQuery'
import type { ProjectCount } from '../../lib/playStore'

const Scene3D = dynamic(() => import('../effects/Scene3D'), { ssr: false })
const MatrixRain = dynamic(() => import('../effects/MatrixRain'), { ssr: false })

const floatingCode = [
  { text: 'flutter build apk', x: '5%', y: '12%', delay: 0 },
  { text: 'nmap -sV target', x: '75%', y: '15%', delay: 1 },
  { text: 'git push origin main', x: '85%', y: '70%', delay: 2 },
  { text: 'npm run dev', x: '22%', y: '80%', delay: 1.5 },
  { text: 'ssh root@192.168.1.1', x: '60%', y: '90%', delay: 0.5 },
  { text: 'bloc_pattern: BLoC', x: '35%', y: '50%', delay: 2.5 },
]

export default function Hero({ contributionsLastYear, projects, hasResume }: { contributionsLastYear: number | null; projects: ProjectCount | null; hasResume: boolean }) {
  // Only mount the 3D sphere (and download three.js) on screens where it's actually shown.
  const isDesktop = useMediaQuery(DESKTOP)

  const stats = [
    { val: '3.4+', label: 'Years Exp', title: undefined },
    // Live: own GitHub repos + apps on Google Play; static fallback if GitHub is unreachable.
    projects
      ? { val: String(projects.total), label: 'Projects', title: `${projects.repos} GitHub repos + ${projects.apps} Play Store apps` }
      : { val: '15+', label: 'Projects', title: undefined },
    // Live from GitHub (cached hourly); falls back to a static fact if GitHub is unreachable.
    contributionsLastYear !== null
      ? { val: String(contributionsLastYear), label: 'Contributions', title: 'GitHub contributions in the last 12 months' }
      : { val: '4', label: 'Featured Apps' },
  ]

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <MatrixRain />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-50 z-[2]" />

      {/* Radial glow */}
      <div className="absolute inset-0 z-[2]" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.12) 0%, rgba(176,0,255,0.08) 40%, transparent 70%)' }} />

      {/* Floating code snippets */}
      {floatingCode.map((item, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs text-neon-green/80 whitespace-nowrap z-[3] hidden lg:block"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 4, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-neon-blue">$ </span>{item.text}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Text content */}
        <div className="space-y-8">
          {/* Terminal badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 cyber-card rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-xs text-neon-green">STATUS: AVAILABLE FOR HIRE</span>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="font-mono text-neon-blue text-sm mb-2">{'// Hello, World!'}</div>
            <h1 className="font-display text-6xl lg:text-8xl font-black tracking-tight animate-glitch">
              <span className="gradient-text">SAGAR</span>
            </h1>
          </motion.div>

          {/* Typing animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display text-xl lg:text-2xl text-gray-300 min-h-[2rem]"
          >
            <TypeAnimation
              sequence={[
                'Flutter Developer', 2000,
                'React Frontend Dev', 2000,
                'Ethical Hacker', 2000,
                'Mobile Application Dev', 2000,
                'Security Researcher', 2000,
                'Penetration Tester', 2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-neon-cyan"
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-body text-lg text-gray-400 max-w-md leading-relaxed"
          >
            Building{' '}
            <span className="text-neon-blue glow-blue">futuristic apps</span> &amp;{' '}
            <span className="text-neon-purple">secure digital experiences</span>.
            {' '}3.4+ years of shipping production-grade code.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-x-8 gap-y-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center" title={s.title}>
                <div className="font-display text-2xl font-bold text-neon-blue glow-blue">{s.val}</div>
                <div className="font-mono text-xs text-gray-400 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-4"
          >
            {hasResume ? (
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="cyber-btn px-8 py-4 border border-neon-purple text-neon-purple font-display text-sm tracking-widest hover:bg-neon-purple hover:text-cyber-black transition-all duration-300 flex items-center gap-2 border-glow-purple">
                Resume <Download className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              // No public/resume.pdf yet: point to the contact form instead of a 404.
              <a href="#contact" className="cyber-btn px-8 py-4 border border-neon-purple text-neon-purple font-display text-sm tracking-widest hover:bg-neon-purple hover:text-cyber-black transition-all duration-300 flex items-center gap-2 border-glow-purple">
                Hire me <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-6"
          >
            {[
              { icon: Github, href: 'https://github.com/rsagar024', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com/in/rsagar024', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:sagarsahusts@gmail.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center cyber-card rounded-lg text-gray-400 hover:text-neon-blue hover:border-neon-blue/50 transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
            <span className="font-mono text-xs text-gray-400">{'// find me online'}</span>
          </motion.div>
        </div>

        {/* Right: 3D Sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="hidden lg:block relative h-[420px]"
        >
          <div className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
          />
          {isDesktop && <Scene3D />}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-mono text-xs text-gray-400 tracking-widest">SCROLL</span>
        <ChevronDown className="w-5 h-5 text-neon-blue" />
      </motion.div>
    </section>
  )
}
