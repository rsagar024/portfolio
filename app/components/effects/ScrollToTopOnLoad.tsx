'use client'
import { useEffect } from 'react'

// Ensure we start at the top on fresh load if no hash is present
export default function ScrollToTopOnLoad() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [])

  return null
}
