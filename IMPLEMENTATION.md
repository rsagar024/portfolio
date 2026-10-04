# Implementation Log

Tracks the fixes applied from the priority list in [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md), one step at a time.

| Step | Title | Status | Date |
|---|---|---|---|
| 1 | Neon Tailwind palette + missing keyframes | ✅ Done | 2026-10-04 |
| 2 | Favicon, OG/Twitter image, `/public` folder | ✅ Done (resume.pdf still needed from you) | 2026-10-04 |
| 3 | Working contact form (Resend) + remove false claims | ✅ Done (needs your Resend key) | 2026-10-04 |
| 4 | Fix production build (`optimizeCss`, type errors, image config) | ✅ Done | 2026-10-04 |
| 5 | Replace placeholder links & unify content | ✅ Done (domain still placeholder) | 2026-10-04 |
| 6 | Real GitHub data (live, cached hourly) | ✅ Done | 2026-10-04 |
| 7 | Projects: real projects & stats, keyboard a11y, accessible modal | ✅ Done | 2026-10-04 |
| 8 | Effects: touch cursor, rAF leak, pause off-screen, reduced motion | ✅ Done | 2026-10-04 |
| 9 | Navbar scroll-spy, aria, mobile Resume, GitHub link, overflow fix | ✅ Done | 2026-10-04 |
| 10 | Remove unused deps/CSS, fix type versions, README accuracy | ✅ Done | 2026-10-04 |
| 10b | **Security:** upgrade Next.js 15.1.0 → 15.5.27 (critical advisory) | ✅ Done | 2026-10-04 |
| 11 | SEO extras (sitemap/robots/JSON-LD/canonical), ESLint + Prettier | ✅ Done | 2026-10-04 |
| 12 | Live stats, responsive fixes, terminal extras, Services CTAs | ✅ Done | 2026-10-04 |
| — | Run & fix pass: console warning, dev 500, resume 404, accessibility (axe 0 violations) | ✅ Done | 2026-10-04 |

---

## Step 1 — Neon Tailwind palette + missing keyframes

### Problem
- Components use classes like `bg-neon-blue`, `border-neon-blue`, `hover:bg-neon-purple`, `text-neon-green/30`, `bg-neon-green/10` and `caret-neon-green` (21 uses across 9 files). Tailwind only had a `cyber.*` palette, so none of these were generated. Buttons, borders, the active filter tab and the floating hero snippets rendered unstyled.
- `.hologram-effect::after` and `.neon-border-animated::before` used the `scanline` and `borderSpin` animations. Those keyframes existed only in `tailwind.config.js`, and Tailwind emits them only when an `animate-*` class uses them. So both CSS animations pointed to keyframes that didn't exist and never moved.

### Changes
**`tailwind.config.js`**
- Added a `neon` colour palette under `theme.extend.colors`: `blue #00d4ff`, `purple #b000ff`, `cyan #00fff7`, `green #00ff88`, `pink #ff0080`, `yellow #ffcc00`.
  - The values match the existing `--neon-*` CSS variables.
  - `yellow` was added because `About.tsx` uses `text-neon-yellow`.
  - Opacity modifiers (`/30`, `/10`, etc.) now work too.

**`app/globals.css`**
- Removed the hand-written `.text-neon-blue/purple/cyan/green/pink` utilities, since Tailwind now generates them from the palette. This avoids duplicate rules.
- Added `@keyframes scanline` and `@keyframes borderSpin` directly in the CSS, with a comment explaining why they must live there.
- Added `isolation: isolate` to `.neon-border-animated`, so its `z-index: -1` gradient layer stays inside the card instead of slipping behind ancestor stacking contexts.

### Verification
I compiled the stylesheet with the Tailwind CLI into a temp file and checked the output. All of these are now generated:
- `bg-neon-blue`, `border-neon-blue`, `hover:bg-neon-purple`, `caret-neon-green`, `text-neon-cyan`, `text-neon-yellow`
- the opacity variants `text-neon-green/30`, `text-neon-blue/50`, `bg-neon-green/10`, `border-neon-blue/20` (e.g. `.text-neon-green\/30 { color: rgb(0 255 136 / 0.3) }`)
- `@keyframes scanline` and `@keyframes borderSpin`

Before this fix, none of these were in `.next/static/css/app/layout.css`.

### Visible effect
- Contact "Send Message" button, active project filter tab and Navbar/Hero/Projects buttons now get their neon backgrounds and borders.
- The hover fills on the Hero and Navbar buttons work.
- The floating hero code snippets and the status badge get their faded neon colours.
- The glass cards show the moving scanline shimmer, and the Experience card's gradient border animates.

### Files touched
- `tailwind.config.js`
- `app/globals.css`

---

## Step 2 — Favicon, OG/Twitter image, `/public` folder

### Problem
- `/public` didn't exist, so `/resume.pdf`, `/og-image.png` (referenced in `layout.tsx` metadata) and `public/preview.png` (README) all returned 404.
- There was no favicon at all.
- Social shares (LinkedIn, X, WhatsApp, Slack) had no preview image.

### Changes
**`app/icon.svg`** (new)
- A cyberpunk favicon: dark rounded square, gradient border, neon `>_` terminal prompt.
- Next.js picks it up automatically and emits `<link rel="icon" href="/icon.svg" type="image/svg+xml">`.

**`app/opengraph-image.tsx`** (new)
- Renders a 1200×630 PNG with `next/og` `ImageResponse`: `$ whoami`, a large `SAGAR`, the role line, the tagline and a neon gradient bar along the bottom.
- Next auto-adds the `og:image`, `og:image:width/height/type/alt` meta tags.
- Uses `export const runtime = 'edge'`. On the Node runtime, Next 15.1 on Windows crashes while loading `next/og`'s bundled font (`TypeError: Invalid URL ... noto-sans-v27-latin-regular.ttf`).
- Kept to CSS that Satori renders reliably: plain colours and linear gradients, no `background-clip: text`.

**`app/twitter-image.tsx`** (new)
- Reuses the OG image renderer and declares its own `alt`/`size`/`contentType`/`runtime`. Next reads these statically, so re-exporting them wouldn't work.
- Next emits the `twitter:image*` tags.

**`app/layout.tsx`**
- Removed `openGraph.images: [{ url: '/og-image.png' }]`. It pointed to a missing file, and the generated image replaces it.

**`public/.gitkeep`** (new)
- Creates the `public/` folder so static assets have a home.

### Still needed from you
- **`public/resume.pdf`**: drop your real resume here. The Hero and Navbar "Resume" buttons link to `/resume.pdf`, and they will 404 until the file exists.
- (Optional) `public/preview.png`, the screenshot referenced at the top of `README.md`.

### Verification
- Ran `next dev` and fetched each route:
  - `/icon.svg` returns 200 `image/svg+xml`.
  - `/opengraph-image` returns 200 `image/png`, 150 KB. I opened the PNG and checked the layout visually.
  - `/twitter-image` returns 200 `image/png`.
- Page `<head>` now contains `<link rel="icon" …/icon.svg>`, `og:image` (+ width/height/type/alt) and `twitter:image` (+ width/height/type/alt).
- `tsc --noEmit` shows no errors in the new files. It still reports **2 errors in `app/components/sections/Projects.tsx`** (lines 135 and 212, `Type 'string' is not assignable to type 'never'`), caused by typing `techIconMap` as `React.ElementType`. These were already there and will fail `next build`, so they'll be fixed in **Step 4**.

### Files touched
- `app/icon.svg` (new)
- `app/opengraph-image.tsx` (new)
- `app/twitter-image.tsx` (new)
- `public/.gitkeep` (new)
- `app/layout.tsx`

---

## Step 3 — Working contact form (Resend) + remove false claims

### Problem
- `handleSubmit` in `Contact.tsx` only waited 1.5 s on a `setTimeout` and then showed "Message encrypted and sent!". Nothing was sent, so every visitor's message was lost.
- The site claimed "All communications are end-to-end encrypted" (Contact subtitle, the toast, the "ENCRYPTING & SENDING..." button and the terminal `contact` command). That isn't true.
- `<label>`s weren't linked to their inputs (no `htmlFor`/`id`/`name`).
- There was no spam protection.

### Changes
**`app/api/contact/route.ts`** (new): server route, `POST /api/contact`
- Validates the JSON body: all fields required and trimmed, email format checked, length limits (name 100, email 200, subject 150, message 5000).
- **Honeypot:** if the hidden `website` field is filled, it returns `{ ok: true }` without sending, so bots think they succeeded.
- **Rate limit:** 5 messages per 10 minutes per IP (taken from `x-forwarded-for`). It's in memory, so it's per server instance and best-effort.
- Sends through the Resend REST API with `fetch` (no new npm dependency).
  - `reply_to` is the visitor's email, so you can just hit Reply.
  - The subject is prefixed `[Portfolio]`.
  - There's a plain-text body and an HTML body with every value HTML-escaped.
