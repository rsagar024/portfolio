'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, Mail, Github, Linkedin, Twitter, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call — integrate with your preferred email service
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Message encrypted and sent! Will respond within 24hrs.', {
      icon: <Shield className="w-4 h-4" />,
    })
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const socials = [
    { icon: Mail, label: 'Email', value: 'sagar@dev.io', href: 'mailto:sagar@dev.io', color: '#00d4ff' },
    { icon: Github, label: 'GitHub', value: 'github.com/sagar', href: 'https://github.com/sagar', color: '#b000ff' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/sagar', href: 'https://linkedin.com/in/sagar', color: '#00fff7' },
    { icon: Twitter, label: 'Twitter', value: '@sagar_dev', href: 'https://twitter.com/sagar', color: '#00ff88' },
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
          <div className="font-mono text-neon-blue text-sm mb-3">// contact.secure</div>
          <h2 className="section-heading text-5xl lg:text-6xl gradient-text mb-4">GET IN TOUCH</h2>
          <div className="w-24 h-px mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)' }} />
          <p className="font-body text-gray-500 max-w-lg mx-auto">All communications are end-to-end encrypted. Let's build something extraordinary.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: 'name', label: 'FULL NAME', type: 'text', placeholder: 'John Doe' },
                { name: 'email', label: 'EMAIL ADDRESS', type: 'email', placeholder: 'john@example.com' },
                { name: 'subject', label: 'SUBJECT', type: 'text', placeholder: 'Project collaboration' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="font-display text-xs tracking-widest text-gray-500 mb-2 block">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
                    required
                    className="cyber-input w-full px-4 py-3 rounded-lg font-mono text-sm placeholder-gray-700"
                  />
                </div>
              ))}

              <div>
                <label className="font-display text-xs tracking-widest text-gray-500 mb-2 block">MESSAGE</label>
                <textarea
                  placeholder="Describe your project or inquiry..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  rows={5}
                  className="cyber-input w-full px-4 py-3 rounded-lg font-mono text-sm placeholder-gray-700 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cyber-btn w-full py-4 bg-neon-blue text-black font-display text-sm tracking-widest font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300 disabled:opacity-50 rounded-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ENCRYPTING & SENDING...
                  </>
                ) : (
                  <><Send className="w-4 h-4" /> SEND MESSAGE</>
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
              <span className="text-gray-600">$ </span>connect --channels
            </div>

            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target="_blank"
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
                  <div className="font-display text-xs tracking-widest text-gray-500 mb-0.5">{s.label}</div>
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
                <span className="font-display text-xs tracking-widest text-neon-green">SECURE CHANNEL</span>
              </div>
              <p className="font-mono text-xs text-gray-500 leading-relaxed">
                Available for freelance projects, full-time roles, security audits, and collaboration. Response time: &lt;24hrs.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
