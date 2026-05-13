'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Briefcase, Calendar, ChevronRight } from 'lucide-react'

const experiences = [
  {
    company: 'LeadRat CRM',
    role: 'Flutter Developer & Frontend Engineer',
    period: '2022 – Present',
    duration: '2.5+ Years',
    type: 'Full-time',
    description: 'Building the backbone of a modern CRM platform — from Flutter mobile apps to Angular web interfaces, real-time communication systems, and enterprise integrations.',
    highlights: [
      { label: 'CRM Systems', detail: 'Architected core CRM features including contact management, pipeline visualization, and real-time updates via WebSocket.' },
      { label: 'WhatsApp Integration', detail: 'Built full WhatsApp Business API integration for automated messaging, template campaigns, and live chat.' },
      { label: 'IVR Systems', detail: 'Developed IVR phone system modules with call routing, voicemail, and analytics dashboards.' },
      { label: 'Real-time Apps', detail: 'Engineered real-time notification systems and collaborative interfaces using Firebase and WebSocket.' },
      { label: 'UI Engineering', detail: 'Delivered pixel-perfect responsive UIs in both Flutter (mobile) and Angular (web) with custom animation systems.' },
      { label: 'Auth Systems', detail: 'Designed and implemented multi-factor authentication, OAuth 2.0 flows, and JWT refresh token architecture.' },
    ],
    stack: ['Flutter', 'Dart', 'Angular', 'TypeScript', 'Firebase', 'BLoC', 'REST APIs', 'WebSocket'],
    color: 'var(--neon-blue)',
  },
]

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
          <div className="font-mono text-neon-cyan text-sm mb-3">// experience.log</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">EXPERIENCE</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)' }} />
        </motion.div>

        {experiences.map((exp, expIdx) => (
          <motion.div
            key={expIdx}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main card */}
            <div className="neon-border-animated rounded-2xl p-0.5">
              <div className="hologram-effect rounded-2xl p-8 lg:p-12">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-10">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
                    <Briefcase className="w-8 h-8 text-neon-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-display text-2xl lg:text-3xl font-bold text-white">{exp.company}</h3>
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30">{exp.type}</span>
                    </div>
                    <p className="font-display text-neon-blue text-base mb-2">{exp.role}</p>
                    <div className="flex items-center gap-4 font-mono text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{exp.period}</span>
                      <span>•</span>
                      <span className="text-neon-cyan">{exp.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="font-body text-gray-400 text-lg leading-relaxed mb-10">{exp.description}</p>

                {/* Highlights grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {exp.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="cyber-card rounded-xl p-4 group hover:border-neon-blue/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ChevronRight className="w-4 h-4 text-neon-blue group-hover:translate-x-1 transition-transform duration-300" />
                        <span className="font-display text-sm text-neon-blue font-bold">{h.label}</span>
                      </div>
                      <p className="font-body text-xs text-gray-500 leading-relaxed">{h.detail}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-2">
                  {exp.stack.map((tech) => (
                    <span key={tech} className="font-mono text-xs px-3 py-1.5 rounded cyber-card border border-neon-blue/20 text-neon-blue hover:border-neon-blue/60 transition-all duration-300 cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