- Error handling:
  - Missing env vars: 500, "Contact form is not configured yet…", plus a server log.
  - Resend failure: 502, plus the Resend status and body logged on the server.
  - The API key never reaches the browser.

**`app/components/sections/Contact.tsx`**
- `handleSubmit` now POSTs to `/api/contact`. It shows `toast.success` on success and `toast.error` with the server's message on failure, and resets `loading` in `finally`. The form is cleared only on success.
- Added the off-screen honeypot input (`website`, `tabIndex=-1`, `aria-hidden`).
- Every field now has `id`, `name`, a matching `<label htmlFor>` and `maxLength`. Name and email have `autoComplete`.
- Text changes:
  - Subtitle → "Have a project, role or security audit in mind?…"
  - Button → "SENDING..."
  - Toast → "Message sent! I'll get back to you soon."
  - Card heading "SECURE CHANNEL" → "OPEN TO WORK"
  - Reply time "<24hrs" → "I usually reply within a couple of days"

**`app/components/sections/CyberTerminal.tsx`**
- `contact` command: removed the PGP line and the "end-to-end encrypted" lines, and pointed visitors to the contact form instead. The placeholder email and links are left for Step 5.

**`.env.example`**
- Replaced the EmailJS/Resend options with the three variables the route uses: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and the optional `CONTACT_FROM_EMAIL`, with notes.

**`README.md`**
- Rewrote the "Email Integration" section as "Contact Form (Resend)" with setup steps.

### Setup you need to do
1. Create a free account at https://resend.com and generate an API key.
2. Add to `.env.local` (and to the Vercel project env vars when deploying):
   ```
   RESEND_API_KEY=re_your_real_key
   CONTACT_TO_EMAIL=your-inbox@example.com
   # optional, needs a verified domain in Resend:
   # CONTACT_FROM_EMAIL=Portfolio <contact@yourdomain.com>
   ```
   With the default sender `onboarding@resend.dev`, Resend only delivers to the email address your Resend account was created with.
3. Restart `npm run dev`.

Until this is done, the form shows a clear "not configured yet" error instead of pretending to send.

### Verification
Ran `next dev` and called the API with curl:

| Case | Result |
|---|---|
| Invalid JSON | 400 "Invalid request." |
| Missing fields | 400 "All fields are required." |
| Bad email | 400 "Please enter a valid email address." |
| Name > 100 chars | 400 "name is too long (max 100 characters)." |
| Honeypot filled | 200 `{ ok: true }` (nothing sent) |
| Valid, env not configured | 500 "Contact form is not configured yet…" |
| 6th valid request in 10 min from the same IP | 429 "Too many messages…" |
| Valid, `CONTACT_TO_EMAIL` set, placeholder API key | 502 to the client; server log shows Resend's `401 API key is invalid`, which confirms the real Resend call is made |

- The rendered page has `id`/`for` pairs for all 5 fields, and no "encrypt" or "end-to-end" text remains.
- `tsc --noEmit` shows no new errors. Only the 2 known `Projects.tsx` errors remain, for Step 4.
- **Not tested:** a real email delivery, because that needs your Resend key.

### Files touched
- `app/api/contact/route.ts` (new)
- `app/components/sections/Contact.tsx`
- `app/components/sections/CyberTerminal.tsx`
- `.env.example`
- `README.md`

---

## Step 4 — Fix production build

### Problem
I ran `next build` before making changes. It **failed**:
```
Linting and checking validity of types ...
Failed to compile.
./app/components/sections/Projects.tsx:135:32
Type error: Type 'string' is not assignable to type 'never'.
```
- `techIconMap` was typed `Record<string, React.ElementType>`. With React 19's types, `React.ElementType` with no type argument collapses its props to `never`, so `<Icon className=…/>` couldn't type-check. Lines 135 and 212 were affected.
- `next.config.js` enabled `experimental.optimizeCss: true`, which needs the `critters` package. It isn't installed, and it's an experimental feature built on an archived package.
- `images.domains` is deprecated in Next 15 in favour of `images.remotePatterns`.

### Changes
**`app/components/sections/Projects.tsx`**
- Typed the icon map with react-icons' own type: `import type { IconType } from 'react-icons'` → `Record<string, IconType>`.
- Removed the unused `useEffect` import.

**`next.config.js`**
- Removed `experimental.optimizeCss` (your choice: Tailwind CSS here is small, so inlining critical CSS gains little).
- `images.domains` → `images.remotePatterns` (https only) for `github-readme-stats.vercel.app` and `avatars.githubusercontent.com`.

### Verification
- `tsc --noEmit`: **0 errors**. Before this step there were 2.
- `next build`: **succeeds**:
  ```
  ○ /                  66.1 kB   181 kB first load
  ƒ /api/contact
  ○ /icon.svg
  ƒ /opengraph-image
  ƒ /twitter-image
  ```
- `next start` smoke test:
  - `/`, `/icon.svg`, `/opengraph-image` and `/twitter-image` all return 200.
  - `POST /api/contact` with missing fields returns 400.
  - The production CSS bundle contains `.bg-neon-blue`, `@keyframes scanline` and `@keyframes borderSpin` (Step 1 confirmed in a real build).

### Remaining build warnings (non-blocking)
- *"Using edge runtime on a page currently disables static generation"*: expected for the OG/Twitter image routes (see Step 2). They render on demand, which is fine.
- *"metadataBase … using https://sagar.dev"*: the domain is still a placeholder. Set your real domain in **Step 5**.
- `next build` runs no ESLint checks because the project has no ESLint config file. That will be added later in P2.
- The IDE flags lucide's `Github`/`Twitter` icons as deprecated (warnings only). Tracked for P2 polish.

### Files touched
- `app/components/sections/Projects.tsx`
- `next.config.js`

---

## Step 5 — Replace placeholder links & unify content

### Decisions (from you)
| Fact | Value used everywhere |
|---|---|
| Experience | **3.4+ years** |
| Frontend framework | **React** |
| GitHub / LinkedIn | **github.com/rsagar024**, **linkedin.com/in/rsagar024** |
| Twitter/X | **Removed** (no real handle) |
| Public email | **sagarsahusts@gmail.com** |
| Domain | Not provided, so `https://sagar.dev` stays as a placeholder in `layout.tsx` (`metadataBase` + OG url) |

### Repo check
I checked GitHub (`api.github.com/users/rsagar024/repos`) before linking project cards:
- **Exist:** `Leadrat` and `movie-app`. Their cards now link to them.
- **No public repo:** Flutter Cloud Phone, Real-time Todo and Telegram Integration. Their GitHub buttons are now hidden instead of pointing to 404s.

### Changes
**`app/layout.tsx`**
- Description: "Angular frontend engineer … 2.5+ years" → "React frontend engineer … 3.4+ years".
- Keywords: `Angular` → `React`.

**`app/components/sections/Hero.tsx`**
- The Twitter social icon is replaced with an Email (`mailto:`) icon.
- The floating snippet `ng serve --open` → `npm run dev`.
- `target="_blank"` is now applied only to `http` links, so mailto doesn't open an empty tab.
- Removed the unused `ExternalLink` import.

**`app/components/sections/About.tsx`**
- Timeline 2023: "Angular frontend development" → "React frontend development".

**`app/components/sections/Experience.tsx`**
- Duration "2.5+ Years" → "3.4+ Years".
- The description and "UI Engineering" highlight now say React (web), and `Angular` → `React` in the stack badges.

**`app/components/sections/Projects.tsx`**
- `github` URLs:
  - LeadRat → `rsagar024/Leadrat`
  - Movie App → `rsagar024/movie-app`
  - The other three → `''` (no public repo).
- The GitHub buttons on the card and in the modal render only when `project.github` is set. They also gained `rel="noopener noreferrer"`, and the card icon got an `aria-label`.
- Real-time Todo: the description and long description say React, and the terminal preview is now `npm run dev … :3000` (was `ng serve … :4200`).
- "View All on GitHub" → `github.com/rsagar024`.

**`app/components/sections/Services.tsx`**
- The "Frontend Engineering" card was rewritten for React. Its tags went from `Angular, TypeScript, RxJS, NgRx` to `React, TypeScript, Tailwind CSS, Framer Motion`.

**`app/components/sections/Contact.tsx`**
- Real email, GitHub and LinkedIn. The Twitter card is removed. mailto doesn't open a new tab.

