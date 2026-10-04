'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { NAV_ITEMS } from '../../lib/navigation'

// 5×7 pixel font for the banner. Drawn as SVG squares rather than block characters (█), whose
// width and spacing depend on each device's fallback font. The viewBox scales it to any screen.
const PIXEL_FONT: Record<string, string[]> = {
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  G: ['.####', '#....', '#....', '#.###', '#...#', '#...#', '.####'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
}
const BANNER_TEXT = 'SAGAR'
const CELL = 10 // grid unit
const PIXEL = 8.5 // drawn square; the remainder is the gap between pixels
const LETTER_GAP = 1 // empty columns between letters
const LETTER_W = 5
const LETTER_H = 7
const BANNER_W = (BANNER_TEXT.length * (LETTER_W + LETTER_GAP) - LETTER_GAP) * CELL
const BANNER_H = LETTER_H * CELL

const BANNER_PIXELS = BANNER_TEXT.split('').flatMap((ch, li) =>
  PIXEL_FONT[ch].flatMap((row, y) =>
    row.split('').flatMap((c, x) => (c === '#' ? [{ x: (li * (LETTER_W + LETTER_GAP) + x) * CELL, y: y * CELL }] : [])),
  ),
)

function AsciiBanner() {
  return (
    <svg
      viewBox={`0 0 ${BANNER_W} ${BANNER_H}`}
      className="block w-full max-w-[220px] sm:max-w-[320px] lg:max-w-[380px] mt-1 mb-4"
      style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.55))' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="banner-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#00fff7" />
        </linearGradient>
      </defs>
      <g fill="url(#banner-gradient)">
        {BANNER_PIXELS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={PIXEL} height={PIXEL} rx={1.5} />
        ))}
      </g>
    </svg>
  )
}

// Commands with fixed output. Commands needing arguments or browser actions are handled in dynamicCommand().
const STATIC_COMMANDS: Record<string, string[]> = {
  whoami: [
    'USER: Sagar',
    'ROLE: Flutter Dev | React Frontend | Ethical Hacker',
    'EXPERIENCE: 3.4+ years in production systems',
    'LOCATION: [CLASSIFIED]',
    'CLEARANCE: Security Research Level 3',
    '',
    'SPECIALIZATIONS:',
    '  → Cross-platform mobile development (Flutter/Dart)',
    '  → Modern frontend engineering (React/TypeScript)',
    '  → Cybersecurity & ethical penetration testing',
    '  → Secure authentication system architecture',
    '  → Firebase real-time system design',
    '',
    'STATUS: Available for new opportunities',
  ],
  skills: [
    'SCANNING SKILL MATRIX...',
    '',
    '[██████████████████░░] Flutter/Dart    90%',
    '[████████████░░░░░░░░] React/TS        60%',
    '[████████████████░░░░] Firebase        80%',
    '[██████████████████░░] BLoC/Provider   88%',
    '[█████████████████░░░] REST APIs       85%',
    '[█████████████░░░░░░░] Cybersecurity   65%',
    '[██████████████░░░░░░] Networking      70%',
    '[██████████████████░░] Git/GitHub      92%',
    '[████████████████░░░░] Linux           80%',
    '',
    'ADDITIONAL: Hive, sqflite, IVR, WhatsApp API',
  ],
  projects: [
    'FETCHING REPOSITORY DATA...',
    '',
    'WORK (Google Play):',
    '→  Sobha Concrete      Latinem       [Flutter/BLoC]',
    '→  Sobha TechConnect   Latinem       [Flutter/BLoC]',
    '→  GP World            Quokka Labs   [Flutter/BLoC]',
    '→  myweb               Quokka Labs   [Flutter/BLoC]',
    '→  Leadrat CRM         LeadRat       [Flutter/Firebase]',
    '',
    'PERSONAL (GitHub):',
    '→  FileFlow        [Flutter/Firebase]          github.com/rsagar024/file_flow',
    '→  File Hub        [Flutter/Supabase/TDLib]    github.com/rsagar024/file_hub',
    '→  Newsy           [Flutter/BLoC/Dio]          github.com/rsagar024/newsy',
    '→  Campus Master   [Flutter/Firebase/Jitsi]    github.com/rsagar024/Campus_Master',
    '→  Connect Cam     [Flutter/Firebase/Jitsi]    github.com/rsagar024/Connect_Cam',
    '',
    'Run: open https://github.com/rsagar024 for full list',
  ],
  contact: [
    'OPENING CONTACT CHANNELS...',
    '',
    'EMAIL:    sagarsahusts@gmail.com',
    'GITHUB:   github.com/rsagar024',
    'LINKEDIN: linkedin.com/in/rsagar024',
    '',
    '> Or use the contact form below — it lands straight in my inbox.',
  ],
  status: [
    'RUNNING SYSTEM DIAGNOSTICS...',
    '',
    '[✓] Neural network: ONLINE',
    '[✓] Coffee levels: CRITICAL LOW',
    '[✓] Code compiling: 87% success rate',
    '[✓] Bug detector: ACTIVE',
    '[✓] Firewall: ENABLED',
    '[✓] VPN: CONNECTED',
    '[✓] Dark mode: PERMANENT',
    '[✓] Sleep: OPTIONAL',
    '[✓] Available for hire: TRUE',
    '',
    'ALL SYSTEMS NOMINAL. READY TO DEPLOY.',
  ],
  hack: [
    'INITIATING PENETRATION TEST...',
    '',
    'Scanning ports...       [████████████████████] 100%',
    'Enumerating services... [████████████████████] 100%',
    'Testing auth bypass...  [████████████████████] 100%',
    '',
    'RESULT: ACCESS DENIED',
    '',
    'Nice try. My systems are hardened.',
    'But I can pen-test yours if you need it 😉',
    '',
    '> Contact me for security audits.',
  ],
  matrix: [
    'LOADING THE MATRIX...',
    '',
    '01001000 01100101 01101100 01101100 01101111',
    '00100000 01001110 01100101 01101111',
    '',
    'There is no spoon.',
    '',
    '> You take the blue pill — the story ends.',
    '> You take the red pill — you stay in Wonderland.',
    '',
    'I took the red pill. I write code instead.',
  ],
}

