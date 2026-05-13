'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const ASCII_BANNER = `
 ███████╗ █████╗  ██████╗  █████╗ ██████╗ 
 ██╔════╝██╔══██╗██╔════╝ ██╔══██╗██╔══██╗
 ███████╗███████║██║  ███╗███████║██████╔╝
 ╚════██║██╔══██║██║   ██║██╔══██║██╔══██╗
 ███████║██║  ██║╚██████╔╝██║  ██║██║  ██║
 ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
`

const COMMANDS: Record<string, string[]> = {
  help: [
    '╔══════════════════════════════════════╗',
    '║         AVAILABLE COMMANDS           ║',
    '╠══════════════════════════════════════╣',
    '║  whoami    → About Sagar             ║',
    '║  skills    → Technical skills        ║',
    '║  projects  → List projects           ║',
    '║  contact   → Contact information     ║',
    '║  status    → System status           ║',
    '║  hack      → Try to hack me ;)       ║',
    '║  clear     → Clear terminal          ║',
    '║  matrix    → Enter the Matrix        ║',
    '╚══════════════════════════════════════╝',
  ],
  whoami: [
    'USER: Sagar',
    'ROLE: Flutter Dev | Angular Frontend | Ethical Hacker',
    'EXPERIENCE: 2.5+ years in production systems',
    'LOCATION: [CLASSIFIED]',
    'CLEARANCE: Security Research Level 3',
    '',
    'SPECIALIZATIONS:',
    '  → Cross-platform mobile development (Flutter/Dart)',
    '  → Enterprise frontend engineering (Angular/TypeScript)',
    '  → Cybersecurity & ethical penetration testing',
    '  → Secure authentication system architecture',
    '  → Firebase real-time system design',
    '',
    'STATUS: Available for new opportunities',
  ],
  skills: [
    'SCANNING SKILL MATRIX...',
    '',
    '[████████████████████] Flutter/Dart    90%',
    '[████████████████░░░░] Angular/TS      85%',
    '[████████████████░░░░] Firebase        80%',
    '[██████████████████░░] BLoC/Provider   88%',
    '[████████████████░░░░] REST APIs       85%',
    '[███████████████░░░░░] Cybersecurity   78%',
    '[████████████████████] Git/GitHub      92%',
    '[█████████████████░░░] Linux           82%',
    '',
    'ADDITIONAL: Hive, sqflite, Networking, IVR, WhatsApp API',
  ],
  projects: [
    'FETCHING REPOSITORY DATA...',
    '',
    '★  LeadRat CRM          [Flutter/Angular/Firebase]  ★★★★★',
    '★  Flutter Cloud Phone  [Flutter/Dart/WebRTC]       ★★★★☆',
    '★  Movie Application    [Flutter/BLoC/TMDB]         ★★★★☆',
    '★  Real-time Todo       [Angular/Firebase]          ★★★☆☆',
    '★  Telegram Integration [Dart/API/Webhooks]         ★★★☆☆',
    '',
    'Run: open https://github.com/sagar for full list',
  ],
  contact: [
    'INITIALIZING SECURE CHANNEL...',
    '',
    'EMAIL:    sagar@dev.io',
    'GITHUB:   github.com/sagar',
    'LINKEDIN: linkedin.com/in/sagar',
    'TWITTER:  twitter.com/sagar',
    '',
    'PGP FINGERPRINT: [REDACTED FOR SECURITY]',
    '',
    '> Prefer encrypted communication for sensitive matters.',
    '> All messages end-to-end encrypted.',
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

type HistoryLine = { type: 'input' | 'output' | 'error'; text: string }

export default function Terminal() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'output', text: ASCII_BANNER },
    { type: 'output', text: '> Welcome to SAGAR\'s terminal v3.7.1' },
    { type: 'output', text: '> Type "help" for available commands' },
    { type: 'output', text: '' },
  ])
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newLines: HistoryLine[] = [{ type: 'input', text: `sagar@portfolio:~$ ${cmd}` }]

    if (trimmed === 'clear') {
      setHistory([{ type: 'output', text: '> Terminal cleared.' }])
      setCmdHistory(p => [cmd, ...p])
      return
    }

    const output = COMMANDS[trimmed]
    if (output) {
      output.forEach(line => newLines.push({ type: 'output', text: line }))
    } else if (trimmed === '') {
      // do nothing
    } else {
      newLines.push({ type: 'error', text: `command not found: ${trimmed}. Type "help" for commands.` })
    }

    newLines.push({ type: 'output', text: '' })
    setHistory(p => [...p, ...newLines])
    setCmdHistory(p => [cmd, ...p])
    setHistoryIdx(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
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
          <div className="font-mono text-neon-green text-sm mb-3">// terminal.exe</div>
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
            <span className="font-mono text-xs text-gray-600 ml-auto">bash — 80×24</span>
          </div>

          {/* Terminal body */}
          <div
            className="p-6 font-mono text-sm min-h-[420px] max-h-[520px] overflow-y-auto cursor-text"
            style={{ background: 'rgba(0,8,3,0.97)' }}
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((line, i) => (
              <div
                key={i}
                className={`leading-relaxed whitespace-pre-wrap ${
                  line.type === 'input' ? 'text-neon-cyan' :
                  line.type === 'error' ? 'text-red-400' :
                  'text-neon-green'
                }`}
                style={{ opacity: line.type === 'output' && line.text === '' ? 0.1 : 1 }}
              >
                {line.text || '\u00a0'}
              </div>
            ))}

            {/* Input line */}
            <div className="flex items-center text-neon-cyan">
              <span>sagar@portfolio:~$ </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-neon-green caret-neon-green ml-1"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center font-mono text-xs text-gray-600 mt-4"
        >
          Try: help · whoami · skills · projects · hack · matrix
        </motion.p>
      </div>
    </section>
  )
}
