# ⚡ SAGAR — Cyberpunk Portfolio

> Flutter Developer · React Frontend · Ethical Hacker  
> Built with Next.js 15, React Three Fiber, Framer Motion, Radix UI, Tailwind CSS

![Preview](public/preview.png)

---

## 🗂 Folder Structure

```
sagar-portfolio/
├── app/
│   ├── api/contact/route.ts           # Contact form → FormSubmit (validation, honeypot, rate limit)
│   ├── components/
│   │   ├── Providers.tsx              # Client providers (reduced motion, decorative icons)
│   │   ├── effects/
│   │   │   ├── CustomCursor.tsx       # Neon cursor + trail (mouse users only)
│   │   │   ├── MatrixRain.tsx         # Matrix rain canvas
│   │   │   ├── MouseSpotlight.tsx     # Mouse-reactive background glow
│   │   │   ├── Scene3D.tsx            # Three.js neon sphere (desktop only)
│   │   │   └── ScrollToTopOnLoad.tsx  # Start at top on fresh load
│   │   ├── sections/
│   │   │   ├── Hero.tsx               # Fullscreen hero
│   │   │   ├── About.tsx              # Story, timeline, role cards
│   │   │   ├── Skills.tsx             # Skill bars + marquee
│   │   │   ├── Experience.tsx         # Work history
│   │   │   ├── Projects.tsx           # Server: live repo stars/forks
│   │   │   ├── ProjectsView.tsx       # Client: filterable cards + accessible modal
│   │   │   ├── GitHub.tsx             # Server: live GitHub data (ISR, hourly)
│   │   │   ├── GitHubView.tsx         # Client: stats, contribution graph, top repos
│   │   │   ├── CyberTerminal.tsx      # Interactive terminal
│   │   │   ├── Services.tsx           # Service cards
│   │   │   ├── Contact.tsx            # Contact form
│   │   │   └── Footer.tsx             # Footer
│   │   └── ui/
│   │       └── Navbar.tsx             # Sticky navbar with scroll-spy
│   ├── lib/
│   │   ├── github.ts                  # Server-side GitHub API loader
│   │   ├── navigation.ts              # Section links (Navbar + Footer)
│   │   └── useMediaQuery.ts           # Media-query hook (reduced motion, pointer, desktop)
│   ├── icon.svg                       # Favicon
│   ├── opengraph-image.tsx            # Generated social share image
│   ├── twitter-image.tsx              # Same image for X/Twitter cards
│   ├── globals.css                    # Cyberpunk CSS system
│   ├── layout.tsx                     # Root layout + SEO metadata
│   └── page.tsx                       # Page assembly (server component)
├── public/                            # Static assets — add resume.pdf here
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/rsagar024/portfolio.git
cd portfolio

# 2. Install
npm install

# 3. Environment
cp .env.example .env.local
# Fill in your GitHub username and email API keys

# 4. Dev server
npm run dev
# → http://localhost:3000
```

---

## 🔧 Configuration

### GitHub Username
In `.env.local`:
```
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
```

### Contact Form (FormSubmit — free, no API key)
The form posts to `app/api/contact/route.ts`, which validates the input, blocks bots (honeypot + basic rate limit) and forwards the message through [FormSubmit](https://formsubmit.co) to **sagarsahusts@gmail.com**.
1. Deploy the site, then send yourself one message from the live contact form.
2. FormSubmit emails that inbox an **activation link** — click "Activate Form" once. Every message after that is delivered (the first one isn't).
3. *(Optional)* To hide your address, set `CONTACT_TO_EMAIL` to the random alias FormSubmit sends you after activation.

`NEXT_PUBLIC_SITE_URL` must be your real domain: FormSubmit activates the form for that site.

### Site URL (SEO)
Set `NEXT_PUBLIC_SITE_URL` to your real domain (e.g. `https://yourname.dev`). It drives the canonical URL, Open Graph links, `/sitemap.xml`, `/robots.txt` and the JSON-LD `Person` data. On Vercel it falls back to the project's production domain when unset.

### Resume
Drop your resume PDF at `public/resume.pdf`

### Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run format` / `format:check` | Prettier write / check |

---

## 🎨 Customization

### Colors (globals.css)
```css
:root {
  --neon-blue: #00d4ff;
  --neon-purple: #b000ff;
  --neon-cyan: #00fff7;
  --neon-green: #00ff88;
  --neon-pink: #ff0080;
}
```

### Personal Info
Update in each section component:
- `Hero.tsx` — name, tagline, socials
- `About.tsx` — bio, timeline
- `Experience.tsx` — work history
- `ProjectsView.tsx` — project list (set `repo` to show live GitHub stars/forks, `live` for a demo link)
- `Contact.tsx` — contact links
- `lib/navigation.ts` — section links shown in the Navbar and Footer

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard:
# NEXT_PUBLIC_GITHUB_USERNAME=yourusername
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new) for auto-deploy on push.

### Manual Build
```bash
npm run build
npm start
```

---

## 🔑 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Animation | Framer Motion |
| 3D | Three.js + React Three Fiber |
| UI primitives | Radix UI Dialog |
| Icons | Lucide React + React Icons |
| Toast | Sonner |
| Fonts | Orbitron + Rajdhani + JetBrains Mono |

---

## ⚡ Performance

- Three.js and the Matrix canvas are dynamically imported (SSR-safe); the 3D sphere only mounts on desktop
- The 3D render loop pauses when the hero is off-screen; canvas animations pause in hidden tabs
- GitHub data is fetched on the server and cached with ISR (revalidated hourly)
- `react-intersection-observer` triggers scroll animations only once
- Respects `prefers-reduced-motion` (calm mode: no matrix rain, custom cursor or continuous animations)

---

## 📄 License

MIT © Sagar
