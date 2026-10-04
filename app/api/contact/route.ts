import { NextResponse } from 'next/server'
import { SITE, SITE_URL } from '../../lib/site'

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort in-memory rate limit (per server instance): 5 messages / 10 min per IP.
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_MAX
}

function field(body: Record<string, unknown>, key: keyof typeof LIMITS) {
  const v = body[key]
  return typeof v === 'string' ? v.trim() : ''
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real users never see or fill this field. Pretend success so bots don't retry.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = field(body, 'name')
  const email = field(body, 'email')
  const subject = field(body, 'subject')
  const message = field(body, 'message')

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  for (const [key, max] of Object.entries(LIMITS)) {
    if (field(body, key as keyof typeof LIMITS).length > max) {
      return NextResponse.json({ error: `${key} is too long (max ${max} characters).` }, { status: 400 })
    }
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 })
  }

  // Delivered by FormSubmit (formsubmit.co): free, no account or API key. The first message sends
  // a one-time activation email to the inbox; click "Activate Form" there and every message after
  // that is delivered.
  const to = process.env.CONTACT_TO_EMAIL || SITE.email

  let data: { success?: string | boolean; message?: string } = {}
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // FormSubmit ties activation to the site the form lives on and rejects requests without one.
        Origin: SITE_URL,
        Referer: `${SITE_URL}/`,
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _subject: `[Portfolio] ${subject}`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
      }),
    })
    data = await res.json().catch(() => ({}))
    if (/activat/i.test(data.message ?? '')) {
      // One-time setup, not an error: FormSubmit has just emailed the activation link.
      console.warn(`Contact form: FormSubmit is waiting for activation. Open the "Activate Form" email sent to ${to} and click the link.`)
      return NextResponse.json({ error: 'The contact form is being set up. Please try again shortly or email me directly.' }, { status: 503 })
    }
    if (!res.ok || String(data.success) !== 'true') throw new Error(`${res.status} ${data.message ?? ''}`)
  } catch (err) {
    console.error('Contact form: FormSubmit error', err)
    return NextResponse.json({ error: 'Could not send your message. Please try again later or email me directly.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
