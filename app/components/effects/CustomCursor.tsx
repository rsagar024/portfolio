'use client'
import { useEffect, useRef } from 'react'
import { useMediaQuery, FINE_POINTER, REDUCED_MOTION } from '../../lib/useMediaQuery'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor], input, textarea, select, label'

export default function CustomCursor() {
  const finePointer = useMediaQuery(FINE_POINTER)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  // Touch devices and reduced-motion users keep the normal system cursor.
  const enabled = finePointer && !reducedMotion

  return enabled ? <Cursor /> : null
}

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    document.documentElement.classList.add('has-custom-cursor')

    let x = 0, y = 0, tx = 0, ty = 0
    let rafId = 0
    let visible = false

    // The trail eases toward the pointer; the loop stops once it catches up and restarts on the next move.
    const animate = () => {
      tx += (x - tx) * 0.12
      ty += (y - ty) * 0.12
      trail.style.transform = `translate(${tx - 20}px, ${ty - 20}px)`
      rafId = Math.abs(x - tx) > 0.1 || Math.abs(y - ty) > 0.1 ? requestAnimationFrame(animate) : 0
    }

    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      cursor.style.transform = `translate(${x - 8}px, ${y - 8}px)`
      if (!visible) {
        // Start the trail on the pointer instead of flying in from (0, 0).
        visible = true
        tx = x; ty = y
        cursor.style.opacity = '1'
        trail.style.opacity = '1'
      }
      if (!rafId) rafId = requestAnimationFrame(animate)
    }

    const hide = () => {
      visible = false
      cursor.style.opacity = '0'
      trail.style.opacity = '0'
    }

    const onDown = () => cursor.classList.add('scale-150')
    const onUp = () => cursor.classList.remove('scale-150')

    // Event delegation, so elements rendered later (modals, menus, filtered cards) get the hover state too.
    const onOver = (e: MouseEvent) => {
      const hovering = !!(e.target as Element | null)?.closest?.(INTERACTIVE)
      const color = hovering ? 'var(--neon-purple)' : 'var(--neon-blue)'
      cursor.style.background = color
      trail.style.borderColor = color
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver)
    document.documentElement.addEventListener('mouseleave', hide)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', hide)
      cancelAnimationFrame(rafId)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-4 h-4 rounded-full z-[99999] pointer-events-none transition-transform duration-75 mix-blend-screen"
        style={{ background: 'var(--neon-blue)', boxShadow: '0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue)', opacity: 0 }}
      />
      <div
        ref={trailRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-10 h-10 rounded-full z-[99998] pointer-events-none mix-blend-screen"
        style={{ border: '1px solid var(--neon-blue)', transition: 'border-color 0.3s, opacity 0.2s', opacity: 0 }}
      />
    </>
  )
}
