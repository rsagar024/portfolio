'use client'
import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query. Returns false during SSR and the first client render. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
/** A real mouse/trackpad — excludes touch screens. */
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'
export const DESKTOP = '(min-width: 1024px)'
