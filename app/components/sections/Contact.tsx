'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, Mail, Github, Linkedin, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { CONTACT_PREFILL_EVENT, type ContactPrefillDetail } from '../../lib/contactPrefill'
import { SITE } from '../../lib/site'

// Messages are delivered by FormSubmit (formsubmit.co): free, no account or API key, and works on a
// static host. The first message from a new site address emails the inbox a one-time "Activate Form"
// link; once clicked, every message is delivered. Set NEXT_PUBLIC_CONTACT_EMAIL to the random alias
// FormSubmit sends after activation to keep the address out of the page source.
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${process.env.NEXT_PUBLIC_CONTACT_EMAIL || SITE.email}`

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [website, setWebsite] = useState('') // honeypot — hidden from real users
  const [loading, setLoading] = useState(false)

  // "Discuss this" on a service card pre-fills the subject, then focuses the first empty field.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { subject } = (e as CustomEvent<ContactPrefillDetail>).detail
      setForm(p => ({ ...p, subject }))
      window.setTimeout(() => {
        const firstEmpty = (['contact-name', 'contact-email', 'contact-message'] as const)
          .map(id => document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)
          .find(el => el && !el.value)
        firstEmpty?.focus({ preventScroll: true })
      }, 600)
    }
    window.addEventListener(CONTACT_PREFILL_EVENT, onPrefill)
    return () => window.removeEventListener(CONTACT_PREFILL_EVENT, onPrefill)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Honeypot filled in: a bot. Pretend success so it doesn't retry.
      if (!website) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
            _subject: `[Portfolio] ${form.subject.trim()}`,
            _replyto: form.email.trim(),
            _template: 'table',
            _captcha: 'false',
          }),
        })
        const data: { success?: string | boolean; message?: string } = await res.json().catch(() => ({}))
        if (/activat/i.test(data.message ?? '')) {
          throw new Error('The contact form is being set up. Please try again shortly or email me directly.')
        }
        if (!res.ok || String(data.success) !== 'true') {
          throw new Error('Could not send your message. Please try again later or email me directly.')
        }
      }
      toast.success("Message sent! I'll get back to you soon.", {
        icon: <Shield className="w-4 h-4" />,
      })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const socials = [
    { icon: Mail, label: 'Email', value: 'sagarsahusts@gmail.com', href: 'mailto:sagarsahusts@gmail.com', color: '#00d4ff' },
    { icon: Github, label: 'GitHub', value: 'github.com/rsagar024', href: 'https://github.com/rsagar024', color: '#b829ff' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/rsagar024', href: 'https://linkedin.com/in/rsagar024', color: '#00fff7' },
  ]

  return (
    <section id="contact" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-20 text-center"
        >
          <div className="font-mono text-neon-blue text-sm mb-3">{'// contact.secure'}</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">GET IN TOUCH</h2>
          <div className="w-24 h-px mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)' }} />
          <p className="font-body text-gray-400 max-w-lg mx-auto">Have a project, role or security audit in mind? Let&apos;s build something extraordinary.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot: off-screen field that only bots fill in */}
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                />
              </div>

              {[
                { name: 'name', label: 'FULL NAME', type: 'text', placeholder: 'John Doe', autoComplete: 'name', maxLength: 100 },
                { name: 'email', label: 'EMAIL ADDRESS', type: 'email', placeholder: 'john@example.com', autoComplete: 'email', maxLength: 200 },
                { name: 'subject', label: 'SUBJECT', type: 'text', placeholder: 'Project collaboration', autoComplete: 'off', maxLength: 150 },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={`contact-${field.name}`} className="font-display text-xs tracking-widest text-gray-400 mb-2 block">{field.label}</label>
                  <input
                    id={`contact-${field.name}`}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
                    required
                    className="cyber-input w-full px-4 py-3 rounded-lg font-mono text-sm placeholder-gray-500"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="contact-message" className="font-display text-xs tracking-widest text-gray-400 mb-2 block">MESSAGE</label>
                <textarea
                  id="contact-message"
                  name="message"
                  maxLength={5000}
                  placeholder="Describe your project or inquiry..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  rows={5}
                  className="cyber-input w-full px-4 py-3 rounded-lg font-mono text-sm placeholder-gray-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cyber-btn w-full py-4 bg-neon-blue text-cyber-black font-display text-sm tracking-widest font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300 disabled:opacity-50 rounded-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cyber-black/30 border-t-cyber-black rounded-full animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <><Send className="w-4 h-4" aria-hidden="true" /> SEND MESSAGE</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right: Social links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="font-mono text-neon-blue text-sm mb-8">
              <span className="text-gray-400">$ </span>connect --channels
            </div>

            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-5 hologram-effect rounded-xl p-5 group hover:-translate-x-2 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}40` }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="font-display text-xs tracking-widest text-gray-400 mb-0.5">{s.label}</div>
                  <div className="font-mono text-sm text-white group-hover:transition-colors duration-300" style={{ color: undefined }}>
                    {s.value}
                  </div>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-xs" style={{ color: s.color }}>
                  →
                </div>
              </motion.a>
            ))}

            <div className="hologram-effect rounded-xl p-5 mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-neon-green" />
                <span className="font-display text-xs tracking-widest text-neon-green">OPEN TO WORK</span>
              </div>
              <p className="font-mono text-xs text-gray-400 leading-relaxed">
                Available for freelance projects, full-time roles, security audits, and collaboration. I usually reply within a couple of days.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
