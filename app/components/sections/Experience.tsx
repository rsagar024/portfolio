'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Briefcase, Calendar, ChevronRight, ExternalLink } from 'lucide-react'
import { FaGooglePlay } from 'react-icons/fa'
import { PLAY_APPS, playStoreUrl as playStore } from '../../lib/playStore'

type App = { name: string; desc: string; url: string }

type Job = {
  company: string
  role: string
  period: string
  current?: boolean
  description: string
  highlights: { label: string; detail: string }[]
  apps: App[]
  stack: string[]
  color: string
}

// Newest first.
const experiences: Job[] = [
  {
    company: 'Latinem',
    role: 'Senior Flutter Developer',
    period: '2026 – Present',
    current: true,
    description:
      'Leading Flutter development for enterprise field-operations apps used on construction sites, owning architecture, code reviews and releases.',
    highlights: [
      { label: 'App Architecture', detail: 'Own the Flutter architecture: feature modules, BLoC state management and a shared design system.' },
      { label: 'Field Operations', detail: 'Built site workflows for concrete operations, technician tasks, attendance and performance tracking.' },
      { label: 'Code Quality', detail: 'Review code, mentor developers and keep releases stable through testing and CI.' },
    ],
    apps: [
      { name: 'Sobha Concrete', desc: 'Manage and monitor concrete operations at sites.', url: playStore(PLAY_APPS.sobhaConcrete) },
      { name: 'Sobha TechConnect', desc: 'Track field tasks, attendance and performance.', url: playStore(PLAY_APPS.sobhaTechConnect) },
    ],
    stack: ['Flutter', 'Dart', 'BLoC', 'REST APIs', 'Firebase', 'Clean Architecture'],
    color: 'var(--neon-purple)',
  },
  {
    company: 'Quokka Labs LLP',
    role: 'Flutter Developer',
    period: '2025 – 2026',
    description:
      'Delivered production Flutter apps for clients, from lifestyle and membership platforms to personal productivity tools.',
    highlights: [
      { label: 'Client Apps', detail: 'Shipped consumer apps end to end, from UI implementation to Play Store release.' },
      { label: 'Clean Architecture', detail: 'Structured apps with BLoC and layered architecture for testable, maintainable code.' },
      { label: 'API Integration', detail: 'Integrated secure REST APIs, authentication and push notifications.' },
    ],
    apps: [
      { name: 'GP World', desc: 'Discounts at top restaurants & 5-star hotels, plus invite-only events.', url: playStore(PLAY_APPS.gpWorld) },
      { name: 'myweb', desc: 'A personal digital space to capture notes, links and files.', url: playStore(PLAY_APPS.myweb) },
    ],
    stack: ['Flutter', 'Dart', 'BLoC', 'REST APIs', 'Firebase'],
    color: 'var(--neon-cyan)',
  },
  {
    company: 'LeadRat CRM',
    role: 'Flutter Developer',
    period: '2023 – 2025',
    description:
      'Started my career building a real estate CRM platform: Flutter mobile apps, real-time communication systems and enterprise integrations.',
    highlights: [
      { label: 'CRM Systems', detail: 'Built core CRM features including lead management, pipeline visualization and real-time updates.' },
      { label: 'WhatsApp Integration', detail: 'WhatsApp Business API integration for automated messaging, template campaigns and live chat.' },
      { label: 'IVR Systems', detail: 'IVR phone system modules with call routing, voicemail and analytics dashboards.' },
      { label: 'Real-time Apps', detail: 'Real-time notifications and collaborative interfaces using Firebase and WebSocket.' },
      { label: 'UI Engineering', detail: 'Pixel-perfect responsive UIs in Flutter with custom animations.' },
      { label: 'Auth Systems', detail: 'Multi-factor authentication, OAuth 2.0 flows and JWT refresh token architecture.' },
    ],
    apps: [
      { name: 'Leadrat (Lite)', desc: 'Real estate CRM for managing leads, properties and follow-ups.', url: playStore(PLAY_APPS.leadrat) },
    ],
    stack: ['Flutter', 'Dart', 'Firebase', 'BLoC', 'REST APIs', 'WebSocket'],
    color: 'var(--neon-blue)',
  },
]

function ExperienceCard({ exp, isLast }: { exp: Job; isLast: boolean }) {
  // Each card animates in when it reaches the viewport, not all at once with the heading.
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <div ref={ref} className="relative pl-10 lg:pl-14">
      {/* Timeline dot + line */}
      <span
        className="absolute left-0 top-8 w-4 h-4 rounded-full border-2"
        style={{ borderColor: exp.color, background: exp.current ? exp.color : 'var(--cyber-black)', boxShadow: `0 0 12px ${exp.color}` }}
      />
      {!isLast && (
        <span className="absolute left-[7px] top-14 bottom-[-3rem] w-px" style={{ background: `linear-gradient(180deg, ${exp.color}, transparent)` }} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        // Thin gradient border around a solid card so text stays readable.
        className="rounded-2xl p-px"
        style={{ background: `linear-gradient(135deg, ${exp.color}, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, ${exp.color})` }}
      >
        <div className="rounded-2xl p-6 lg:p-10" style={{ background: 'rgba(4, 10, 20, 0.96)' }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${exp.color}` }}
            >
              <Briefcase className="w-7 h-7" style={{ color: exp.color }} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-white">{exp.company}</h3>
                {exp.current && (
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30">Current</span>
                )}
              </div>
              <p className="font-display text-base mb-2" style={{ color: exp.color }}>{exp.role}</p>
              <div className="flex items-center gap-2 font-mono text-sm text-gray-300">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {exp.period}
              </div>
            </div>
          </div>

          <p className="font-body text-gray-300 text-lg leading-relaxed mb-8">{exp.description}</p>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {exp.highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-xl p-4 border border-white/10 bg-white/[0.03] hover:border-neon-blue/50 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" style={{ color: exp.color }} aria-hidden="true" />
                  <span className="font-display text-sm font-bold text-white">{h.label}</span>
                </div>
                <p className="font-body text-sm text-gray-300 leading-relaxed">{h.detail}</p>
              </div>
            ))}
          </div>

          {/* Apps on Google Play */}
          <div className="mb-8">
            <div className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-3">{'// apps shipped'}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exp.apps.map((app) => (
                <a
                  key={app.url}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${app.name} on Google Play (opens in a new tab)`}
                  className="flex items-center gap-4 rounded-xl p-4 border border-white/10 bg-white/[0.03] hover:border-neon-green/60 hover:bg-neon-green/5 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-neon-green/10 border border-neon-green/30">
                    <FaGooglePlay className="w-4 h-4 text-neon-green" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-sm font-bold text-white">{app.name}</span>
                    <span className="block font-body text-sm text-gray-400 leading-snug">{app.desc}</span>
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-neon-green transition-colors flex-shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {exp.stack.map((tech) => (
              <span key={tech} className="font-mono text-xs px-3 py-1.5 rounded border border-white/15 bg-white/[0.03] text-gray-200">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="experience" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-20 text-center"
        >
          <div className="font-mono text-neon-cyan text-sm mb-3">{'// experience.log'}</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">EXPERIENCE</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)' }} />
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} isLast={i === experiences.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
