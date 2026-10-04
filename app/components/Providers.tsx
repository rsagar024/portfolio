'use client'
import { MotionConfig } from 'framer-motion'
import { IconContext, type IconContext as IconContextValue } from 'react-icons'

// App-wide client providers.
// - MotionConfig reducedMotion="user": when the OS asks for reduced motion, Framer Motion skips
//   transform/layout animations (slides, scales, floating loops) and keeps simple opacity fades.
// - IconContext: every react-icons icon on this site sits next to a visible label, so mark them
//   decorative (react-icons renders role="img" without a name, which screen readers announce as an
//   unlabeled image).
const iconContext: IconContextValue = { attr: { 'aria-hidden': true } }

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <IconContext.Provider value={iconContext}>{children}</IconContext.Provider>
    </MotionConfig>
  )
}
