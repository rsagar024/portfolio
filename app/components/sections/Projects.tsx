'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, Star, GitFork, Terminal, X } from 'lucide-react'
import { SiFlutter, SiAngular, SiFirebase, SiDart, SiTypescript } from 'react-icons/si'

const techIconMap: Record<string, React.ElementType> = {
  Flutter: SiFlutter, Dart: SiDart, Angular: SiAngular, TypeScript: SiTypescript, Firebase: SiFirebase,
}

const featuredProjects = [
  {
    id: 1,
    name: 'LeadRat CRM',
    description: 'Full-featured CRM platform with WhatsApp Business integration, IVR telephony, real-time agent dashboards, and advanced pipeline management.',
    longDesc: 'Enterprise CRM built with Flutter (mobile) and Angular (web). Features include contact management, WhatsApp API messaging, IVR call routing, Firebase real-time sync, OAuth 2.0 auth, and analytics dashboards.',
    tech: ['Flutter', 'Angular', 'TypeScript', 'Firebase', 'Dart'],
    stars: 48, forks: 12,
    github: 'https://github.com/sagar/leadrat-crm',
    live: '#',
    category: 'Mobile + Web',
    color: '#00d4ff',
    terminal: '$ flutter run --release\n> Building APK...\n> Connecting to Firebase...\n> CRM initialized.',
  },
  {
    id: 2,
    name: 'Flutter Cloud Phone',
    description: 'VoIP-powered cloud phone application with call routing, recording, analytics, and IVR configuration built entirely in Flutter.',
    longDesc: 'Cross-platform cloud phone solution. Implements WebRTC for VoIP, custom IVR builder, call recording with Firebase storage, real-time call analytics, and push notification integration.',
    tech: ['Flutter', 'Dart', 'Firebase'],
    stars: 34, forks: 8,
    github: 'https://github.com/sagar/flutter-cloud-phone',
    live: '#',
    category: 'Mobile',
    color: '#b000ff',
    terminal: '$ dart pub get\n> Fetching packages...\n> VoIP engine ready.\n> Initializing IVR.',
  },
  {
    id: 3,
    name: 'Movie Application',
    description: 'Cinematic movie discovery app with TMDB API integration, watchlists, reviews, BLoC state management, and offline support via Hive.',
    longDesc: 'Feature-rich movie app with TMDB API, BLoC architecture, Hive local DB for offline mode, animated transitions, deep-link support, and push notifications for new releases.',
    tech: ['Flutter', 'Dart', 'Firebase'],
    stars: 27, forks: 6,
    github: 'https://github.com/sagar/movie-app',
    live: '#',
    category: 'Mobile',
    color: '#ff0080',
    terminal: '$ flutter run\n> TMDB API connected.\n> Fetching movies...\n> Offline cache ready.',
  },
  {
    id: 4,
    name: 'Real-time Todo App',
    description: 'Collaborative real-time todo list with Firebase Firestore, multi-user sync, priority queues, and an Angular frontend.',
    longDesc: 'Real-time collaborative task manager. Firebase Firestore sync across devices, user auth with Google OAuth, priority & deadline management, Angular frontend with reactive forms.',
    tech: ['Angular', 'TypeScript', 'Firebase'],
    stars: 19, forks: 5,
    github: 'https://github.com/sagar/realtime-todo',
    live: '#',
    category: 'Web',
    color: '#00fff7',
    terminal: '$ ng serve\n> Compiling TypeScript...\n> Firebase sync active.\n> App running on :4200',
  },
  {
    id: 5,
    name: 'Telegram Integration App',
    description: 'Telegram Bot API wrapper with automated workflows, message broadcasting, inline keyboards, and webhook server.',
    longDesc: 'Telegram integration layer for LeadRat CRM. Features bot command routing, automated workflow triggers, broadcast messaging, inline keyboards, webhook handling, and Telegram user mapping to CRM contacts.',
    tech: ['Dart', 'Firebase'],
    stars: 15, forks: 3,
    github: 'https://github.com/sagar/telegram-integration',
    live: '#',
    category: 'Backend',
    color: '#00ff88',
    terminal: '$ dart run bot.dart\n> Webhook listening...\n> Telegram API ready.\n> Workflows active.',
  },
]

const categories = ['All', 'Mobile', 'Web', 'Mobile + Web', 'Backend']

