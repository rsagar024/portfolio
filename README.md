# ⚡ SAGAR — Cyberpunk Portfolio

> Senior Flutter Developer · React Frontend · Ethical Hacker
> Built with Next.js 15, React 19, React Three Fiber, Framer Motion, Radix UI and Tailwind CSS

A single-page portfolio with a cyberpunk look: matrix rain, a 3D glass globe, an interactive terminal, live GitHub data and a working contact form, with no paid services or API keys. It's a fully static site hosted free on **GitHub Pages**: https://rsagar024.github.io/portfolio/

---

## ✨ Features

- **Hero:** typing roles, a transparent 3D globe (desktop only) and floating code snippets
- **Live stats:** project count (own GitHub repos + apps still published on Google Play) and GitHub contributions, refreshed by a daily rebuild
- **Experience:** timeline for Latinem, Quokka Labs and LeadRat, with Google Play links to every shipped app
- **Projects:** work apps and personal GitHub projects, filterable (All / Professional / Personal), with a detail modal, live stars/forks and Play Store / GitHub links
- **GitHub:** profile stats, contribution graph, top repos and languages
- **Cyber Terminal:** interactive shell (`help`, `whoami`, `projects`, `ls`, `cd`, `hack`, `matrix`…) with a pixel-art name banner that scales from phone to desktop
- **Contact:** free email delivery via [FormSubmit](https://formsubmit.co) to `sagarsahusts@gmail.com`, with validation and a bot honeypot
- **SEO:** metadata, Open Graph/Twitter share image, `sitemap.xml`, `robots.txt` and JSON-LD
- **Accessible:** keyboard-friendly modal, screen-reader labels, and a "calm mode" for `prefers-reduced-motion`

---

## 🚀 Quick Start

```bash
git clone https://github.com/rsagar024/portfolio.git
cd portfolio
npm install
cp .env.example .env.local   # optional, see Configuration
npm run dev                  # http://localhost:3000
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Static production build into `out/` (preview it with `npx serve out`) |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run format` / `format:check` | Prettier write / check |

---

## 🔧 Configuration

All variables are optional. See `.env.example`.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub account for live stats and repos | `rsagar024` |
| `GITHUB_TOKEN` | Raises the GitHub API rate limit (no scopes needed) | — |
| `NEXT_PUBLIC_SITE_URL` | Public site address for canonical URL, share image, sitemap and JSON-LD | Set by the deploy workflow; locally `https://sagar.dev` |
| `NEXT_PUBLIC_BASE_PATH` | Path prefix the site is served from (`/portfolio` on GitHub Pages) | Set by the deploy workflow; empty locally |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Inbox (or FormSubmit alias) for contact-form messages | `sagarsahusts@gmail.com` |

### Contact form (FormSubmit: free, no API key)

`Contact.tsx` sends messages straight from the browser to FormSubmit, so it works on a static host. A hidden honeypot field silently drops bot submissions.

1. Open the live site and send one message from the contact form. FormSubmit emails the inbox an **"Activate Form"** link. Click it once. That first message isn't delivered.
2. Every message after that arrives in the inbox. Reply goes straight to the sender.
3. *(Optional)* To keep your address out of the page source, set `NEXT_PUBLIC_CONTACT_EMAIL` to the random alias FormSubmit sends after activation (in `.env.local`, or as an `env` entry on the build step in the workflow).

Activation is per site address: if you move to a custom domain, repeat it once.

### Resume

Put your resume at `public/resume.pdf`. The Resume buttons appear only when the file exists; otherwise a "Hire me" button links to the contact form.

---

## ✏️ Updating Content

| What | Where |
|---|---|
| Name, email, social links, SEO text | `app/lib/site.ts` |
| Google Play app IDs (used for links and the live project count) | `app/lib/playStore.ts` |
| Hero roles, tagline, floating snippets | `app/components/sections/Hero.tsx` |
| Bio, journey timeline, role cards | `app/components/sections/About.tsx` |
| Jobs, highlights, apps shipped | `app/components/sections/Experience.tsx` |
| Project cards (`repo` shows live stars/forks, `playStore` shows a Play button) | `app/components/sections/ProjectsView.tsx` |
| Terminal commands and output | `app/components/sections/CyberTerminal.tsx` |
| Section links (navbar + footer) | `app/lib/navigation.ts` |
| Colours | `--neon-*` variables in `app/globals.css` and `neon` in `tailwind.config.js` (keep them in sync) |

**Shipped a new app?** Add its package ID to `PLAY_APPS` in `app/lib/playStore.ts` (it's counted automatically), then add it to the matching job in `Experience.tsx` and as a card in `ProjectsView.tsx`.

---

## 🗂 Project Structure

```
app/
├── components/
│   ├── Providers.tsx           # Reduced-motion config, decorative icons
│   ├── effects/                # Cursor, matrix rain, spotlight, 3D globe, scroll reset
│   ├── sections/               # Hero, About, Skills, Experience, Projects, GitHub,
│   │                           # CyberTerminal, Services, Contact, Footer
│   └── ui/Navbar.tsx           # Sticky navbar with scroll-spy
├── lib/
│   ├── github.ts               # Server-side GitHub loader (cached hourly)
│   ├── playStore.ts            # Play Store app IDs + live published-app count (cached daily)
│   ├── site.ts                 # Site URL, base path, GitHub user, personal info
│   ├── resume.ts               # Detects public/resume.pdf
│   ├── navigation.ts           # Section links
│   ├── contactPrefill.ts       # Services → contact form subject prefill
│   └── useMediaQuery.ts        # Reduced motion / pointer / desktop queries
├── icon.svg, robots.ts, sitemap.ts
├── globals.css                 # Cyberpunk CSS system
├── layout.tsx                  # Root layout, fonts, SEO metadata
└── page.tsx                    # Fetches live data at build time, assembles sections
.github/workflows/deploy.yml    # Build + publish to GitHub Pages (on push and daily)
public/                         # Static assets: og-image.png, resume.pdf
```

---

## 📦 Deployment

### GitHub Pages (current)

`next.config.js` uses `output: 'export'`, so `npm run build` produces a static site in `out/`. `.github/workflows/deploy.yml` builds and publishes it:
- on every push to `master`
- daily at 00:30 UTC, so GitHub and Play Store stats stay fresh
- manually from the **Actions** tab ("Run workflow")

**One-time setup:** repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow sets the base path (`/portfolio`) and site URL automatically. Then activate the contact form (see above).

**Custom domain:** add it in Settings → Pages. The workflow picks up the new address and drops the `/portfolio` prefix automatically. Re-activate the contact form once.

### Elsewhere

`out/` is plain HTML/CSS/JS, so any static host works (Netlify, Cloudflare Pages, Vercel).

---

## 🔑 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS |
| Animation | Framer Motion |
| 3D | Three.js + React Three Fiber / Drei |
| UI primitives | Radix UI Dialog |
| Icons | Lucide React + React Icons |
| Toasts | Sonner |
| Email | FormSubmit |
| Fonts | Orbitron, Rajdhani, JetBrains Mono (`next/font`) |

---

## ⚡ Performance

- Three.js and the matrix canvas are loaded dynamically; the 3D globe only mounts on desktop.
- The 3D render loop pauses when the hero is off-screen; canvas animations pause in hidden tabs.
- Live data (GitHub, Play Store) is fetched at build time, so visitors never wait on external APIs.
- Scroll animations run once per element.
- `prefers-reduced-motion` turns off matrix rain, the custom cursor and continuous animations.

---

## 📄 License

MIT © Sagar
