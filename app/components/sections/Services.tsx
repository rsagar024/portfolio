'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Smartphone, Globe, Shield, Palette, Database, Zap } from 'lucide-react'

const services = [
  {
    icon: Smartphone,
    title: 'Flutter App Development',
    desc: 'Cross-platform iOS & Android apps with clean architecture, BLoC state management, and Firebase backend integration.',
    color: '#00d4ff',
    tags: ['Flutter', 'Dart', 'BLoC', 'Firebase'],
  },
  {
    icon: Globe,
    title: 'Frontend Engineering',
    desc: 'Enterprise-grade Angular SPAs with TypeScript, reactive patterns, NgRx, and pixel-perfect responsive designs.',
    color: '#b000ff',
    tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
  },
  {
    icon: Shield,
    title: 'Secure API Integration',
    desc: 'REST API design, OAuth 2.0/JWT auth systems, API security audits, and penetration testing for your endpoints.',
    color: '#00ff88',
    tags: ['REST APIs', 'OAuth 2.0', 'JWT', 'Security'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    desc: 'Futuristic, accessible interfaces with Figma prototypes, motion design, and component libraries.',
    color: '#ff0080',
    tags: ['Figma', 'Motion', 'Design Systems'],
  },
  {
    icon: Database,
    title: 'Firebase Systems',
    desc: 'Real-time databases, Firestore, Cloud Functions, push notifications, and scalable Firebase architecture.',
    color: '#00fff7',
    tags: ['Firestore', 'Cloud Functions', 'FCM'],
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    desc: 'App performance audits, lazy loading, code splitting, Hive/sqflite local caching, and 60fps animation tuning.',
    color: '#ffcc00',
    tags: ['Performance', 'Hive', 'sqflite', 'Optimization'],
  },
]

export default function Services() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="services" className="relative py-32 z-10">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-20 text-center"
        >
          <div className="font-mono text-neon-pink text-sm mb-3">// services.api</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">SERVICES</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-pink), transparent)' }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="hologram-effect rounded-2xl p-7 group hover:-translate-y-3 transition-all duration-500 cursor-default"
              style={{ '--hover-color': service.color } as React.CSSProperties}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${service.color}15`, border: `1px solid ${service.color}30` }}
              >
                <service.icon className="w-7 h-7" style={{ color: service.color }} />
              </div>

              {/* Title */}
              <h3
                className="font-display text-lg font-bold text-white mb-3 group-hover:transition-colors group-hover:duration-300"
                style={{ color: undefined }}
              >
                {service.title}
              </h3>
              
              <p className="font-body text-gray-400 text-sm leading-relaxed mb-4">{service.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2 py-0.5 rounded"
                    style={{ background: `${service.color}10`, color: service.color, border: `1px solid ${service.color}25` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