**`app/components/sections/Footer.tsx`**
- Socials are now GitHub, LinkedIn and Email (rsagar024 / real email), with `aria-label`s. Twitter is removed.
- The tech line says "React" instead of "Angular".

**`app/components/sections/CyberTerminal.tsx`**
- `whoami`: React and 3.4+ years.
- `skills`: the bars and percentages now **match the Skills section exactly** (React/TS 60, Cybersecurity 65, Networking 70, Linux 80, …), with bar lengths computed from the percentages.
- `projects`: React tags, and the "full list" link → `github.com/rsagar024`.
- `contact`: real email, GitHub and LinkedIn. Twitter is removed.

**`app/components/sections/GitHub.tsx`**
- The fallback username `'sagar'` → `'rsagar024'`.

**`README.md`**
- Tagline says React. The clone URL → `github.com/rsagar024/portfolio.git`, a repo that exists.

### Verification
- I searched `app/` and `README.md` for `Angular`, `ng serve`, `NgRx`, `RxJS`, `2.5+`, `sagar@dev.io`, `github.com/sagar`, `linkedin.com/in/sagar`, `twitter.com`, `Twitter`, `sagar_dev` and `:4200`. **None remain.**
- `tsc --noEmit`: 0 errors. `next build`: succeeds.
- The built homepage HTML (`.next/server/app/index.html`) contains `sagarsahusts@gmail.com` ×4, `github.com/rsagar024` ×7, `linkedin.com/in/rsagar024` ×4, `rsagar024/Leadrat`, `rsagar024/movie-app`, `3.4+ Years`, and `React frontend engineer` ×2. It has 0 occurrences of `Angular`, `twitter.com` or `sagar@dev.io`.
- **Not verified:** the LinkedIn URL `linkedin.com/in/rsagar024`. LinkedIn blocks automated checks; you confirmed it.

### Still open (later steps)
- **Domain:** replace `https://sagar.dev` in `app/layout.tsx` once you have a real domain (or your Vercel URL).
- **Fake project stats:** the star and fork counts on the project cards (48/12, 34/8, …) are still invented. Real values are 0 for `Leadrat` and `movie-app`. To be handled with Step 6/7 (real GitHub data and project cleanup).
- **Live demo links:** all are still `'#'` (Step 7).
- **Suggestion:** your most-starred public repos, **Campus_Master (★10)** and **Connect_Cam (★7)**, aren't featured on the site. Consider swapping them in for projects that have no public repo.

### Files touched
- `app/layout.tsx`
- `app/components/sections/Hero.tsx`
- `app/components/sections/About.tsx`
- `app/components/sections/Experience.tsx`
- `app/components/sections/Projects.tsx`
- `app/components/sections/Services.tsx`
- `app/components/sections/Contact.tsx`
- `app/components/sections/Footer.tsx`
- `app/components/sections/CyberTerminal.tsx`
- `app/components/sections/GitHub.tsx`
- `README.md`

---

## Step 6 — Real GitHub data (live, cached hourly)

### Problem
- The stat cards (20+ repos, 143 stars, 89 followers, 1.2k contributions) were **hardcoded fake numbers**. Your real profile has 13 repos, 20 stars and 4 followers.
- The "contribution graph" was a deterministic pseudo-random pattern, not your activity.
- The two `github-readme-stats.vercel.app` images depend on a public instance that is often rate-limited or down.

### Approach (your choice: real live data)
The data is fetched **on the server** and cached with ISR (`revalidate: 3600`). The page stays static and fast, refreshes at most once an hour, and the GitHub API's 60 req/hour anonymous limit is never a problem.

### Changes
**`app/lib/github.ts`** (new): server-only loader `getGitHubData(user)`
- `GET api.github.com/users/{user}` → public repos, followers, profile URL.
- `GET api.github.com/users/{user}/repos?per_page=100&type=owner`:
  - Excludes forks and the profile-README repo (named after the user).
  - **Total stars** is the sum across your own repos.
  - **Top 6 repos** by stars, then forks.
  - **Languages** are counted by number of repos.
- `GET github-contributions-api.jogruber.de/v4/{user}?y=last` → real daily contribution calendar and last-year total. If this one fails, the rest of the section still renders.
- Uses the optional `GITHUB_TOKEN` when set. Returns `null` on failure, so the page never crashes.

**`app/components/sections/GitHub.tsx`**
- Now an **async server component**. It fetches the data and renders the client view.

**`app/components/sections/GitHubView.tsx`** (new, client): keeps the existing look and animations
- Stat cards: Public Repos, Total Stars, Followers, Contributions (1y). All are real.
- Contribution graph: real data, one column per week starting on Sunday, with a tooltip showing "N contributions on YYYY-MM-DD", and the profile link.
- **Top repositories** grid (replaces the github-readme-stats images): name, description, language dot, stars and forks, each linking to the repo.
- **Languages** panel with animated bars, computed from your repos.
- Fallback: if GitHub is unreachable, it shows "GitHub data is temporarily unavailable" and a "View @rsagar024 on GitHub" button.
- The small label text went from `text-gray-600` to `text-gray-500` for better contrast.

**`app/page.tsx`**
- Is now a **Server Component** (`'use client'` removed). This is required for the server-side GitHub fetch, and it's also item 10 from the analysis.
- The scroll-to-top-on-load effect moved to the new **`app/components/effects/ScrollToTopOnLoad.tsx`** (client, same behaviour).

**`next.config.js`**
- Removed the `github-readme-stats.vercel.app` image host, which is no longer used.

**`.env.example`**
- Documented the optional `GITHUB_TOKEN`.

### Verification
- `tsc --noEmit`: 0 errors. `next build`: succeeds.
  - The first attempt failed with `PageNotFoundError: Cannot find module for page: /twitter-image`, on a route this step didn't touch. An identical re-run passed, so it was a transient build-worker error.
- `.next/prerender-manifest.json` shows `/` has `initialRevalidateSeconds: 3600` (ISR every hour).
- Built HTML: contains `Campus_Master`, `Connect_Cam`, 362 dated contribution cells and the languages panel. It has 0 `github-readme-stats` references and no "temporarily unavailable" fallback.
- Ran `next start`, loaded the page in headless Chrome and read the rendered DOM:
  - **Public Repos = 13, Total Stars = 20, Followers = 4, Contributions (1y) = 61**
  - Top repos: Campus_Master, Connect_Cam, file_hub, Elysia, e-comm, file_flow
  - The page hydrated with no error overlay. A hero screenshot shows the Step 1 neon styles rendering in a real browser.
- **Not visually verified:** the GitHub section itself in a screenshot. Headless Chrome doesn't fire its scroll-triggered fade-in when jumping straight to `#github`, so that capture came out blank. The DOM values above confirm the content.

### Files touched
- `app/lib/github.ts` (new)
- `app/components/sections/GitHubView.tsx` (new)
- `app/components/effects/ScrollToTopOnLoad.tsx` (new)
- `app/components/sections/GitHub.tsx`
- `app/page.tsx`
- `next.config.js`
- `.env.example`

---

## Step 7 — Projects: real projects & stats, keyboard a11y, accessible modal

### Problem
- The star/fork counts (48/12, 34/8, 27/6, …) were invented. Every "Live Demo" link was `'#'`, so it opened the same page in a new tab.
- 3 of the 5 projects had no public repo (Flutter Cloud Phone, Real-time Todo, Telegram Integration). Meanwhile your most-starred repos (Campus_Master ★10, Connect_Cam ★7) weren't shown.
- The cards were `<div onClick>`, so they couldn't be reached or opened with the keyboard.
- The modal had no Escape-to-close, no focus trap, no scroll lock, no dialog semantics, and no focus return. Its exit animation never ran, because `AnimatePresence` was inside a component that returned `null`.
- Tech badges beyond 3 were silently hidden.

### Decisions (from you)
- **Projects:** keep LeadRat CRM and Movie App, add **Campus Master** and **Connect Cam**, and drop the 3 projects without a public repo.
- **Stats/links:** show **real live** star/fork counts only for projects with a public repo, and hide "Live Demo" unless a real URL exists. None exist yet.

### Findings that changed the plan
- The public **`rsagar024/Leadrat`** repo is a near-empty **Java** project (no README, no description), so it isn't the LeadRat CRM. LeadRat CRM is now presented as a **work project with no repo link**. This replaces the Step 5 link to that repo.
- The **movie-app README** describes Firebase Auth, Firestore, Cloud Storage, SQLite and local notifications. The old card claimed TMDB API, BLoC and Hive offline mode, which the README doesn't mention. The card now follows the README. **Please correct it if TMDB/BLoC/Hive are accurate.**
- The Campus Master and Connect Cam card text is written only from their GitHub descriptions and READMEs (Flutter + Firebase + Jitsi Meet feature lists).