function ProjectCard({ project, onClick }: { project: typeof featuredProjects[0], onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="cursor-pointer group relative rounded-2xl overflow-hidden hologram-effect transition-all duration-300"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Top colored bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-xs px-2 py-0.5 rounded border mb-2 inline-block" style={{ color: project.color, borderColor: `${project.color}44` }}>{project.category}</span>
            <h3 className="font-display text-xl font-bold text-white group-hover:text-neon-blue transition-colors">{project.name}</h3>
          </div>
          <Terminal className="w-5 h-5 text-gray-600 group-hover:text-neon-green transition-colors" />
        </div>

        <p className="font-body text-gray-400 text-sm leading-relaxed">{project.description}</p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => {
            const Icon = techIconMap[t]
            return (
              <span key={t} className="flex items-center gap-1 font-mono text-xs px-2 py-1 rounded bg-gray-900 text-gray-400">
                {Icon && <Icon className="w-3 h-3" />} {t}
              </span>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-800">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 font-mono text-xs text-gray-500">
              <Star className="w-3 h-3" style={{ color: '#ffcc00' }} /> {project.stars}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-gray-500">
              <GitFork className="w-3 h-3" /> {project.forks}
            </span>
          </div>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <a href={project.github} target="_blank" className="p-1.5 rounded cyber-card text-gray-500 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href={project.live} target="_blank" className="p-1.5 rounded cyber-card text-gray-500 hover:text-neon-blue transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: typeof featuredProjects[0] | null, onClose: () => void }) {
  if (!project) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        style={{ background: 'rgba(2,4,8,0.9)', backdropFilter: 'blur(20px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="hologram-effect rounded-2xl p-8 max-w-2xl w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="h-1 w-full rounded mb-6" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} />
          <span className="font-mono text-xs px-2 py-0.5 rounded border mb-3 inline-block" style={{ color: project.color, borderColor: `${project.color}44` }}>{project.category}</span>
          <h3 className="font-display text-3xl font-bold text-white mb-4">{project.name}</h3>
          <p className="font-body text-gray-400 mb-6 leading-relaxed">{project.longDesc}</p>

          {/* Terminal preview */}
          <div className="cyber-card rounded-xl p-4 mb-6 font-mono text-sm">
            <div className="flex gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-red-500/50" />
              <span className="w-3 h-3 rounded-full" style={{ background: '#ffcc00', opacity: 0.5 }} />
              <span className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            {project.terminal.split('\n').map((line, i) => (
              <div key={i} className={line.startsWith('$') ? 'text-neon-cyan' : line.startsWith('>') ? 'text-neon-green' : 'text-gray-500'}>
                {line}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((t) => {
              const Icon = techIconMap[t]
              return (
                <span key={t} className="flex items-center gap-1 font-mono text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400">
                  {Icon && <Icon className="w-3 h-3" />} {t}
                </span>
              )
            })}
          </div>

          <div className="flex gap-4">
            <a href={project.github} target="_blank" className="cyber-btn flex items-center gap-2 px-6 py-3 border border-neon-blue text-neon-blue font-display text-sm tracking-widest hover:bg-neon-blue hover:text-black transition-all duration-300">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href={project.live} target="_blank" className="cyber-btn flex items-center gap-2 px-6 py-3 bg-neon-blue text-black font-display text-sm tracking-widest hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<typeof featuredProjects[0] | null>(null)

  const filtered = filter === 'All' ? featuredProjects : featuredProjects.filter(p => p.category === filter)

  return (
    <section id="projects" className="relative py-32 z-10">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <div className="font-mono text-neon-green text-sm mb-3">// projects.db</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">PROJECTS</h2>
          <div className="w-24 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-green), transparent)' }} />
          <p className="font-body text-gray-500 max-w-xl mx-auto">Click any project card to explore terminal details, tech stack, and links.</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-display text-xs px-5 py-2 rounded-full tracking-widest transition-all duration-300 ${
                filter === cat
                  ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                  : 'cyber-card text-gray-400 hover:text-neon-blue hover:border-neon-blue/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProjectCard project={project} onClick={() => setSelected(project)} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="https://github.com/sagar"
            target="_blank"
            className="cyber-btn inline-flex items-center gap-3 px-8 py-4 border border-neon-blue text-neon-blue font-display text-sm tracking-widest hover:bg-neon-blue hover:text-black transition-all duration-300 border-glow-blue"
          >
            <Github className="w-5 h-5" />
            View All on GitHub
          </a>
        </motion.div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