const SECTIONS = NAV_ITEMS.map(item => item.href.slice(1)) // 'about', 'skills', …

const HELP_ENTRIES: [string, string][] = [
  ['whoami', 'About Sagar'],
  ['skills', 'Technical skills'],
  ['projects', 'List projects'],
  ['contact', 'Contact information'],
  ['socials', 'Social links'],
  ['ls', 'List site sections'],
  ['cd <section>', 'Jump to a section'],
  ['resume', 'Open my resume'],
  ['history', 'Command history'],
  ['status', 'System status'],
  ['hack', 'Try to hack me ;)'],
  ['matrix', 'Enter the Matrix'],
  ['clear', 'Clear terminal'],
]

// Box is 40 chars wide: '║  ' + name(12) + '→ ' + description(22) + '║'
const HELP = [
  '╔══════════════════════════════════════╗',
  '║         AVAILABLE COMMANDS           ║',
  '╠══════════════════════════════════════╣',
  ...HELP_ENTRIES.map(([name, desc]) => `║  ${name.padEnd(12)}→ ${desc.padEnd(22)}║`),
  '╚══════════════════════════════════════╝',
  '',
  'Tip: press Tab to autocomplete commands and sections.',
]

const COMMAND_NAMES = [...Object.keys(STATIC_COMMANDS), 'help', 'ls', 'cd', 'resume', 'socials', 'history', 'clear', 'sudo'].sort()

type HistoryLine = { type: 'input' | 'output' | 'error' | 'banner'; text: string }

const PROMPT = 'sagar@portfolio:~$'

const longestCommonPrefix = (words: string[]) =>
  words.reduce((prefix, w) => {
    let i = 0
    while (i < prefix.length && prefix[i] === w[i]) i++
    return prefix.slice(0, i)
  })

