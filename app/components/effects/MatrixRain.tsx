'use client'
import { useEffect, useRef } from 'react'
import { useMediaQuery, REDUCED_MOTION } from '../../lib/useMediaQuery'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF0123456789</>{}[]'
const FONT_SIZE = 14
const FRAME_MS = 50 // ~20 fps, same speed as the old setInterval

export default function MatrixRain() {
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  return reducedMotion ? null : <Rain />
}

function Rain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let drops: number[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Keep existing columns and add/remove ones so the rain always spans the full width.
      const cols = Math.floor(canvas.width / FONT_SIZE)
      drops = Array.from({ length: cols }, (_, i) => drops[i] ?? 1)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff88'
      ctx.font = `${FONT_SIZE}px JetBrains Mono`
      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE)
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }

    // requestAnimationFrame pauses automatically while the tab is hidden (setInterval kept running).
    let rafId = 0
    let last = 0
    const loop = (t: number) => {
      if (t - last >= FRAME_MS) {
        last = t
        draw()
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="matrix-canvas" aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none" />
}
