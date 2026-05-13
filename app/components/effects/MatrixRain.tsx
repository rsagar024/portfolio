'use client'
import { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF0123456789</>{}[]'
    const fontSize = 14
    const cols = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(cols).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff88'
      ctx.font = `${fontSize}px JetBrains Mono`
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }

    const interval = setInterval(draw, 50)
    return () => { clearInterval(interval); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} id="matrix-canvas" className="fixed inset-0 z-0 pointer-events-none" />
}
