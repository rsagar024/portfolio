'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SiFlutter, SiDart, SiTypescript, SiJavascript, SiFirebase, SiGit, SiLinux, SiReact } from 'react-icons/si'
import { Shield } from 'lucide-react'

const skills = [
  { name: 'Flutter / Dart', level: 90, color: '#00d4ff', category: 'Mobile' },
  { name: 'React / TypeScript', level: 60, color: '#b829ff', category: 'Frontend' },
  { name: 'Firebase', level: 80, color: '#00fff7', category: 'Backend' },
  { name: 'BLoC / Provider / GetX', level: 88, color: '#00ff88', category: 'Architecture' },
  { name: 'REST APIs', level: 85, color: '#ff0080', category: 'Integration' },
  { name: 'Cybersecurity', level: 65, color: '#00ff88', category: 'Security' },
  { name: 'Networking', level: 70, color: '#00d4ff', category: 'Security' },
  { name: 'Git / GitHub', level: 92, color: '#b829ff', category: 'DevOps' },
  { name: 'Linux', level: 80, color: '#00fff7', category: 'Systems' },
]

const techIcons = [
  { icon: SiFlutter, name: 'Flutter', color: '#00d4ff' },
  { icon: SiDart, name: 'Dart', color: '#00d4ff' },
  { icon: SiReact, name: 'React', color: '#ff0080' },
  { icon: SiTypescript, name: 'TypeScript', color: '#00d4ff' },
  { icon: SiJavascript, name: 'JavaScript', color: '#ffcc00' },
  { icon: SiFirebase, name: 'Firebase', color: '#ff8800' },
  { icon: SiGit, name: 'Git', color: '#ff4500' },
  { icon: SiLinux, name: 'Linux', color: '#00ff88' },
]

function SkillBar({ skill, index, inView }: { skill: typeof skills[0], index: number, inView: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-sm text-gray-300">{skill.name}</span>
        <span className="font-display text-xs font-bold" style={{ color: skill.color }}>{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`, boxShadow: `0 0 8px ${skill.color}` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="skills" className="relative py-32 z-10">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-20 text-center"
        >
          <div className="font-mono text-neon-purple text-sm mb-3">{'// skills.json'}</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">TECH STACK</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-purple), transparent)' }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Skill bars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h3 className="font-display text-xl text-white mb-8">Proficiency Levels</h3>
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} index={i} inView={inView} />
            ))}
          </motion.div>

          {/* Tech icons + security */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="font-display text-xl text-white mb-8">Technologies</h3>
              <div className="grid grid-cols-4 gap-4">
                {techIcons.map(({ icon: Icon, name, color }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                    className="hologram-effect p-4 rounded-xl flex flex-col items-center gap-2 group hover:-translate-y-2 transition-all duration-300 cursor-default"
                  >
                    <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" style={{ color }} />
                    <span className="font-mono text-xs text-gray-400">{name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Security skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="cyber-card-purple p-6 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-neon-green" />
                <h3 className="font-display text-base text-neon-green">Security Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Ethical Hacking', 'API Security', 'Auth Systems', 'Network Recon', 'Vulnerability Assessment', 'Hive / sqflite', 'IVR Systems', 'WhatsApp API'].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-3 py-1 rounded-full border border-neon-green/30 text-neon-green/70 hover:border-neon-green hover:text-neon-green transition-all duration-300 cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Infinite marquee */}
        <div className="mt-20 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-8">
            {[...techIcons, ...techIcons].map(({ icon: Icon, name, color }, i) => (
              <div key={i} className="flex items-center gap-2 px-4">
                <Icon style={{ color }} className="w-5 h-5" />
                <span className="font-display text-sm tracking-widest text-gray-400">{name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
