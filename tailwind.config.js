/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#020408',
          dark: '#050d14',
          blue: '#00d4ff',
          purple: '#b000ff',
          cyan: '#00fff7',
          green: '#00ff88',
          pink: '#ff0080',
          card: 'rgba(5,20,40,0.7)',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['var(--font-display)', 'Orbitron', 'sans-serif'],
        body: ['var(--font-body)', 'Rajdhani', 'sans-serif'],
      },
      animation: {
        'matrix-rain': 'matrixRain 3s linear infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'type': 'typing 3.5s steps(40, end)',
        'marquee': 'marquee 25s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'border-spin': 'borderSpin 3s linear infinite',
      },
      keyframes: {
        matrixRain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '1', textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff' },
          '50%': { opacity: '0.8', textShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)', clipPath: 'none' },
          '92%': { transform: 'translate(-2px, 1px)', clipPath: 'inset(10% 0 60% 0)' },
          '94%': { transform: 'translate(2px, -1px)', clipPath: 'inset(40% 0 20% 0)' },
          '96%': { transform: 'translate(-1px, 2px)', clipPath: 'inset(70% 0 5% 0)' },
          '98%': { transform: 'translate(1px, -2px)', clipPath: 'inset(30% 0 50% 0)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200vh)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 20px #00d4ff' },
          '100%': { boxShadow: '0 0 10px #b000ff, 0 0 20px #b000ff, 0 0 40px #b000ff' },
        },
        borderSpin: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        cyber: '20px',
      },
      backgroundImage: {
        'cyber-grid': `linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)`,
        'hero-gradient': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, rgba(176,0,255,0.1) 40%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
