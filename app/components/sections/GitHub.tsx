'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, Star, GitFork, Users, BookOpen } from 'lucide-react'

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'sagar'

const statsCards = [
  { label: 'Public Repos', value: '20+', icon: BookOpen, color: 'text-neon-blue' },
  { label: 'Total Stars', value: '143', icon: Star, color: 'text-neon-purple' },
  { label: 'Followers', value: '89', icon: Users, color: 'text-neon-cyan' },
  { label: 'Contributions', value: '1.2k', icon: GitFork, color: 'text-neon-green' },
]

function ContributionGrid() {
  const weeks = 26
  const days = 7

  const getIntensity = (week: number, day: number) => {
    const seed = (week * 7 + day * 13 + week * day) % 100
    if (seed < 40) return 0
    if (seed < 60) return 1
    if (seed < 75) return 2
    if (seed < 88) return 3
    return 4
  }

  const colors = [
    'rgba(0,255,136,0.07)',
    'rgba(0,255,136,0.25)',
    'rgba(0,255,136,0.45)',
    'rgba(0,255,136,0.7)',
    'rgba(0,255,136,1)',
  ]

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, d) => {
              const intensity = getIntensity(w, d)
              return (
                <div
                  key={d}
                  className="contribution-cell w-3 h-3 rounded-sm cursor-default"
                  style={{ background: colors[intensity], boxShadow: intensity > 2 ? `0 0 4px rgba(0,255,136,${intensity * 0.2})` : 'none' }}
                  title={`${intensity * 2} contributions`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GitHubSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="github" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <div className="font-mono text-neon-green text-sm mb-3">// github.activity</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">GITHUB STATS</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-green), transparent)' }} />
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {statsCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="hologram-effect rounded-xl p-6 text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
              <div className={`font-display text-2xl font-black ${s.color} mb-1`}>{s.value}</div>
              <div className="font-mono text-xs text-gray-600 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contribution graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="hologram-effect rounded-2xl p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-neon-green" />
              <h3 className="font-display text-base text-white">Contribution Graph</h3>
            </div>
            <span className="font-mono text-xs text-neon-green">@{GITHUB_USER}</span>
          </div>
          <ContributionGrid />
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="font-mono text-xs text-gray-600">Less</span>
            {['0.07', '0.25', '0.45', '0.7', '1'].map((o, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(0,255,136,${o})` }} />
            ))}
            <span className="font-mono text-xs text-gray-600">More</span>
          </div>
        </motion.div>

        {/* GitHub stats images via shields.io */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6"
        >
          <div className="hologram-effect rounded-xl p-4 flex items-center justify-center min-h-[120px]">
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USER}&show_icons=true&theme=radical&hide_border=true&bg_color=00000000&title_color=00d4ff&text_color=888&icon_color=b000ff`}
              alt="GitHub Stats"
              className="max-w-full"
              loading="lazy"
            />
          </div>
          <div className="hologram-effect rounded-xl p-4 flex items-center justify-center min-h-[120px]">
            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USER}&layout=compact&theme=radical&hide_border=true&bg_color=00000000&title_color=00d4ff&text_color=888`}
              alt="Top Languages"
              className="max-w-full"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
