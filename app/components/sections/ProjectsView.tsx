'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as Dialog from '@radix-ui/react-dialog'
import { Github, ExternalLink, Star, GitFork, Terminal, X, Briefcase } from 'lucide-react'
import { SiFlutter, SiReact, SiFirebase, SiDart, SiTypescript, SiSqlite, SiSupabase } from 'react-icons/si'
import { FaGooglePlay } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import type { RepoStats } from '../../lib/github'
import { PLAY_APPS, playStoreUrl as playStore } from '../../lib/playStore'

const techIconMap: Record<string, IconType> = {
  Flutter: SiFlutter, Dart: SiDart, React: SiReact, TypeScript: SiTypescript, Firebase: SiFirebase, SQLite: SiSqlite, Supabase: SiSupabase,
}

type Project = {
  id: number
  name: string
  description: string
  longDesc: string
  tech: string[]
  /** Public repo name under the GitHub user; omitted for private/work projects. */
  repo?: string
  /** Real deployed URL; omitted when there is no live demo. */
  live?: string
  /** Google Play listing for shipped apps. */
  playStore?: string
  /** Company the project was built at; omitted for personal projects. */
  company?: string
  category: string
  color: string
  terminal: string
}

// Professional apps (live on Google Play) first, then personal projects from GitHub.
const featuredProjects: Project[] = [
  {
    id: 1,
    name: 'Sobha Concrete',
    description: 'Field app to manage and monitor concrete operations across construction sites, with site-level tracking in one place.',
    longDesc: 'Enterprise Flutter app built at Latinem for Sobha to digitise concrete operations on construction sites. Site teams manage and monitor concrete workflows from their phones, backed by secure API integration and a feature-modular BLoC architecture.',
    tech: ['Flutter', 'Dart', 'BLoC', 'REST APIs'],
    playStore: playStore(PLAY_APPS.sobhaConcrete),
    company: 'Latinem',
    category: 'Professional',
    color: '#b829ff',
    terminal: '$ flutter build appbundle --release\n> Syncing site data...\n> Concrete ops dashboard ready.',
  },
  {
    id: 2,
    name: 'Sobha TechConnect',
    description: 'Workforce app for field technicians: track tasks, attendance and performance on the field.',
    longDesc: 'Flutter app built at Latinem for Sobha field technicians. Technicians see and update assigned tasks and mark attendance, while supervisors track performance on the field. Built with BLoC state management, secure authentication and REST API integration.',
    tech: ['Flutter', 'Dart', 'BLoC', 'REST APIs'],
    playStore: playStore(PLAY_APPS.sobhaTechConnect),
    company: 'Latinem',
    category: 'Professional',
    color: '#00fff7',
    terminal: '$ flutter run --release\n> Technician signed in.\n> Loading assigned tasks...\n> Attendance marked.',
  },
  {
    id: 3,
    name: 'GP World',
    description: 'Membership app by Gourmet Planet: discounts at top restaurants & 5-star hotels, plus invite-only events.',
    longDesc: 'Lifestyle membership app built at Quokka Labs. Members discover partner restaurants and 5-star hotels, unlock dining and stay discounts, and get access to invite-only events. Built in Flutter with clean architecture, BLoC and secure API integrations.',
    tech: ['Flutter', 'Dart', 'BLoC', 'REST APIs'],
    playStore: playStore(PLAY_APPS.gpWorld),
    company: 'Quokka Labs',
    category: 'Professional',
    color: '#ffcc00',
    terminal: '$ flutter run --release\n> Loading partner venues...\n> Member offers unlocked.',
  },
  {
    id: 4,
    name: 'myweb',
    description: 'A personal digital space: capture notes, links and files and keep them organised in one app.',
    longDesc: 'Productivity app built at Quokka Labs that gives users a personal digital space to capture notes, save links and store files. Built in Flutter with BLoC state management and REST API integration.',
    tech: ['Flutter', 'Dart', 'BLoC', 'REST APIs'],
    playStore: playStore(PLAY_APPS.myweb),
    company: 'Quokka Labs',
    category: 'Professional',
    color: '#00ff88',
    terminal: '$ flutter run --release\n> Syncing notes & links...\n> Personal space ready.',
  },
  {
    id: 5,
    name: 'Leadrat CRM',
    description: 'Real estate CRM with lead management, WhatsApp Business integration, IVR telephony and real-time updates.',
    longDesc: 'Real estate CRM mobile app built at LeadRat. Features include lead and property management, WhatsApp Business API messaging, IVR call routing, real-time notifications via Firebase and WebSocket, OAuth 2.0 / JWT authentication and analytics dashboards.',
    tech: ['Flutter', 'Dart', 'Firebase', 'BLoC', 'WebSocket'],
    playStore: playStore(PLAY_APPS.leadrat),
    company: 'LeadRat',
    category: 'Professional',
    color: '#00d4ff',
    terminal: '$ flutter run --release\n> Connecting to Firebase...\n> Leads synced.\n> CRM initialized.',
  },
  {
    id: 6,
    name: 'FileFlow',
    description: 'Your personal cloud in your pocket: phone OTP sign-in, per-device session management and file organisation on Firebase.',
    longDesc: 'Flutter app for storing, organising and sharing files across devices. Built so far: phone number + OTP sign-in (Firebase Auth) with auto-verification, account creation with unique username/email checks, per-account device tracking with remote logout of one or all devices, profile editing, and light/dark/system theming. Clean architecture with BLoC, get_it, go_router and fpdart. File upload and sharing are in progress.',
    tech: ['Flutter', 'Dart', 'Firebase', 'BLoC'],
    repo: 'file_flow',
    category: 'Personal',
    color: '#00d4ff',
    terminal: '$ flutter run\n> Verifying OTP...\n> Device session registered.\n> Dashboard ready.',
  },
  {
    id: 7,
    name: 'File Hub',
    description: 'Encrypted media vault for images, videos, documents and audio, stored via Telegram and Supabase, with a background audio player.',
    longDesc: 'Feature-modular Flutter app for storing and browsing images, videos, documents and audio. Files are encrypted on the device and stored using Telegram (TDLib) as the storage backend, with Firebase Auth, Firestore and Supabase for accounts and metadata. Includes background audio playback, a video player, secure storage and Rive/Lottie animations.',
    tech: ['Flutter', 'Dart', 'Firebase', 'Supabase', 'BLoC'],
    repo: 'file_hub',
    category: 'Personal',
    color: '#b829ff',
    terminal: '$ flutter run\n> Encrypting file...\n> Uploading via TDLib...\n> Vault synced.',
  },
  {
    id: 8,
    name: 'Newsy',
    description: 'News app with trending headlines, category filters, debounced search with history, and pull-to-refresh.',
    longDesc: 'Flutter news app powered by NewsAPI. Dashboard with trending and latest news, category filters (Business, Entertainment, Health and more), debounced search with locally stored history, detailed article views, pull-to-refresh, and friendly error/retry screens. Feature-based structure with BLoC, Dio, get_it and SharedPreferences.',
    tech: ['Flutter', 'Dart', 'BLoC', 'REST APIs'],
    repo: 'newsy',
    category: 'Personal',
    color: '#ff0080',
    terminal: '$ flutter run\n> Fetching top headlines...\n> Search debounce: 500ms\n> News feed ready.',
  },
  {
    id: 9,
    name: 'E-Comm',
    description: 'Real-time e-commerce app: product catalogue, search, cart, orders, notifications and profile.',
    longDesc: 'Flutter e-commerce app organised by feature: auth, home, product listing and details, search, cart, orders, notifications and profile. Built with BLoC state management, an HTTP API layer, image caching and Lottie animations.',
    tech: ['Flutter', 'Dart', 'BLoC', 'REST APIs'],
    repo: 'e-comm',
    category: 'Personal',
    color: '#00ff88',
    terminal: '$ flutter run\n> Loading catalogue...\n> Cart synced.\n> Order placed.',
  },
  {
    id: 10,
    name: 'Campus Master',
    description: 'College management app for Android & iOS — student, teacher and admin sections, course info, campus location, and built-in video meetings.',
    longDesc: 'Cross-platform college management app built with Flutter. Separate student, teacher and admin sections, university and course details, campus location, multiple login methods (Google Sign-In, email with password reset), and in-app meetings powered by Jitsi Meet. Backed by Firebase Auth, Firestore and Cloud Storage.',
    tech: ['Flutter', 'Dart', 'Firebase', 'Jitsi Meet'],
    repo: 'Campus_Master',
    category: 'Personal',
    color: '#b829ff',
    terminal: '$ flutter run\n> Firebase Auth ready.\n> Loading campus data...\n> Jitsi meetings enabled.',
  },
  {
    id: 11,
    name: 'Connect Cam',
    description: 'Video conferencing app for Android & iOS — create or join meetings with screen sharing, chat, live streaming, and picture-in-picture.',
    longDesc: 'Flutter video-conferencing app modelled on popular meeting platforms: Google Sign-In, create/join meetings, audio & video mute controls, raise hand, screen sharing, in-meeting chat, live streaming, mute everyone, front/rear camera switch, picture-in-picture, tile view, and meeting history. Built on Jitsi Meet with Firebase Auth and Firestore.',
    tech: ['Flutter', 'Dart', 'Firebase', 'Jitsi Meet'],
    repo: 'Connect_Cam',
    category: 'Personal',
    color: '#00ff88',
    terminal: '$ flutter run\n> Google Sign-In ready.\n> Joining meeting...\n> Screen share available.',
  },
  {
    id: 12,
    name: 'Movie App',
    description: 'Movie discovery app for Android & iOS — browse popular and trending titles, search, and view detailed info with cast, crew, and ratings.',
    longDesc: 'Flutter movie-exploration app with curated popular and trending lists, search, rich detail pages (synopsis, cast, crew, ratings) and favourites. Uses Firebase Auth (email sign-in), Firestore and Cloud Storage, SQLite for local data, and local notifications.',
    tech: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
    repo: 'movie-app',
    category: 'Personal',
    color: '#ff0080',
    terminal: '$ flutter run\n> Firebase connected.\n> Fetching movies...\n> SQLite cache ready.',
  },
]

