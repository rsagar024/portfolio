# ⚡ SAGAR — Cyberpunk Portfolio

> Flutter Developer · Angular Frontend · Ethical Hacker  
> Built with Next.js 15, Three.js, Framer Motion, GSAP, Tailwind CSS

![Preview](public/preview.png)

---

## 🗂 Folder Structure

```
sagar-portfolio/
├── app/
│   ├── components/
│   │   ├── effects/
│   │   │   ├── CustomCursor.tsx       # Neon custom cursor + trail
│   │   │   ├── MatrixRain.tsx         # Matrix rain canvas animation
│   │   │   ├── MouseSpotlight.tsx     # Mouse-reactive bg glow
│   │   │   └── Scene3D.tsx            # Three.js neon sphere
│   │   ├── sections/
│   │   │   ├── Hero.tsx               # Fullscreen cinematic hero
│   │   │   ├── About.tsx              # Glassmorphism about cards
│   │   │   ├── Skills.tsx             # Animated skill bars + marquee
│   │   │   ├── Experience.tsx         # Cyber timeline
│   │   │   ├── Projects.tsx           # 3D tilt project cards + modal
│   │   │   ├── GitHub.tsx             # GitHub stats dashboard
│   │   │   ├── CyberTerminal.tsx      # Interactive hacker terminal
│   │   │   ├── Services.tsx           # Neon service cards
│   │   │   ├── Contact.tsx            # Futuristic contact form
│   │   │   └── Footer.tsx             # Animated neon footer
│   │   └── ui/
│   │       └── Navbar.tsx             # Sticky glassmorphism navbar
│   ├── globals.css                    # Cyberpunk CSS system
│   ├── layout.tsx                     # Root layout + SEO metadata
│   └── page.tsx                       # Page assembly
├── public/                            # Static assets + resume.pdf
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
git clone https://github.com/sagar/portfolio.git
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

### Email Integration
**Option A — Resend (recommended):**
1. Sign up at [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` to `.env.local`
3. Create `app/api/contact/route.ts` using Resend SDK

**Option B — EmailJS (zero-backend):**
1. Sign up at [emailjs.com](https://emailjs.com)
2. Fill all `NEXT_PUBLIC_EMAILJS_*` vars
3. Import EmailJS in `Contact.tsx` and call `emailjs.send()`

### Resume
Drop your resume PDF at `public/resume.pdf`

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
- `Projects.tsx` — project list
- `Contact.tsx` — contact links

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
| Animation | Framer Motion + GSAP |
| 3D | Three.js + React Three Fiber |
| Icons | Lucide React + React Icons |
| Toast | Sonner |
| Fonts | Orbitron + Rajdhani + JetBrains Mono |

---

## ⚡ Performance

- Dynamic imports for Three.js and Matrix canvas (SSR-safe)
- `loading="lazy"` on GitHub stat images
- `react-intersection-observer` for scroll-triggered animations only
- `will-change: transform` on animated elements
- GPU-accelerated CSS transforms throughout

---

## 📄 License

MIT © Sagar
