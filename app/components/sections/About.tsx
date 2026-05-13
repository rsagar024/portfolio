'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Code2, Smartphone, Globe, User, Zap } from 'lucide-react'

const stats = [
  { val: '2.5+', label: 'Years Experience', color: 'text-neon-blue' },
  { val: '15+', label: 'Projects Shipped', color: 'text-neon-purple' },
  { val: '5+', label: 'Tech Stacks', color: 'text-neon-cyan' },
  { val: '∞', label: 'Problems Solved', color: 'text-neon-green' },
]

const roles = [
  { icon: Smartphone, title: 'Flutter Developer', desc: 'Cross-platform mobile apps with clean architecture, BLoC, Provider & Firebase integration.', color: 'var(--neon-blue)' },
  { icon: Globe, title: 'Angular Frontend', desc: 'Enterprise-grade SPAs with TypeScript, reactive patterns, and pixel-perfect UI.', color: 'var(--neon-purple)' },
  { icon: Shield, title: 'Ethical Hacker', desc: 'API security, network recon, authentication audits, and vulnerability research.', color: 'var(--neon-green)' },
  { icon: Code2, title: 'Security Researcher', desc: 'Exploring new attack vectors, hardening systems, building secure auth pipelines.', color: 'var(--neon-cyan)' },
]

const timeline = [
  { year: '2022', event: 'Started professional career as Flutter Developer at LeadRat CRM' },
  { year: '2023', event: 'Expanded into Angular frontend development & Firebase architecture' },
  { year: '2024', event: 'Deep-dived into cybersecurity: networking, API security, ethical hacking' },
  { year: '2025', event: 'Full-stack security-conscious developer — building and breaking systems' },
]

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="font-mono text-neon-blue text-sm mb-3">// about.sys</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">WHO AM I</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)' }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: bio + timeline */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-neon-blue" />
                <h3 className="font-display text-xl text-white">Professional Story</h3>
              </div>
              <p className="font-body text-gray-400 leading-relaxed text-lg">
                I'm <span className="text-neon-blue">Sagar</span> — a developer who lives at the intersection of beautiful UX and bulletproof security. With 2.5+ years building production apps, I've architected CRM systems, real-time communication platforms, and cross-platform mobile experiences.
              </p>
              <p className="font-body text-gray-400 leading-relaxed text-lg">
                My hacker mindset means I don't just build features — I <span className="text-neon-purple">stress-test them</span>, audit their security posture, and ship systems designed to withstand adversarial conditions.
              </p>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5 text-neon-yellow" style={{ color: 'var(--neon-green)' }} />
                <h3 className="font-display text-base text-white">Journey</h3>
              </div>
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-neon-blue group-hover:bg-neon-blue transition-all duration-300 mt-1 flex-shrink-0" />
                    {i < timeline.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: 'linear-gradient(180deg, rgba(0,212,255,0.4), transparent)' }} />}
                  </div>
                  <div className="pb-6">
                    <span className="font-mono text-xs text-neon-green">{item.year}</span>
                    <p className="font-body text-gray-400 text-sm mt-1 leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: role cards + stats */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {roles.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="hologram-effect p-5 rounded-xl group hover:-translate-y-2 transition-all duration-300 cursor-default"
                  style={{ '--glow-color': role.color } as React.CSSProperties}
                >
                  <role.icon className="w-8 h-8 mb-3" style={{ color: role.color }} />
                  <h4 className="font-display text-sm font-bold text-white mb-2">{role.title}</h4>
                  <p className="font-body text-xs text-gray-500 leading-relaxed">{role.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-4 gap-4"
            >
              {stats.map((s, i) => (
                <div key={i} className="cyber-card rounded-xl p-4 text-center">
                  <div className={`font-display text-2xl font-black ${s.color}`}>{s.val}</div>
                  <div className="font-mono text-xs text-gray-600 mt-1 uppercase tracking-wider leading-tight">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