### Changes
**`app/lib/github.ts`**
- Added `getRepoStats(user)`, which returns `{ [repoName]: { stars, forks } }` or `null`. It reuses the same repos request as `getGitHubData`, so Next serves both from one cached fetch (revalidated hourly).
- Refactored the shared header logic into `githubHeaders()` and `getRepos()`.

**`app/components/sections/Projects.tsx`**
- Now an **async server component**. It fetches the live repo stats and renders `ProjectsView`.

**`app/components/sections/ProjectsView.tsx`** (new, client: the interactive section)
- **Projects:** LeadRat CRM (Mobile + Web, work project), Campus Master, Connect Cam and Movie App (Mobile). Each has a `repo?` name and a `live?` URL. Filter categories are derived from the data.
- **Cards**
  - `role="button"`, `tabIndex={0}`, `aria-haspopup="dialog"` and a descriptive `aria-label`.
  - **Enter/Space open** the details, and there's a visible focus outline.
  - The footer shows **live stars/forks** (with screen-reader text) for public repos, or "Work project" for LeadRat.
  - The GitHub and Live buttons render only when a real URL exists, with `rel="noopener noreferrer"` and `aria-label`.
  - Hidden badges now show as **"+N"**.
  - The tilt effect caches the card's position on mouse-enter instead of measuring on every mousemove.
- **Modal**
  - Rebuilt on **`@radix-ui/react-dialog`**, which was already installed but unused: Escape closes it, focus is trapped, the body is scroll-locked, and it has `role="dialog"` with Title and Description.
  - Focus returns to the card that opened it.
  - The framer-motion enter/exit animations now play, using `forceMount` + `AnimatePresence`.
  - It scrolls internally on short screens (`max-h-[90vh]`).
  - It shows "Proprietary work project — source code isn't public" when there are no links.
- Filter tabs have `aria-pressed` inside a labelled group.
- Grid is 2 columns on md+ (4 cards → a clean 2×2).

**`app/components/sections/CyberTerminal.tsx`**
- `projects` command: lists the same 4 projects with their tech and repo paths. The made-up ★ ratings are removed.

### Bug found and fixed during testing
The first build passed the keyboard test, but a screenshot showed the backdrop **without the dialog box**. Measuring it showed `position: relative; top: 5914px`, because the global `.hologram-effect` utility sets `position: relative` and overrode Tailwind's `fixed`. Fix: the outer element handles positioning (`fixed … overflow-y-auto`), and an inner wrapper carries `hologram-effect`. I searched `app/` and nothing else combines `hologram-effect` with `fixed`/`absolute`.

### Verification
- `tsc --noEmit`: 0 errors. `next build`: succeeds. The homepage JS grew 66.9 → 78.3 kB (+11 kB, mostly Radix Dialog).
- Wrote a headless-Chrome test (Chrome DevTools Protocol, real key events) against `next start`. **12/12 pass:**
  - 4 cards rendered as `role="button"` with labels.
  - LeadRat shows "Work project". The others show real stats: **Campus Master 10★/3, Connect Cam 7★/1, Movie App 0★/0**.
  - No `#` links in the section.
  - Enter on a focused card opens the dialog, focus moves inside, and the body is scroll-locked.
  - Tab ×6 keeps focus inside the dialog.
  - Escape closes it, and **focus returns to the card**. This failed at first because no `Dialog.Trigger` is used; fixed by refocusing the opener in `onCloseAutoFocus`.
  - Space opens Campus Master with its GitHub link. The Close button closes it.
  - No console errors.
- Measured the dialog box: `position: fixed`, top 167 px in a 904 px viewport, 672×571. The screenshot shows it centred and fully rendered.
- **Housekeeping:** stopping a background `npx next start` task left its child Node server running, so a re-test hit an old build. I found and killed the leftover `next start` processes on ports 3125–3127. The servers are now stopped by port after each test.

### Files touched
- `app/lib/github.ts`
- `app/components/sections/Projects.tsx`
- `app/components/sections/ProjectsView.tsx` (new)
- `app/components/sections/CyberTerminal.tsx`

---

## Step 8 — Effects: touch cursor, rAF leak, pause off-screen, reduced motion

### Problem
- **CustomCursor**
  - `body { cursor: none }` applied on every device, so on phones a neon dot sat stuck at the top-left corner (0,0).
  - Its `requestAnimationFrame` loop re-scheduled itself forever, and cleanup cancelled only the *first* id, so the loop never stopped (doubled in StrictMode).
  - Hover listeners were attached once on mount, so the modal, mobile menu and filtered cards never got the hover colour, and the listeners were never removed.
- **MatrixRain**
  - `setInterval(50ms)` ran forever, even in hidden tabs.
  - The column count was computed once, so after widening the window the right side had no rain.
- **MouseSpotlight:** restyled a full-screen gradient on every `mousemove`, plus a `transition-all`.
- **Scene3D**
  - The R3F canvas rendered every frame even when scrolled away.
  - On mobile it was CSS-hidden (`hidden lg:block`) but still **mounted**, so three.js was downloaded and run on phones.
- No `prefers-reduced-motion` support anywhere.

### Decision (from you)
**Calm mode:** when the OS "reduce motion" setting is on, keep the look but stop heavy motion. Everyone else gets the full effects, paused when they can't be seen.

### Changes
**`app/lib/useMediaQuery.ts`** (new)
- An SSR-safe `useMediaQuery` hook (`useSyncExternalStore`) with shared queries: `REDUCED_MOTION`, `FINE_POINTER` (`(hover: hover) and (pointer: fine)`) and `DESKTOP` (`min-width: 1024px`).

**`app/components/effects/CustomCursor.tsx`**
- Renders **only for real mouse users with motion allowed**. Touch devices and calm mode get the normal system cursor.
- Hides the system cursor by adding `html.has-custom-cursor` while mounted, removed on unmount. `globals.css` now uses `html.has-custom-cursor body { cursor: none }` instead of a global `cursor: none`.
- Starts invisible and appears on the first mouse move, with the trail starting at the pointer. It hides when the mouse leaves the window.
- **rAF leak fixed:** it tracks the latest frame id, and the trail loop *stops* once it catches the pointer, restarting on the next move. So there's no idle 60 fps loop.
- Hover detection uses **event delegation** (`mouseover` + `closest('a, button, [role=button], input, …')`), so elements rendered later work. All listeners are removed on cleanup.

**`app/components/effects/MouseSpotlight.tsx`**
- The same mouse/motion gating. Repaints at most once per animation frame. Removed `transition-all`.

**`app/components/effects/MatrixRain.tsx`**
- Not rendered in calm mode.
- `setInterval` → a time-throttled `requestAnimationFrame` loop at the same ~20 fps. It pauses automatically in hidden tabs.
- Resizing now recomputes the columns (existing ones are kept), so the rain always spans the full width.
- Null-checks the 2D context, adds `aria-hidden`, and moved the constants out of the effect.

**`app/components/effects/Scene3D.tsx`**
- `frameloop` is `'always'` while the hero is on screen, `'never'` once scrolled away (IntersectionObserver, 100px margin), and `'demand'` in calm mode, which renders a **still frame** with no auto-rotate or distortion.
- Sphere geometry went from 100×200 to 64×128 segments (visually identical at this size, ~60% fewer vertices).

**`app/components/sections/Hero.tsx`**
- `<Scene3D />` is mounted only when `useMediaQuery(DESKTOP)` is true, so **three.js is no longer downloaded or run on phones and tablets**.
- Removed the commented-out orbit-ring code.

**`app/components/effects/MotionProvider.tsx`** (new) + **`app/layout.tsx`**
- Wraps the page in `<MotionConfig reducedMotion="user">`. In calm mode, Framer Motion skips slide, scale and float animations and keeps simple fades.

**`app/globals.css`**
- The `prefers-reduced-motion: reduce` block stops the hologram shimmer, animated border, glitch heading, marquee and pulse, disables smooth scrolling, and removes the button sweep transition.
- The loading spinner is intentionally kept, because it shows progress.

### Verification
- `tsc --noEmit`: 0 errors. `next build`: succeeds (homepage 78.1 kB).
- Headless-Chrome test (CDP emulation) against `next start`. **17/17 pass:**

