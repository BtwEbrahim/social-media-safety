import { useEffect, useState } from 'react'

// Reads only client-side, publicly available browser info — nothing sent
// anywhere. The point is to make "what a site can see about you without
// you doing anything" concrete in the first few seconds on the page.
function collectTrace() {
  const nav = navigator
  return {
    browser: (() => {
      const ua = nav.userAgent
      if (ua.includes('Firefox')) return 'Firefox'
      if (ua.includes('Edg')) return 'Edge'
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Safari')) return 'Safari'
      return 'Unknown'
    })(),
    os: (() => {
      const p = nav.platform || nav.userAgent
      if (/Win/i.test(p)) return 'Windows'
      if (/Mac/i.test(p)) return 'macOS'
      if (/Linux/i.test(p)) return 'Linux'
      if (/Android/i.test(p)) return 'Android'
      if (/iPhone|iPad/i.test(p)) return 'iOS'
      return 'Unknown'
    })(),
    screen: `${window.screen.width}×${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: nav.language,
    cores: nav.hardwareConcurrency || 'unknown',
    doNotTrack: nav.doNotTrack === '1' ? 'on' : 'off',
  }
}

export default function VisibleTrace() {
  const [trace, setTrace] = useState(null)

  useEffect(() => {
    setTrace(collectTrace())
  }, [])

  if (!trace) return null

  const rows = [
    ['Browser', trace.browser],
    ['OS', trace.os],
    ['Screen', trace.screen],
    ['Timezone', trace.timezone],
    ['Language', trace.language],
    ['CPU cores', trace.cores],
    ['Do Not Track', trace.doNotTrack],
  ]

  return (
    <div className="border border-ink-line rounded-lg bg-ink-raised p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-signal-amber animate-pulse" />
        <p className="font-data text-xs text-signal-amber uppercase tracking-wider">
          What this page just learned about you
        </p>
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 font-data text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-paper-dim text-[11px] uppercase tracking-wide mb-0.5">
              {label}
            </dt>
            <dd className="text-paper">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-paper-dim text-xs mt-4 font-serif">
        None of this required a login, a cookie, or your permission. It's
        sitting in your browser, free for any page to read the moment it
        loads — this one included.
      </p>
    </div>
  )
}
