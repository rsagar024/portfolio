# CLAUDE.md

Personal portfolio for Sagar (Senior Flutter Developer). Next.js 15 App Router, React 19, TypeScript, Tailwind 3, Framer Motion, React Three Fiber. Single page (`app/page.tsx`) made of section components. Static export (`output: 'export'`) deployed to GitHub Pages at https://rsagar024.github.io/portfolio/ by `.github/workflows/deploy.yml` on push to `master` and daily.

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run build` — static build into `out/`
- `npm run format` — Prettier

Run `typecheck` and `lint` after changes. There are no tests.

## Architecture

- **Static only, no server at runtime.** No API routes, no ISR, no `runtime = 'edge'`, nothing that needs a request. Metadata routes (`robots.ts`, `sitemap.ts`) need `export const dynamic = 'force-static'`.
- `app/page.tsx` is a server component that runs **at build time**. It fetches live data (`getGitHubData`, `getLivePlayStoreAppCount`, `hasResume`) and passes it as props to the sections. The daily workflow run keeps it fresh.
- Sections that need server data are split into a server wrapper and a client view: `Projects.tsx` → `ProjectsView.tsx`, `GitHub.tsx` → `GitHubView.tsx`.
- Server-only modules: `app/lib/github.ts`, `app/lib/resume.ts` (uses `node:fs`), and `getLivePlayStoreAppCount` in `app/lib/playStore.ts`. Don't call these from client components.
- Base path: on Pages the site lives under `/portfolio` (`NEXT_PUBLIC_BASE_PATH`, set by the workflow). `next/link`, `_next` assets and metadata get it automatically, but plain URLs to `public/` files do not. Use `BASE_PATH` / `RESUME_URL` from `app/lib/site.ts`. Metadata image URLs must be absolute (`${SITE_URL}/...`), otherwise the prefix is doubled.
- Contact form: `Contact.tsx` posts from the browser to FormSubmit (`formsubmit.co/ajax/<email>`). Free, no API key. FormSubmit ties activation to the site's address, so the first message from a new domain returns "This form needs Activation". That's expected: the owner clicks the emailed link once.

## Content: where data lives

- Personal info and site URL: `app/lib/site.ts`
- Google Play app IDs: `PLAY_APPS` in `app/lib/playStore.ts`. This is the single source for Experience/Projects links and the live project count. Never hard-code Play Store IDs in components.
- Live "Projects" stat = own GitHub repos (no forks, no profile repo) + published Play Store apps.
- Jobs: `Experience.tsx`. Journey timeline: `About.tsx`. Project cards: `ProjectsView.tsx`. Terminal output: `CyberTerminal.tsx`.
- Keep job history consistent across Experience, About timeline, terminal `projects` output and the JSON-LD in `page.tsx`. Current order: Latinem (2026–present, Senior Flutter Developer) → Quokka Labs LLP (2025–2026) → LeadRat CRM (2023–2025).

## Conventions and gotchas

- Colours: `neon.*` in `tailwind.config.js` must match the `--neon-*` CSS variables in `app/globals.css`. Use Tailwind classes (`text-neon-green/80`), not raw hex, in components.
- Don't draw block art with `█` text. The loaded fonts don't include it, so it renders differently on each device. The terminal banner is an SVG pixel grid for that reason.
- Text on cards needs a solid dark background. The translucent `hologram-effect` over animated gradients made Experience text unreadable before.
- Respect `prefers-reduced-motion`: use `useMediaQuery(REDUCED_MOTION)` for JS effects. Framer Motion is covered by `MotionConfig` in `Providers.tsx`.
- Heavy effects (`Scene3D`, `MatrixRain`) are loaded with `dynamic(..., { ssr: false })`. The 3D globe only mounts on desktop (`DESKTOP` media query).
- External links use `target="_blank" rel="noopener noreferrer"` and an `aria-label` when the link has only an icon.
- Comments explain *why*, not what. Match the existing style.
- Never commit `.env.local` (git-ignored). Variables are documented in `.env.example`.

## Running the app for checks

Never start a second `next dev` or run `next build` in this folder while the user's dev server is running. Both write to `.next/` and corrupt it (symptom: `ENOENT ... .next/server/app/icon.svg/route.js`). Fix with: stop the server, delete `.next`, restart. To test a build, copy the repo elsewhere and link `node_modules`.

To reproduce the Pages build locally in Git Bash, set `MSYS_NO_PATHCONV=1`, otherwise `/portfolio` is rewritten into a Windows path: `MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/portfolio npx next build`.