| Mode | Checks |
|---|---|
| **A. Desktop** | Custom cursor mounted (2 layers). It's invisible until the mouse moves, then appears at the pointer (`translate(692px, 492px)` for a move to 700,500). The system cursor is hidden via `html.has-custom-cursor`. Matrix rain and the 3D canvas are present. Shimmer is animating (`scanline`). The **hover colour works on a later-rendered filter button** (`--neon-purple`). The matrix canvas follows a resize to 1800 px. |
| **B. Calm mode** (`prefers-reduced-motion: reduce`) | No custom cursor, system cursor `auto`. **No matrix rain.** The 3D sphere is still rendered (static). Shimmer `animation-name: none`. |
| **C. Phone** (390×844, touch) | Not a fine pointer. No custom cursor, system cursor not hidden. **No 3D canvas mounted.** |
| All | No runtime errors |

- The phone screenshot shows **no stuck cursor dot** in the corner.
- **Not directly measured:** the 3D render loop pausing off-screen. It's wired through R3F's documented `frameloop` prop and IntersectionObserver, but I didn't profile frame counts.

### Noticed for later steps
- On the 390 px phone screenshot, the **mobile menu (☰) button is clipped at the right edge**. That suggests some element is wider than the viewport. To be fixed in Step 9 (Navbar) / Step 12 (responsive).

### Files touched
- `app/lib/useMediaQuery.ts` (new)
- `app/components/effects/MotionProvider.tsx` (new)
- `app/components/effects/CustomCursor.tsx`
- `app/components/effects/MouseSpotlight.tsx`
- `app/components/effects/MatrixRain.tsx`
- `app/components/effects/Scene3D.tsx`
- `app/components/sections/Hero.tsx`
- `app/layout.tsx`
- `app/globals.css`

---

## Step 9 — Navbar: scroll-spy, aria, mobile Resume, GitHub link, overflow fix

### Problem
- The active nav link only changed on **click**. Scrolling never updated it.
- The GitHub section wasn't in the nav. The Footer links were missing Experience and GitHub, and they were in a different order.
- The mobile toggle had no `aria-label`/`aria-expanded`. The mobile menu had no Resume link and couldn't be closed with Escape. The scroll listener wasn't passive.
- **Mobile menu button clipped** (noted in Step 8). A DOM overflow scan at 390 px found the page was **431 px wide**:
  - The **Footer links row** (`flex gap-6`, no wrap) was 472 px wide. That stretched the document, and the fixed navbar widened with it, pushing ☰ off-screen.
  - The Contact columns' slide-in offsets (`x: 20–30px` before animating) also stuck out past the right edge.
- At **820 px** the desktop nav (shown from `md` = 768 px) was 863 px wide and overflowed.

### Decision (from you)
Add **GitHub** to the nav, in page order.

### Changes
**`app/lib/navigation.ts`** (new)
- `NAV_ITEMS` is the single list of section links used by both the Navbar and the Footer: About · Skills · Experience · Projects · **GitHub** · Terminal · Services · Contact.

**`app/components/ui/Navbar.tsx`**
- **Scroll-spy:** an IntersectionObserver over every section (`rootMargin: -45% 0px -50% 0px`) highlights the section crossing the middle of the screen. Back in the hero, the highlight clears. The active link gets `aria-current="location"` and a permanent underline.
- **Desktop nav from `lg` (1024 px) instead of `md`.** Below that, the hamburger menu is used. At 1024–1279 px the spacing is tighter (`gap-4`, `tracking-wider`), going back to `gap-8`/`tracking-widest` from 1280 px, so 8 links + Resume fit beside the logo.
- Toggle: `aria-label` ("Open menu"/"Close menu"), `aria-expanded`, `aria-controls="mobile-menu"`, and a larger tap area.
- Mobile menu: `id="mobile-menu"`, active-link styling, a **Resume button**, **Escape closes it**, and the bar gets its solid background while the menu is open.
- `<nav aria-label="Main">`, a logo `aria-label`, decorative icons `aria-hidden`, a passive scroll listener (also run once on mount), and `rel="noopener noreferrer"` on Resume.

**`app/components/sections/Footer.tsx`**
- Links come from `NAV_ITEMS` inside `<nav aria-label="Footer">`, with **`flex-wrap`** (`gap-x-6 gap-y-3`), so they wrap on phones instead of overflowing.
- Link colour went from `text-gray-600` to `text-gray-500` for contrast.
- The back-to-top button got `aria-label="Back to top"`.

**`app/page.tsx`**
- `<main className="relative overflow-x-clip">`. Pre-animation slide-in offsets can no longer widen the page. `clip` (unlike `hidden`) creates no scroll container, so the fixed navbar and the scroll-spy are unaffected.

### Verification
- `tsc --noEmit`: 0 errors. `next build`: succeeds (homepage 78.5 kB).
- Overflow scan before the fix: 390 px → document 431 px wide (culprits listed above); 820 px → desktop nav 863 px wide.
- Headless-Chrome navbar test against `next start`. **16/16 pass:**
  - Desktop nav = About, Skills, Experience, Projects, GitHub, Terminal, Services, Contact, Resume.
  - Scroll-spy: no highlight in the hero → **About / Experience / GitHub / Contact** highlighted as each is scrolled into view → cleared again back at the top.
  - 1280 px: the nav fits (right edge 1252 of 1276).
  - **1024 px:** the nav fits with a ≥24 px gap from the logo (logo ends at 155, links start at 204). The first attempt failed with the links touching the logo, which led to the tighter `lg` spacing.
  - Footer links = the same 8 sections in the same order. The back-to-top button has an `aria-label`.
  - **820 px and 390 px: no horizontal overflow** (`scrollWidth === clientWidth`), and the ☰ button is fully visible with `aria-label="Open menu"` and `aria-expanded="false"`.
  - The mobile menu opens with all 8 links + Resume, the toggle switches to `aria-expanded="true"` / "Close menu", and **Escape closes it**.
  - No runtime errors.
- Test note: the first scroll-spy run "failed" because the test jumped between sections while the site's `scroll-behavior: smooth` was still animating. Re-run with instant jumps, it passes. Real smooth scrolling ends in the same state.
- Screenshots: at 1024 px the links are clearly separated from the logo. The 390 px open menu shows all links, Resume and a fully visible ✕.

### Files touched
- `app/lib/navigation.ts` (new)
- `app/components/ui/Navbar.tsx`
- `app/components/sections/Footer.tsx`
- `app/page.tsx`

---

## Step 10 — Remove unused deps/CSS, fix type versions, README accuracy

### Problem
- 6 dependencies were installed but **never imported**: `gsap`, `axios`, `@radix-ui/react-tooltip`, `class-variance-authority`, `clsx`, `tailwind-merge`. I checked with a grep over `app/` for imports and requires of each package.
- `@types/three@0.170` didn't match `three@0.184`.
- Dead CSS:
  - `.terminal-line` + `@keyframes blink`, `.skill-bar-fill`, `.card-3d`, `.glow-purple`, `.glow-pink`, `.border-glow-green`
  - Duplicate `.font-display/.font-mono/.font-body`, which Tailwind already generates from `fontFamily`
  - A global `* { margin:0; padding:0; box-sizing }` that duplicates Tailwind's preflight
  - Unused `--cyber-dark`/`--cyber-card` variables
- Dead Tailwind config:
  - 7 unused animations/keyframes (`matrixRain`, `neonPulse`, `float`, `scanline`, `typing`, `glowPulse`, `borderSpin`; `scanline`/`borderSpin` now live in `globals.css`)
  - Unused `cyber.*` colours (only `cyber-black` is used), and the `backdropBlur`/`backgroundImage`/`backgroundSize` entries
  - A `content` path pointing at a non-existent `./components`
- `Hero.tsx` used a `hero-gradient` class that did nothing: the Tailwind utility would have been `bg-hero-gradient`, and an inline style already sets the gradient.
- The README claimed GSAP, `will-change: transform` and lazy-loaded GitHub images, none of which exist (the images were removed in Step 6). Its folder structure was out of date.
- (`page.tsx` as a Server Component, also listed for this step, was already done in Step 6.)

### Decision (from you)
Uninstall all 6 unused packages and bump `@types/three`.

### Changes
**`package.json` / `package-lock.json`** (via npm)
- `npm uninstall gsap axios @radix-ui/react-tooltip class-variance-authority clsx tailwind-merge`
- `npm install -D @types/three@~0.184.1`, which matches `three@0.184.0`.
- The lockfile shrank by ~360 lines.

**`app/globals.css`**
- Removed every dead rule listed above. `.glow-blue`, `.glow-green`, `.border-glow-blue` and `.border-glow-purple` stay because they're used.