const categories = ['All', ...Array.from(new Set(featuredProjects.map(p => p.category)))]
const MAX_CARD_BADGES = 3

const repoUrl = (p: Project, user: string) => (p.repo ? `https://github.com/${user}/${p.repo}` : undefined)

function TechBadge({ tech, bordered }: { tech: string; bordered?: boolean }) {
  const Icon = techIconMap[tech]
  return (
    <span className={`flex items-center gap-1 font-mono text-xs rounded text-gray-400 ${bordered ? 'px-3 py-1.5 border border-gray-700' : 'px-2 py-1 bg-gray-900'}`}>
      {Icon && <Icon className="w-3 h-3" />} {tech}
    </span>
  )
}

function ProjectCard({ project, user, stats, onOpen }: { project: Project; user: string; stats?: { stars: number; forks: number }; onOpen: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const github = repoUrl(project, user)

  const handleMouseEnter = () => {
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const rect = rectRef.current
    if (!card || !rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = (y - rect.height / 2) / 15
    const rotateY = (rect.width / 2 - x) / 15
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    rectRef.current = null
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }

  const extraBadges = project.tech.length - MAX_CARD_BADGES

  return (
    // Not interactive itself: the title button below stretches over the card (::after), and the
    // GitHub/Live links sit above it, so there are no nested interactive controls.
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden hologram-effect transition-all duration-300 h-full has-[button:focus-visible]:outline has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-neon-blue"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Top colored bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-xs px-2 py-0.5 rounded border mb-2 inline-block" style={{ color: project.color, borderColor: `${project.color}44` }}>{project.category}</span>
            <h3 className="font-display text-xl font-bold text-white group-hover:text-neon-blue transition-colors">
              <button
                type="button"
                onClick={onOpen}
                aria-haspopup="dialog"
                aria-label={`${project.name} — view details`}
                className="text-left cursor-pointer focus:outline-none after:absolute after:inset-0 after:content-['']"
              >
                {project.name}
              </button>
            </h3>
          </div>
          <Terminal className="w-5 h-5 text-gray-400 group-hover:text-neon-green transition-colors" aria-hidden="true" />
        </div>

        <p className="font-body text-gray-400 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">{project.description}</p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, MAX_CARD_BADGES).map((t) => <TechBadge key={t} tech={t} />)}
          {extraBadges > 0 && (
            <span className="font-mono text-xs px-2 py-1 rounded bg-gray-900 text-gray-400">+{extraBadges}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-800 min-h-[2.25rem]">
          {stats ? (
            <div className="flex gap-4">
              <span className="flex items-center gap-1 font-mono text-xs text-gray-400" title="GitHub stars">
                <Star className="w-3 h-3" style={{ color: '#ffcc00' }} aria-hidden="true" /> {stats.stars}
                <span className="sr-only">stars</span>
              </span>
              <span className="flex items-center gap-1 font-mono text-xs text-gray-400" title="GitHub forks">
                <GitFork className="w-3 h-3" aria-hidden="true" /> {stats.forks}
                <span className="sr-only">forks</span>
              </span>
            </div>
          ) : project.company ? (
            <span className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
              <Briefcase className="w-3 h-3" aria-hidden="true" /> {project.company}
            </span>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            {project.playStore && (
              <a
                href={project.playStore}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on Google Play`}
                className="relative z-10 p-1.5 rounded cyber-card text-gray-400 hover:text-neon-green transition-colors"
              >
                <FaGooglePlay className="w-4 h-4" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on GitHub`}
                className="relative z-10 p-1.5 rounded cyber-card text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} live demo`}
                className="relative z-10 p-1.5 rounded cyber-card text-gray-400 hover:text-neon-blue transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, user, onClose, returnFocusTo }: { project: Project | null; user: string; onClose: () => void; returnFocusTo: React.RefObject<HTMLElement | null> }) {
  return (
    <Dialog.Root open={!!project} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {project && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200]"
                style={{ background: 'rgba(2,4,8,0.9)', backdropFilter: 'blur(20px)' }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              onCloseAutoFocus={(e) => {
                // No Dialog.Trigger is used, so hand focus back to the card that opened the modal.
                e.preventDefault()
                returnFocusTo.current?.focus({ preventScroll: true })
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="fixed inset-0 m-auto z-[201] h-fit max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl focus:outline-none"
              >
                {/* hologram-effect sets position: relative, so it lives on an inner wrapper, not the fixed dialog box */}
                <div className="hologram-effect rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(5,20,40,0.97)' }}>
                  <Dialog.Close
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Dialog.Close>

                  <div className="h-1 w-full rounded mb-6" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} />
                  <span className="font-mono text-xs px-2 py-0.5 rounded border mb-3 inline-block" style={{ color: project.color, borderColor: `${project.color}44` }}>{project.category}</span>
                  <Dialog.Title className="font-display text-3xl font-bold text-white mb-4 pr-8">{project.name}</Dialog.Title>
                  <Dialog.Description className="font-body text-gray-400 mb-6 leading-relaxed">{project.longDesc}</Dialog.Description>

                  {/* Terminal preview */}
                  <div className="cyber-card rounded-xl p-4 mb-6 font-mono text-sm" aria-hidden="true">
                    <div className="flex gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full bg-red-500/50" />
                      <span className="w-3 h-3 rounded-full" style={{ background: '#ffcc00', opacity: 0.5 }} />
                      <span className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    {project.terminal.split('\n').map((line, i) => (
                      <div key={i} className={line.startsWith('$') ? 'text-neon-cyan' : line.startsWith('>') ? 'text-neon-green' : 'text-gray-400'}>
                        {line}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => <TechBadge key={t} tech={t} bordered />)}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {project.playStore && (
                      <a href={project.playStore} target="_blank" rel="noopener noreferrer" className="cyber-btn flex items-center gap-2 px-6 py-3 border border-neon-green text-neon-green font-display text-sm tracking-widest hover:bg-neon-green hover:text-black transition-all duration-300">
                        <FaGooglePlay className="w-4 h-4" /> Google Play
                      </a>
                    )}
                    {repoUrl(project, user) && (
                      <a href={repoUrl(project, user)} target="_blank" rel="noopener noreferrer" className="cyber-btn flex items-center gap-2 px-6 py-3 border border-neon-blue text-neon-blue font-display text-sm tracking-widest hover:bg-neon-blue hover:text-black transition-all duration-300">
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="cyber-btn flex items-center gap-2 px-6 py-3 bg-neon-blue text-black font-display text-sm tracking-widest hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300">
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                    {project.company && !repoUrl(project, user) && (
                      <p className="w-full font-mono text-xs text-gray-400">Built at {project.company} — source code is proprietary.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

export default function ProjectsView({ repoStats, user }: { repoStats: RepoStats | null; user: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const openProject = (project: Project) => {
    openerRef.current = document.activeElement as HTMLElement | null
    setSelected(project)
  }

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
          <div className="font-mono text-neon-green text-sm mb-3">{'// projects.db'}</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">PROJECTS</h2>
          <div className="w-24 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-green), transparent)' }} />
          <p className="font-body text-gray-400 max-w-xl mx-auto">Click any project card to explore terminal details, tech stack, and links.</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`font-display text-xs px-5 py-2 rounded-full tracking-widest transition-all duration-300 ${filter === cat
                ? 'bg-neon-blue text-cyber-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
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
                <ProjectCard
                  project={project}
                  user={user}
                  stats={project.repo ? repoStats?.[project.repo] : undefined}
                  onOpen={() => openProject(project)}
                />
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
            href={`https://github.com/${user}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-btn inline-flex items-center gap-3 px-8 py-4 border border-neon-blue text-neon-blue font-display text-sm tracking-widest hover:bg-neon-blue hover:text-black transition-all duration-300 border-glow-blue"
          >
            <Github className="w-5 h-5" />
            View All on GitHub
          </a>
        </motion.div>
      </div>

      <ProjectModal project={selected} user={user} onClose={() => setSelected(null)} returnFocusTo={openerRef} />
    </section>
  )
}
