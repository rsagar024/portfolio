/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#020408',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#b829ff',
          cyan: '#00fff7',
          green: '#00ff88',
          pink: '#ff0080',
          yellow: '#ffcc00',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['var(--font-display)', 'Orbitron', 'sans-serif'],
        body: ['var(--font-body)', 'Rajdhani', 'sans-serif'],
      },
      // Keyframes used directly from CSS (scanline, borderSpin) live in app/globals.css.
      animation: {
        'glitch': 'glitch 3s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)', clipPath: 'none' },
          '92%': { transform: 'translate(-2px, 1px)', clipPath: 'inset(10% 0 60% 0)' },
          '94%': { transform: 'translate(2px, -1px)', clipPath: 'inset(40% 0 20% 0)' },
          '96%': { transform: 'translate(-1px, 2px)', clipPath: 'inset(70% 0 5% 0)' },
          '98%': { transform: 'translate(1px, -2px)', clipPath: 'inset(30% 0 50% 0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
