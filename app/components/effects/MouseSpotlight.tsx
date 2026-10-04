'use client'
import { useEffect, useRef } from 'react'
import { useMediaQuery, FINE_POINTER, REDUCED_MOTION } from '../../lib/useMediaQuery'

export default function MouseSpotlight() {
  const finePointer = useMediaQuery(FINE_POINTER)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  return finePointer && !reducedMotion ? <Spotlight /> : null
}

function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let x = 0, y = 0, rafId = 0

    // Repaint at most once per frame instead of on every mousemove event.
    const paint = () => {
      rafId = 0
      el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(0,212,255,0.04), transparent 60%)`
    }
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      if (!rafId) rafId = requestAnimationFrame(paint)
    }

    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className="fixed inset-0 z-[1] pointer-events-none" />
}
