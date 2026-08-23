import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/trackers', label: 'Trackers & Ads' },
  { to: '/safety', label: 'Social Safety' },
  { to: '/footprint', label: 'Digital Footprint' },
  { to: '/security', label: 'Account Security' },
  { to: '/quiz', label: 'Quiz' },
]

export default function Nav() {
  return (
    <header className="border-b border-ink-line/60 sticky top-0 z-40 bg-ink/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="font-data text-sm tracking-wide text-paper">
          traces<span className="text-signal-amber">.</span>
        </NavLink>
        <nav className="flex gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `font-data text-xs px-3 py-2 rounded transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-signal-teal bg-signal-teal/10'
                    : 'text-paper-dim hover:text-paper'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
