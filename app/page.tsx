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

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <GitHubSection />
      <CyberTerminal />
      <Services />
      <Contact />
      <Footer />
    </main>
  )
}