**`tailwind.config.js`**
- `content` is just `./app/**`. Colours: `cyber.black` + the `neon` palette.
- Animations: only `glitch` and `marquee`, which are used. A comment notes where the CSS-driven keyframes live.

**`app/components/sections/Hero.tsx`**
- Removed the no-op `hero-gradient` class.

**`README.md`**
- The stack line and tech table no longer mention GSAP. Added Radix UI.
- The folder structure reflects the current files (API route, `lib/`, server/client section split, icon and OG image).
- The Performance section now describes what the code actually does (desktop-only 3D, paused loops, ISR GitHub data, reduced-motion support).
- "Personal Info" points to `ProjectsView.tsx` and `lib/navigation.ts`.

### Verification
- `tsc --noEmit`: 0 errors, including against the new `@types/three@0.184.1`. `next build`: succeeds. The homepage stays at 78.5 kB, since unused packages weren't bundled anyway.
- Built CSS: `@keyframes scanline/borderSpin/glitch/marquee` and `.bg-neon-blue`/`.animate-glitch` are present. `@keyframes blink`, `.skill-bar-fill`, `neonPulse` and `glowPulse` are gone.
- **Regression run** of all earlier browser suites against `next start`: Projects/modal **12/12**, Effects **17/17**, Navbar **16/16**. All pass.
- A real-time hero screenshot renders correctly, and hero h1/tagline/Resume have opacity 1. This confirms removing the global `*` reset changed nothing visible. An earlier `--virtual-time-budget` capture looked blank because headless virtual time barely advances `requestAnimationFrame` (used since Step 8); it wasn't a real problem.

### ⚠️ Security finding: `npm audit` (pre-existing, not caused by this step)
17 advisories: **1 critical**, 13 high, 2 moderate, 1 low. The important ones:

| Package | Severity | Fix |
|---|---|---|
| **`next@15.1.0`** (direct) | **critical**: Server Actions DoS, dev-server origin check, and more | `next@15.5.27`, same major |
| `postcss`, `sharp` (via next) | high | fixed by the Next upgrade |
| `eslint-config-next@15.1.0` | high (dev only) | upgrade alongside Next |
| `tailwindcss@3` → braces/micromatch/chokidar | high (build-time only) | only via Tailwind 4 (a major migration), so not urgent |
| brace-expansion, browserslist, js-yaml, nanoid | high/moderate (transitive) | `npm audit fix` (non-breaking) |

I propose this as **Step 10b**.

### Noticed for Step 12
- The hero 3D sphere's top and bottom are flattened because its container is only `h-[300px]`. This was already the case in earlier screenshots.

### Files touched
- `package.json`, `package-lock.json`
- `app/globals.css`
- `tailwind.config.js`
- `app/components/sections/Hero.tsx`
- `README.md`

---

## Step 10b — Security: upgrade Next.js 15.1.0 → 15.5.27

### Problem
`npm audit` (found in Step 10) reported 17 advisories, including **1 critical in `next@15.1.0`**: a Server Actions denial of service, a dev-server origin-verification issue, and others. Also: `postcss`/`sharp` advisories bundled with Next, and transitive high/moderate issues in `brace-expansion`, `browserslist`, `js-yaml` and `nanoid`.

### Changes
- `next` **15.1.0 → 15.5.27**, pinned exactly like before (`--save-exact`). This is the newest 15.x line, so there are no major-version changes.
- `eslint-config-next` 15.1.0 → **15.5.27**, kept in lockstep with Next.
- `npm audit fix` (non-breaking only, no `--force`). It updated the transitive packages in the lockfile.
- No application code changes were needed.

### Result
| | Before | After |
|---|---|---|
| Critical | 1 | **0** |
| High | 13 | 8 |
| Moderate | 2 | 1 |
| Low | 1 | 0 |
| **Total** | **17** | **9** |

**Remaining 9: all need a major upgrade, and none affect the running site:**
- 6 come from one `braces` advisory (stack-exhaustion DoS via deeply nested glob patterns). It's reached through `tailwindcss@3` (chokidar/micromatch) and `eslint-config-next` (fast-glob). These packages only run at **build/dev time** on your machine, on your own files. The fix needs Tailwind 4 (a migration) or a newer ESLint stack.
- 2 come from `postcss` bundled inside `next` ("XSS via unescaped `</style>` when stringifying CSS"). They need Next 16 (major). This site never stringifies untrusted CSS.
- `npm audit fix --force` would *downgrade* `eslint-config-next` to 14.x and jump to Next 16 / Tailwind 4, so I didn't run it.

### Verification (full regression on 15.5.27)
- `tsc --noEmit`: 0 errors.
- `next build`: succeeds.
  - Homepage first-load JS went from **194 kB to 192 kB**, and shared JS from 106 kB to 103 kB.
  - The route table now shows `/` with **Revalidate 1h** (the ISR from Step 6).
  - The old `metadataBase` warning no longer appears.
- `next start`:
  - `/`, `/icon.svg`, `/opengraph-image` (150 KB PNG) and `/twitter-image` all return 200.
  - Contact API: missing fields → 400, honeypot → 200 `{ok:true}`, valid but unconfigured → 500 "not configured yet".
- Browser suites: Projects/modal **12/12**, Effects **17/17**, Navbar **16/16**. Hero h1/tagline/Resume have opacity 1.
- `next dev` (what you use day to day) starts on 15.5.27, `/` returns 200, and `/opengraph-image` renders in dev too. There are no errors in the dev log.

### Files touched
- `package.json`
- `package-lock.json`

---

## Step 11 — SEO extras + ESLint + Prettier

### Problem
- No `sitemap.xml`, no `robots.txt`, no canonical URL and no structured data. Search engines got no machine-readable description of who the portfolio is about.
- The site URL `https://sagar.dev` was hardcoded in `layout.tsx`. It's still a placeholder (you haven't provided a domain).
- No ESLint config file, so `next lint` would prompt to create one, and **`next lint` is deprecated as of Next 15.5**. No Prettier, and no lint/format/typecheck scripts.

### Decisions (from you)
- **Site URL comes from an env variable** (`NEXT_PUBLIC_SITE_URL`), with `sagar.dev` only as the fallback.
- **ESLint + Prettier.** Prettier is installed and configured, but **no files were reformatted**.

### Changes
**`app/lib/site.ts`** (new)
- `SITE_URL` = `NEXT_PUBLIC_SITE_URL`, otherwise Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (automatic on Vercel), otherwise `https://sagar.dev`. Trailing slashes are stripped.
- A `SITE` object holds the name, title, description, email, GitHub and LinkedIn, shared by the metadata and the JSON-LD.

**`app/layout.tsx`**
- `metadataBase`, title and description come from `site.ts`.
- Added `alternates.canonical: '/'`. The OG url is now relative (`'/'`, resolved against `metadataBase`), and `siteName` is set.

**`app/sitemap.ts`** (new) → `/sitemap.xml`: the homepage, with `lastModified`, monthly change frequency and priority 1.

**`app/robots.ts`** (new) → `/robots.txt`: allow all, disallow `/api/`, plus sitemap and host lines.

**`app/page.tsx`**
- Added a **JSON-LD `Person`** script with name, url, email, job title, description, `worksFor` LeadRat CRM, `sameAs` (GitHub, LinkedIn) and `knowsAbout`. `<` is escaped so the JSON can't break out of the script tag.
- It uses the site's name "Sagar". Add your surname in `site.ts` if you want it in search results.

**ESLint:** `.eslintrc.json` (new)
- `next/core-web-vitals` + `next/typescript` + `prettier` (turns off rules that conflict with Prettier). Ignores `.next/`, `node_modules/` and `next-env.d.ts`.

**Prettier:** `.prettierrc.json` + `.prettierignore` (new)
- The config matches the existing code style: no semicolons, single quotes, trailing commas, 2-space indent, `printWidth` 120.

**`package.json`**
- devDependencies: `prettier@^3.9.9`, `eslint-config-prettier@^10.1.8`.
- Scripts:
  - `lint` → `eslint . --ext .js,.jsx,.mjs,.ts,.tsx` (replaces the deprecated `next lint`)
  - new `typecheck` → `tsc --noEmit`
  - new `format` → `prettier --write .`
  - new `format:check` → `prettier --check .`

**Lint fixes** (the first run found 14 errors and 4 warnings, now **0**)
- 10× `react/jsx-no-comment-textnodes`: the decorative on-screen labels like `// about.sys` and `// Hello, World!` are now written as `{'// about.sys'}`. They render identically and were confirmed in the built HTML. Files: About, Contact, CyberTerminal, Experience, GitHubView, Hero, ProjectsView, Services, Skills.
- 4× `react/no-unescaped-entities`: apostrophes in About ("I'm", "I've", "don't") and Contact ("Let's") are now `&apos;`.
- 4 unused imports removed: `useEffect`/`useRef` in Hero, `Wifi`/`Lock` in Skills.

