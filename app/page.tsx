import ScrollToTopOnLoad from './components/effects/ScrollToTopOnLoad'
import Navbar from './components/ui/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import GitHubSection from './components/sections/GitHub'
import CyberTerminal from './components/sections/CyberTerminal'
import Services from './components/sections/Services'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'
import { SITE, SITE_URL, GITHUB_USER } from './lib/site'
import { getGitHubData } from './lib/github'
import { getLivePlayStoreAppCount } from './lib/playStore'
import { hasResume } from './lib/resume'

// Structured data so search engines understand who this portfolio is about.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE_URL,
  email: `mailto:${SITE.email}`,
  jobTitle: 'Flutter Developer & React Frontend Engineer',
  description: SITE.description,
  worksFor: { '@type': 'Organization', name: 'LeadRat CRM' },
  sameAs: [SITE.github, SITE.linkedin],
  knowsAbout: ['Flutter', 'Dart', 'React', 'TypeScript', 'Firebase', 'Cybersecurity', 'Ethical Hacking', 'REST APIs'],
}

export default async function Home() {
  // Same cached request the GitHub section uses (deduped by Next), so this adds no extra API calls.
  const [github, playStoreApps] = await Promise.all([getGitHubData(GITHUB_USER), getLivePlayStoreAppCount()])
  // Live project count: own public GitHub repos + apps still published on Google Play.
  const projects = github ? { total: github.ownRepos + playStoreApps, repos: github.ownRepos, apps: playStoreApps } : null
  const resumeAvailable = hasResume()

  return (
    // overflow-x-clip: slide-in animations (initial x offsets) must not widen the page on phones.
    // `clip` (unlike `hidden`) creates no scroll container, so the fixed navbar is unaffected.
    <main className="relative overflow-x-clip">
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
      <ScrollToTopOnLoad />
      <Navbar hasResume={resumeAvailable} />
      <Hero contributionsLastYear={github?.contributionsLastYear ?? null} projects={projects} hasResume={resumeAvailable} />
      <About publicRepos={github?.publicRepos ?? null} projects={projects} />
      <Skills />
      <Experience />
      <Projects />
      <GitHubSection />
      <CyberTerminal hasResume={resumeAvailable} />
      <Services />
      <Contact />
      <Footer />
    </main>
  )
}
