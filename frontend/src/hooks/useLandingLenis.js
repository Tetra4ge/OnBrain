import { useEffect } from 'react'
import Lenis from 'lenis'

// Deliberately used by HomePage only. Workspace routes retain native scrolling
// so dense tables, drawers, chat and file-drop interactions stay predictable.
export default function useLandingLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
      autoRaf: false,
    })
    let frameId
    const raf = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])
}