**`.env.example` / `README.md`**
- Documented `NEXT_PUBLIC_SITE_URL`. The README gained "Site URL (SEO)" and "Scripts" sections.

### Verification
- `npm run lint`: **0 problems**. `tsc --noEmit`: 0 errors. `next build`: succeeds, and its built-in lint step passes with the new config. `/robots.txt` and `/sitemap.xml` are static routes.
- **Env override test:** built with `NEXT_PUBLIC_SITE_URL=https://test-domain.example/` (trailing slash included). robots `Host`/`Sitemap`, sitemap `<loc>`, `<link rel="canonical">`, `og:url` and JSON-LD `url` all became `https://test-domain.example`, with the slash stripped. I then rebuilt without it, and everything shows the `https://sagar.dev` fallback.
- The JSON-LD in the built HTML parses as valid JSON: `Person` / "Sagar" / sameAs GitHub + LinkedIn.
- `next start`: `/robots.txt` returns 200 `text/plain`; `/sitemap.xml` returns 200 `application/xml`.
- Browser regression: modal **12/12**, effects **17/17**, navbar **16/16**.
- `prettier --check .` reports 24 files that differ from the Prettier style. **I left them untouched on purpose.** Run `npm run format` whenever you want a one-time reformat; it's best done as its own commit.

### Still needed from you
- Set **`NEXT_PUBLIC_SITE_URL`** in `.env.local` and in Vercel once you know your domain. On Vercel it auto-detects the production domain if unset.

### Files touched
- `app/lib/site.ts` (new)
- `app/sitemap.ts` (new)
- `app/robots.ts` (new)
- `.eslintrc.json` (new)
- `.prettierrc.json` (new)
- `.prettierignore` (new)
- `app/layout.tsx`
- `app/page.tsx`
- `package.json`, `package-lock.json`
- `.env.example`
- `README.md`
- Lint fixes in `app/components/sections/`: `About.tsx`, `Contact.tsx`, `CyberTerminal.tsx`, `Experience.tsx`, `GitHubView.tsx`, `Hero.tsx`, `ProjectsView.tsx`, `Services.tsx`, `Skills.tsx`

---

## Step 12 — Live stats, responsive fixes, terminal extras, Services CTAs

### Decision (from you)
All four polish items: responsive fixes, terminal extras, Services CTAs and replacing the filler stats.

### 1. Filler stats → live GitHub numbers
- **Problem:** Hero showed "99% Committed" and About showed "∞ Problems Solved", which are filler.
- **`app/page.tsx`** (now `async`) calls `getGitHubData()`. This is the same cached request the GitHub section makes, so Next dedupes it and there are no extra API calls. It passes:
  - `Hero contributionsLastYear` → third stat: **"61 Contributions"**, with a tooltip "GitHub contributions in the last 12 months". The label says "Contributions", not "Commits", because GitHub counts PRs, issues and reviews too.
  - `About publicRepos` → fourth stat: **"13 Public Repos"**.
  - If GitHub is unreachable, both fall back to the static "4 Featured Apps".
- The Hero stats row now wraps (`flex-wrap`) on narrow phones.
- **`app/lib/site.ts`:** added a shared `GITHUB_USER`. `GitHub.tsx` and `Projects.tsx` now import it instead of each re-declaring the env lookup.

### 2. Responsive fixes
- **About:** the stats grid went from `grid-cols-4` everywhere to `grid-cols-2 sm:grid-cols-4` (2×2 on phones). The role cards went from `grid-cols-2` to `grid-cols-1 sm:grid-cols-2`.
- **Terminal ASCII banner**
  - It overflowed on phones. Measured at 390 px: the banner was **366 px wide** in a 308 px area.
  - Root cause: the `█` glyph isn't in the loaded JetBrains Mono *latin* subset, so it renders from a fallback font at **0.95 em** wide, not 0.6 em. That width varies by device, so no CSS font size can be correct everywhere.
  - Fix: the banner is now an **SVG** (`AsciiBanner`). `textLength` + `lengthAdjust="spacingAndGlyphs"` pin each line to the same width whatever the font, and the `viewBox` scales it to the container (max 620 px). A CSS `drop-shadow` keeps the glow, and it's `aria-hidden`.
  - Other terminal lines now wrap (`whitespace-pre-wrap break-words`) instead of scrolling sideways.
- **Hero 3D sphere:** it was clipped flat at the top and bottom. The container went from `h-[300px]` to `h-[420px]` and the camera from z 6 to 6.5. The sphere and its wireframe shell (about 4.8 units across) now fit the visible height (about 5.4 units).

### 3. Terminal extras (`CyberTerminal.tsx`)
- **New commands**
  - `ls`: the site sections as directories, plus `resume.pdf`.
  - `cd <section>`: smooth-scrolls the page to that section. `cd`/`cd ~` goes to the top, and an unknown section shows an error.
  - `resume`: opens `/resume.pdf` in a new tab.
  - `socials`: GitHub, LinkedIn and email.
  - `history`: numbered command history.
  - `sudo …`: an easter egg.
- **Tab autocomplete:** for command names, and for section names after `cd`.
  - A unique match completes in place. Several matches print the options (bash-style) and complete their common prefix.
  - Tab is only captured while text is typed, so on an empty prompt **Tab moves focus on (no keyboard trap)**. Shift+Tab is never captured.
- `help` is now generated from a list, with rows padded to a perfect 40-char box. It lists the new commands and a Tab tip.
- **Accessibility**
  - The input has an `aria-label`.
  - The output is a `role="log" aria-live="polite"` region.
  - The banner is hidden from screen readers, which hear "SAGAR" instead.
  - The prompt text is `aria-hidden`.
- Other fixes:
  - `clear` resets the history position.
  - The input has `min-w-0`, so it can't push the layout wider on small screens.
  - The decorative "bash — 80×24" label is hidden on phones.
  - The component is renamed `Terminal` → `CyberTerminal` to match the file.
- Section names come from the shared `NAV_ITEMS` list, so `ls`/`cd` always match the site.

### 4. Services "Discuss this →" CTAs
- **`app/lib/contactPrefill.ts`** (new): `requestContactPrefill(subject)` dispatches a `contact:prefill` browser event.
- **`Services.tsx`**
  - Each card has a **"Discuss this →"** link to `#contact`. It uses the card's colour and has an `aria-label`, and it sends the subject "<Service> inquiry".
  - The cards are now flex columns, so the links line up at the bottom.
  - Removed dead code: `style={{ color: undefined }}`, the unused `--hover-color` and `cursor-default`.
- **`Contact.tsx`** listens for the event, fills in **Subject**, and after the scroll focuses the first empty field (Name → Email → Message).

### Verification
- `tsc --noEmit`: 0 errors. `npm run lint`: 0 problems. `next build`: succeeds (homepage 80.5 kB, +2 kB for the terminal/SVG/CTA code; first-load 193 kB).
- New headless-Chrome test against `next start`. **24/24 pass:**
  - Hero stats = "3.4+ Years Exp | 15+ Projects | **61 Contributions**". About stats include "**13 Public Repos**". No "99%" or "∞".
  - The sphere canvas is 420 px tall. The screenshot shows a fully round sphere.
  - Terminal:
    - The input has an `aria-label` and the output is an aria-live log.
    - `help` rows are all exactly 40 chars and include the new commands. `ls` lists the sections + resume.pdf.
    - The `sudo` easter egg works. `history` lists earlier commands. Unknown commands show an error.
    - Tab: "pro" → "projects"; "s" lists `skills socials status sudo` and keeps "s"; "cd gi" → "cd github".
    - `cd github` scrolls GitHub to the top of the screen (0 px).
    - **Tab on an empty prompt leaves the input.** `clear` works.
  - 6 "Discuss this" links. Clicking the first fills Subject with "**Flutter App Development inquiry**", scrolls to Contact (top 0 px) and **focuses the Name field**.
  - **390 px and 360 px:** About stats 2 columns, role cards 1 column. **The banner fits exactly** (308 of 308 px; 278 of 278 px). No sideways scroll in the terminal and no page overflow.
  - No runtime errors.
- The first run had 4 failures:
  - 2 were real: the banner overflowing (366 px vs 308 px), which led to the SVG fix above.
  - 2 were a test bug: the About-grid selector picked the outer layout grid. I confirmed by measuring (2 and 1 columns were already correct) and then fixed the selector.
