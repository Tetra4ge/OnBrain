import { useEffect } from 'react'
import Lenis from 'lenis'

// Deliberately used by HomePage only. Workspace routes retain native scrolling
// so dense tables, drawers, chat and file-drop interactions stay predictable.
export default function useLandingLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1,
      autoRaf: false,
    })

    let frameId
    const raf = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    const handleAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      const targetId = link.getAttribute('href')
      if (!targetId || targetId === '#') return
      const targetEl = document.querySelector(targetId)
      if (targetEl) {
        event.preventDefault()
        lenis.scrollTo(targetEl, { duration: 2.2, offset: -60 })
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelAnimationFrame(frameId)
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
    }
  }, [])
}
