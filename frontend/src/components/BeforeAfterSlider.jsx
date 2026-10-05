import { useEffect, useRef, useState } from 'react'

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }

  const handlePointerDown = (e) => {
    dragging.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    updateFromClientX(e.clientX)
  }

  const handlePointerMove = (e) => {
    if (!dragging.current) return
    updateFromClientX(e.clientX)
  }

  const handlePointerUp = () => {
    dragging.current = false
  }

  useEffect(() => {
    const handlePointerUpOutside = () => {
      dragging.current = false
    }

    window.addEventListener('pointerup', handlePointerUpOutside)
    return () => window.removeEventListener('pointerup', handlePointerUpOutside)
  }, [])

  return (
    <div>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl shadow-black/40 select-none cursor-ew-resize touch-none"
      >
        {/* Both images are fixed in exactly the same position. */}
        <img
          src={`${import.meta.env.BASE_URL}screenshots/after.png`}
          alt="Website with ad-blocker on — clean, trackers blocked"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Only the visible area of the BEFORE image changes. The image itself never moves. */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={`${import.meta.env.BASE_URL}screenshots/before.png`}
            alt="Website with no ad-blocker — full of ads and trackers"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Slider stays on top; it controls the clipping boundary. */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white/90 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white/20 border border-white/60 backdrop-blur-md flex items-center justify-center shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M8 6L2 12L8 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6L22 12L16 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full glass text-exposed pointer-events-none">
          No blocker
        </div>
        <div className="absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full glass text-safe pointer-events-none">
          uBO on
        </div>
      </div>
      <p className="text-paper-dim text-sm mt-3 leading-relaxed">
        Drag the slider. Same page, same visit — only the blocker setting
        changed between the two screenshots.
      </p>
    </div>
  )
}
