'use client'
import { useEffect, useRef } from 'react'

export default function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: MouseEvent) => {
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(0,212,255,0.04), transparent 60%)`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return <div ref={ref} className="fixed inset-0 z-[1] pointer-events-none transition-all duration-100" />
}
