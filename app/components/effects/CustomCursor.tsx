'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    let x = 0, y = 0, tx = 0, ty = 0

    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      cursor.style.transform = `translate(${x - 8}px, ${y - 8}px)`
    }

    const animate = () => {
      tx += (x - tx) * 0.12
      ty += (y - ty) * 0.12
      trail.style.transform = `translate(${tx - 20}px, ${ty - 20}px)`
      requestAnimationFrame(animate)
    }

    const onDown = () => cursor.classList.add('scale-150')
    const onUp = () => cursor.classList.remove('scale-150')
    const onHover = () => { cursor.style.background = 'var(--neon-purple)'; trail.style.borderColor = 'var(--neon-purple)' }
    const onLeave = () => { cursor.style.background = 'var(--neon-blue)'; trail.style.borderColor = 'var(--neon-blue)' }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onHover)
      el.addEventListener('mouseleave', onLeave)
    })

    const raf = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full z-[99999] pointer-events-none transition-transform duration-75 mix-blend-screen"
        style={{ background: 'var(--neon-blue)', boxShadow: '0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue)' }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full z-[99998] pointer-events-none mix-blend-screen"
        style={{ border: '1px solid var(--neon-blue)', transition: 'border-color 0.3s' }}
      />
    </>
  )
}