- Regression: Projects/modal **12/12**, Effects **17/17**, Navbar **16/16**.
- Screenshots: the 390 px terminal shows the full SAGAR banner in the box; desktop hero shows the round sphere and "61 Contributions".

### Files touched
- `app/lib/contactPrefill.ts` (new)
- `app/lib/site.ts`
- `app/page.tsx`
- `app/components/sections/Hero.tsx`
- `app/components/sections/About.tsx`
- `app/components/sections/CyberTerminal.tsx`
- `app/components/sections/Services.tsx`
- `app/components/sections/Contact.tsx`
- `app/components/sections/GitHub.tsx`
- `app/components/sections/Projects.tsx`
- `app/components/effects/Scene3D.tsx`

---

# Summary — all steps complete

| Area | Before | After |
|---|---|---|
| Production build | ❌ failed (type errors, `optimizeCss` without `critters`) | ✅ builds on Next 15.5.27 |
| Security (`npm audit`) | 1 critical, 13 high | 0 critical. The remaining 9 are build-time/dev-only and need major upgrades |
| Neon styling | ~21 class uses silently missing, 2 animations dead | all generated and animating |
| Contact form | fake (messages lost), false "encrypted" claims | real delivery via Resend; validation, honeypot, rate limit |
| Content | placeholder links/email, contradictory years and framework, invented stats | real links, consistent facts, live GitHub numbers |
| Projects | invented stars, `#` links, mouse-only, broken modal | real repos and live stats, keyboard-accessible, Radix dialog |
| GitHub section | hardcoded numbers + fake graph | live data (ISR hourly) with a real contribution graph |
| Effects | stuck cursor on phones, rAF leak, always-on loops, 3D on mobile | gated by device and motion preference, paused when hidden, calm mode |
| Navigation | click-only highlight, page overflow on phones | scroll-spy, aria, no overflow at 390–1280 px |
| SEO | no sitemap/robots/canonical/structured data, missing OG image | all present, driven by `NEXT_PUBLIC_SITE_URL` |
| Tooling | no ESLint config, deprecated `next lint`, no formatter | ESLint (0 problems), Prettier, `typecheck` script |

**Automated browser checks written and passing:** 71 (Projects/modal 12, Effects 17, Navbar 16, polish 26), plus axe-core with 0 violations.

## Your to-do list
1. **`public/resume.pdf`:** add your resume. Until then the Resume buttons stay hidden and the Hero shows "Hire me"; they appear automatically once the file exists.
2. **Resend:** set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in `.env.local` and in Vercel so the contact form delivers (see Step 3).
3. **`NEXT_PUBLIC_SITE_URL`:** set your real domain. On Vercel it auto-detects the production domain if unset.
4. **Check two content calls:**
   - The Movie App description now follows its README (Firebase/SQLite) instead of the old TMDB/BLoC/Hive text (Step 7).
   - LeadRat CRM is shown as a work project without a repo link.
5. **Optional:** run `npm run format` once, as its own commit, to apply Prettier formatting to 24 files.
6. **Commit:** nothing has been committed yet. All changes are in your working tree.

---

## Run & fix pass — run the project and fix every issue found

### How it was audited
I ran the site (`next dev`, then `next build` + `next start`) and drove headless Chrome through every section at 1400 / 1024 / 390 px:
- **Runtime:** console errors/warnings, uncaught exceptions, failed or 4xx/5xx network requests, the Next.js dev-overlay issues badge, and server log errors.
- **Links:** every `href` on the page (anchors, files, external).
- **Accessibility:** a full **axe-core 4.13** scan on desktop and phone, plus the interactive states (project popup open, mobile menu open).

### Issues found and fixed
| # | Issue | Fix |
|---|---|---|
| 1 | `THREE.Clock: This module has been deprecated` console warning. `@react-three/fiber` (even the latest 9.8.1) still calls `new THREE.Clock()`, and three.js added the deprecation in **0.183**. | Pinned `three` and `@types/three` to **`^0.182.0`**. For 0.x versions the caret locks the minor version, so it stays on 0.182.x. R3F/drei support three ≥ 0.156/0.159. |
| 2 | **HTTP 500 in dev**: `__webpack_modules__[moduleId] is not a function`. A stale `.next/` build cache (shared with earlier production builds) didn't match the new `node_modules`. | Deleted the generated `.next/` folder and restarted. No code change. *If you ever see this error after installing packages: stop the server, delete `.next`, start again.* |
| 3 | **`/resume.pdf` → 404** from the Navbar (desktop + mobile), the Hero button and the terminal `resume` command. | New `app/lib/resume.ts` `hasResume()` checks for `public/resume.pdf` on the server, and `page.tsx` passes the result down. **No file:** the Resume buttons are hidden, the Hero shows **"Hire me →"** (to `#contact`), and `resume` / `ls` explain it isn't uploaded yet. **Once you add the file**, all Resume links appear automatically (dev: on the next request; production: on the next build/deploy). Verified in both states. |
| 4 | **Colour contrast (axe: serious), 23 elements.** `text-gray-500/600/700` on near-black measured 1.99–4.24:1 (minimum 4.5:1). White text on `bg-neon-blue` measured 1.77:1. Purple `#b000ff` text measured 4.19:1. | Secondary text: 38 uses moved to **`text-gray-400`** (7.6–8.1:1). Placeholders: `gray-700` → `gray-500`. The active filter tab and the Send button use **dark text on neon-blue** (11.6:1), as do the hover fills on the Navbar/Hero buttons. The purple token is **`#b829ff`** (4.69:1, visually almost identical), updated everywhere: Tailwind, CSS variable, inline colours, favicon and OG image. |
| 5 | **Nested interactive controls (axe: serious).** Project cards were `div[role=button]` containing GitHub links. | The card is no longer interactive itself. The **project title is a real `<button>`** whose `::after` stretches over the whole card (click anywhere still opens it). The GitHub/Live links sit above it (`relative z-10`) as separate controls. The focus ring shows on the card via `has-[button:focus-visible]`. |
| 6 | **36 SVG icons announced as unlabeled images (axe: serious).** react-icons v5 renders `role="img"`. | New `app/components/Providers.tsx` wraps the app in react-icons `IconContext` with `aria-hidden` (every icon sits next to a visible label). It also hosts the existing `MotionConfig`, so `MotionProvider.tsx` was merged into it and removed. |

Two other audit findings were not site issues:
- The **"Next.js dev overlay issue"** flag was my detector matching the always-present "Open Next.js Dev Tools" button. Reading the overlay showed no issues, so I tightened the detector.
- A `favicon.ico` 404 only appeared on Next's *error page* during issue #2. The real page serves `/icon.svg`.

### Verification (final, on a production build)
- `npm run typecheck`: 0 errors. `npm run lint`: 0 problems. `next build`: succeeds (homepage 79.8 kB, first-load 193 kB).
- **Runtime audit:** no console errors/warnings, exceptions or failed requests at 1400/1024/390 px. **Dev server:** 200, clean log.
- **Links:** 19/19 OK. 9 in-page anchors resolve, plus GitHub profile and repos, LinkedIn and mailto. No `/resume.pdf` link while the file is missing.
- **axe-core: 0 violations** on desktop, phone, with the project popup open (2 cards) and with the mobile menu open.
- **Functional suites: 71/71 pass:** Projects/modal 12, Effects 17, Navbar 16, Polish 26.
  - The Navbar and polish expectations now reflect the hidden Resume link. New checks: the `resume` command message and the Hero "Hire me" fallback.
  - The keyboard tests now send realistic Enter/Space events (with key text), which native `<button>`s need.
- Screenshots: Projects (dark text on the active filter, card layout intact) and Contact (readable labels, dark text on the Send button).

### Files touched
- `package.json`, `package-lock.json` (three / @types/three → 0.182)
- `app/lib/resume.ts` (new)
- `app/components/Providers.tsx` (new; replaces `app/components/effects/MotionProvider.tsx`, removed)
- `app/layout.tsx`, `app/page.tsx`
- `app/components/ui/Navbar.tsx`, `app/components/sections/Hero.tsx`, `app/components/sections/CyberTerminal.tsx` (resume handling)
- `app/components/sections/ProjectsView.tsx` (card structure, contrast)
- Contrast/colour updates: `About.tsx`, `Contact.tsx`, `Experience.tsx`, `Footer.tsx`, `GitHubView.tsx`, `Services.tsx`, `Skills.tsx`, `app/components/effects/Scene3D.tsx`, `app/globals.css`, `tailwind.config.js`, `app/icon.svg`, `app/opengraph-image.tsx`
- `README.md` (folder tree)
