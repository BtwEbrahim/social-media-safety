import { useEffect, useState } from 'react'

// This checks REAL browser signals — not a simulation. It can't see
// third-party trackers on other sites (no page can), but it can honestly
// report what protections your own browser currently has active, which
// is the actual lever students can pull.
function checkSignals() {
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1'
  const gpc = 'globalPrivacyControl' in navigator ? navigator.globalPrivacyControl : null

  return [
    {
      label: 'Do Not Track',
      active: dnt,
      note: dnt
        ? 'Enabled — though most sites legally ignore this signal.'
        : 'Off. Most browsers ship this off by default.',
    },
    {
      label: 'Global Privacy Control',
      active: gpc === true,
      note:
        gpc === null
          ? 'Not supported by this browser.'
          : gpc
          ? 'Enabled — some jurisdictions legally require sites to honor this one.'
          : 'Off. Brave and Firefox can enable this by default.',
    },
    {
      label: 'Third-party cookies',
      active: null,
      note:
        'Can\'t be checked from a page directly — but Chrome, Firefox, and Safari now block most third-party cookies by default in recent versions.',
    },
  ]
}

export default function PrivacySignals() {
  const [signals, setSignals] = useState(null)

  useEffect(() => {
    setSignals(checkSignals())
  }, [])

  if (!signals) return null

  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-sm text-paper-dim mb-5">
        Your browser's actual signals, checked live
      </p>
      <div className="space-y-3">
        {signals.map((s) => (
          <div key={s.label} className="flex items-start gap-3">
            <span
              className={`mt-2 w-2 h-2 rounded-full shrink-0 ${
                s.active === true
                  ? 'bg-safe'
                  : s.active === false
                  ? 'bg-exposed'
                  : 'bg-paper-dim'
              }`}
            />
            <div>
              <p className="font-medium text-paper">{s.label}</p>
              <p className="text-paper-dim text-sm mt-0.5">{s.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
