'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, Star, GitFork, Users, BookOpen, Activity, ExternalLink } from 'lucide-react'
import type { ContributionDay, GitHubData } from '../../lib/github'

const LEVEL_COLORS = [
  'rgba(0,255,136,0.07)',
  'rgba(0,255,136,0.25)',
  'rgba(0,255,136,0.45)',
  'rgba(0,255,136,0.7)',
  'rgba(0,255,136,1)',
]

const LANGUAGE_COLORS: Record<string, string> = {
  Dart: '#00d4ff',
  TypeScript: '#b829ff',
  JavaScript: '#ffcc00',
  Java: '#ff8800',
  'C++': '#ff0080',
  Python: '#00ff88',
}

function ContributionGrid({ days }: { days: ContributionDay[] }) {
  // Lay days out GitHub-style: one column per week, Sunday at the top.
  const offset = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0
  const cells: (ContributionDay | null)[] = [...Array(offset).fill(null), ...days]
  const weeks: (ContributionDay | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-1">
            {week.map((day, d) =>
              day ? (
                <div
                  key={d}
                  className="contribution-cell w-3 h-3 rounded-sm cursor-default"
                  style={{
                    background: LEVEL_COLORS[day.level],
                    boxShadow: day.level > 2 ? `0 0 4px rgba(0,255,136,${day.level * 0.2})` : 'none',
                  }}
                  title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}
                />
              ) : (
                <div key={d} className="w-3 h-3" />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GitHubView({ data, user }: { data: GitHubData | null; user: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const profileUrl = data?.profileUrl ?? `https://github.com/${user}`

  const statsCards = data
    ? [
        { label: 'Public Repos', value: data.publicRepos, icon: BookOpen, color: 'text-neon-blue' },
        { label: 'Total Stars', value: data.totalStars, icon: Star, color: 'text-neon-purple' },
        { label: 'Followers', value: data.followers, icon: Users, color: 'text-neon-cyan' },
        { label: 'Contributions (1y)', value: data.contributionsLastYear ?? '—', icon: Activity, color: 'text-neon-green' },
      ]
    : []

  const totalLangRepos = data?.languages.reduce((s, l) => s + l.count, 0) ?? 0

  return (
    <section id="github" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <div className="font-mono text-neon-green text-sm mb-3">{'// github.activity'}</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">GITHUB STATS</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-green), transparent)' }} />
        </motion.div>

        {!data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="hologram-effect rounded-2xl p-8 text-center"
          >
            <p className="font-mono text-sm text-gray-400 mb-6">GitHub data is temporarily unavailable.</p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn inline-flex items-center gap-3 px-6 py-3 border border-neon-green text-neon-green font-display text-sm tracking-widest hover:bg-neon-green hover:text-black transition-all duration-300"
            >
              <Github className="w-4 h-4" /> View @{user} on GitHub
            </a>
          </motion.div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {statsCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="hologram-effect rounded-xl p-6 text-center group hover:-translate-y-2 transition-all duration-300"
                >
                  <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                  <div className={`font-display text-2xl font-black ${s.color} mb-1`}>{s.value}</div>
                  <div className="font-mono text-xs text-gray-400 uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Contribution graph */}
            {data.contributions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="hologram-effect rounded-2xl p-6 lg:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-neon-green" />
                    <h3 className="font-display text-base text-white">Contributions — last 12 months</h3>
                  </div>
                  <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-neon-green hover:underline">
                    @{data.user}
                  </a>
                </div>
                <ContributionGrid days={data.contributions} />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <span className="font-mono text-xs text-gray-400">Less</span>
                  {LEVEL_COLORS.map((c) => (
                    <div key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
                  ))}
                  <span className="font-mono text-xs text-gray-400">More</span>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
              {/* Top repositories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {data.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hologram-effect rounded-xl p-5 group hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-display text-sm font-bold text-white group-hover:text-neon-blue transition-colors truncate">{repo.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-neon-blue flex-shrink-0" />
                    </div>
                    <p className="font-body text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-3">
                      {repo.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-4 font-mono text-xs text-gray-400">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: LANGUAGE_COLORS[repo.language] ?? '#00fff7' }} />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: '#ffcc00' }} /> {repo.stars}</span>
                      <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks}</span>
                    </div>
                  </a>
                ))}
              </motion.div>

              {/* Languages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="hologram-effect rounded-xl p-6"
              >
                <h3 className="font-display text-base text-white mb-1">Languages</h3>
                <p className="font-mono text-xs text-gray-400 mb-5">by number of repositories</p>
                <div className="space-y-4">
                  {data.languages.map((lang) => {
                    const pct = Math.round((lang.count / totalLangRepos) * 100)
                    const color = LANGUAGE_COLORS[lang.name] ?? '#00fff7'
                    return (
                      <div key={lang.name} className="space-y-1.5">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-gray-300">{lang.name}</span>
                          <span style={{ color }}>{lang.count} repo{lang.count === 1 ? '' : 's'}</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${pct}%` } : { width: 0 }}
                            transition={{ duration: 1.2, delay: 0.7 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