export default function CyberTerminal({ hasResume }: { hasResume: boolean }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'banner', text: '' },
    { type: 'output', text: '> Welcome to SAGAR\'S terminal v3.7.1' },
    { type: 'output', text: '> Type "help" for available commands' },
    { type: 'output', text: '' },
  ])
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [history])

  // Output for commands that need arguments, browser actions or current state.
  const dynamicCommand = (name: string, args: string[]): HistoryLine[] | null => {
    const out = (lines: string[]): HistoryLine[] => lines.map(text => ({ type: 'output', text }))
    switch (name) {
      case 'help':
        return out(HELP)
      case 'ls':
        return out([...SECTIONS.map(s => `drwxr-xr-x  ${s}/`), ...(hasResume ? ['-rw-r--r--  resume.pdf'] : [])])
      case 'cd': {
        const target = (args[0] ?? '~').replace(/^\/|\/$/g, '').toLowerCase()
        if (target === '~' || target === '' || target === 'hero') {
          document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
          return out(['→ jumping to ~ (top)'])
        }
        if (SECTIONS.includes(target)) {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
          return out([`→ jumping to /${target}`])
        }
        return [{ type: 'error', text: `cd: no such section: ${args[0]}. Try "ls".` }]
      }
      case 'resume':
        if (!hasResume) return out(['resume.pdf: not uploaded yet.', '> Email sagarsahusts@gmail.com for a copy, or run "cd contact".'])
        window.open('/resume.pdf', '_blank', 'noopener,noreferrer')
        return out(['Opening /resume.pdf in a new tab...'])
      case 'socials':
        return out([
          'GITHUB:   https://github.com/rsagar024',
          'LINKEDIN: https://linkedin.com/in/rsagar024',
          'EMAIL:    sagarsahusts@gmail.com',
        ])
      case 'history':
        return cmdHistory.length
          ? out([...cmdHistory].reverse().map((c, i) => `${String(i + 1).padStart(4)}  ${c}`))
          : out(['(no commands yet)'])
      case 'sudo':
        return out([
          '[sudo] password for visitor: ********',
          'visitor is not in the sudoers file. This incident will be reported. 😉',
        ])
      default:
        return null
    }
  }

  const runCommand = (cmd: string) => {
    const [rawName = '', ...args] = cmd.trim().split(/\s+/)
    const name = rawName.toLowerCase()
    const newLines: HistoryLine[] = [{ type: 'input', text: `${PROMPT} ${cmd}` }]

    setHistoryIdx(-1)
    if (cmd.trim()) setCmdHistory(p => [cmd, ...p])

    if (name === 'clear') {
      setHistory([{ type: 'output', text: '> Terminal cleared.' }])
      return
    }

    if (name) {
      const output = STATIC_COMMANDS[name]?.map(text => ({ type: 'output' as const, text })) ?? dynamicCommand(name, args)
      newLines.push(...(output ?? [{ type: 'error' as const, text: `command not found: ${name}. Type "help" for commands.` }]))
    }

    newLines.push({ type: 'output', text: '' })
    setHistory(p => [...p, ...newLines])
  }

  const autocomplete = () => {
    const value = input.trimStart()
    const cdMatch = value.match(/^cd\s+(\S*)$/i)
    const [pool, partial, prefix] = cdMatch
      ? [SECTIONS, cdMatch[1].toLowerCase(), 'cd ']
      : [COMMAND_NAMES, value.toLowerCase(), '']
    const matches = pool.filter(c => c.startsWith(partial))
    if (matches.length === 1) {
      setInput(prefix + matches[0] + (!cdMatch && matches[0] === 'cd' ? ' ' : ''))
    } else if (matches.length > 1) {
      setInput(prefix + longestCommonPrefix(matches))
      setHistory(p => [...p, { type: 'input', text: `${PROMPT} ${input}` }, { type: 'output', text: matches.join('    ') }])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'Tab' && !e.shiftKey && input.trim()) {
      // Only capture Tab while typing, so keyboard users can still Tab out of an empty prompt.
      e.preventDefault()
      autocomplete()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(idx)
      setInput(cmdHistory[idx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx] || '')
    }
  }

  return (
    <section id="terminal" className="relative py-32 z-10">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <div className="font-mono text-neon-green text-sm mb-3">{'// terminal.exe'}</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">CYBER TERMINAL</h2>
          <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-green), transparent)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 40px rgba(0,255,136,0.1), inset 0 0 40px rgba(0,255,136,0.02)' }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(0,10,5,0.95)', borderBottom: '1px solid rgba(0,255,136,0.2)' }}>
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,204,0,0.7)' }} />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="font-mono text-xs text-neon-green ml-3">sagar@portfolio:~</span>
            <span className="font-mono text-xs text-gray-400 ml-auto hidden sm:inline">bash — 80×24</span>
          </div>

          {/* Terminal body */}
          <div
            ref={terminalBodyRef}
            className="p-4 sm:p-6 font-mono text-xs sm:text-sm min-h-[350px] sm:min-h-[420px] max-h-[520px] overflow-y-auto cursor-text"
            style={{ background: 'rgba(0,8,3,0.97)' }}
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
          >
            <div role="log" aria-live="polite" aria-label="Terminal output">
              {/* Screen readers get the name instead of the block-character art */}
              <span className="sr-only">SAGAR</span>
              {history.map((line, i) => line.type === 'banner' ? (
                <AsciiBanner key={i} />
              ) : (
                <div
                  key={i}
                  className={`whitespace-pre-wrap break-words mb-1 ${
                    line.type === 'input' ? 'text-neon-cyan leading-relaxed' :
                    line.type === 'error' ? 'text-red-400 leading-relaxed' :
                    'text-neon-green leading-relaxed'
                  }`}
                  style={{ opacity: line.type === 'output' && line.text === '' ? 0.1 : 1 }}
                >
                  {line.text || ' '}
                </div>
              ))}
            </div>

            {/* Input line */}
            <div className="flex items-center text-neon-cyan">
              <span aria-hidden="true">{PROMPT} </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Terminal command (type help, press Tab to autocomplete)"
                className="flex-1 min-w-0 bg-transparent outline-none text-neon-green caret-neon-green ml-1"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center font-mono text-xs text-gray-400 mt-4"
        >
          Try: help · whoami · ls · cd projects · hack · matrix — Tab autocompletes
        </motion.p>
      </div>
    </section>
  )
}
