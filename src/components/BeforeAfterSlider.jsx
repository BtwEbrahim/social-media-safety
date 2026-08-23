import { useEffect, useRef, useState } from 'react'

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }

  const handlePointerDown = (e) => {
    dragging.current = true
    updateFromClientX(e.clientX)
  }
  const handlePointerMove = (e) => {
    if (!dragging.current) return
    updateFromClientX(e.clientX)
  }
  const handlePointerUp = () => {
    dragging.current = false
  }

  return (
    <div>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-video rounded-lg overflow-hidden border border-ink-line select-none cursor-ew-resize touch-none"
      >
        {/* After image — full width, sits underneath */}
        <img
          src="/screenshots/after.png"
          alt="Website with ad-blocker on — clean, trackers blocked"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Before image — clipped to slider position, sits on top */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${position}%` }}
        >
          <img
            src="/screenshots/before.png"
            alt="Website with no ad-blocker — full of ads and trackers"
            className="h-full object-cover"
            style={{ width: containerWidth || '100%' }}
            draggable={false}
          />
        </div>

        {/* Divider handle */}
        <div
          className="absolute inset-y-0 w-0.5 bg-paper pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-paper flex items-center justify-center shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M8 6L2 12L8 18" stroke="#0F1420" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6L22 12L16 18" stroke="#0F1420" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 font-data text-[11px] px-2 py-1 rounded bg-ink/80 text-signal-amber uppercase tracking-wider pointer-events-none">
          No blocker
        </div>
        <div className="absolute top-3 right-3 font-data text-[11px] px-2 py-1 rounded bg-ink/80 text-signal-teal uppercase tracking-wider pointer-events-none">
          uBO on
        </div>
      </div>
      <p className="text-paper-dim text-xs mt-3 leading-relaxed">
        Drag the slider. Same page, same visit — only the blocker setting
        changed between the two screenshots.
      </p>
    </div>
  )
}
