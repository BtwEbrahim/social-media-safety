import { useEffect, useRef } from 'react'

// Adds .is-visible to an element once it scrolls into view, pairing
// with the .reveal CSS class. One observer per element, disconnects
// after first trigger — reveals don't need to re-fire on scroll-back.
export default function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
