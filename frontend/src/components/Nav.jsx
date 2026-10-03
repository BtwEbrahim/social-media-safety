import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/trackers', label: 'Trackers & Ads' },
  { to: '/safety', label: 'Social Safety' },
  { to: '/footprint', label: 'Digital Footprint' },
  { to: '/security', label: 'Account Security' },
]

const desktopLink = ({ isActive }) =>
  `font-data text-xs px-3 py-2 rounded transition-colors whitespace-nowrap ${
    isActive ? 'text-signal-teal bg-signal-teal/10' : 'text-paper-dim hover:text-paper'
  }`

const mobileLink = ({ isActive }) =>
  `font-data text-sm px-6 py-3 border-l-2 transition-colors ${
    isActive
      ? 'text-signal-teal border-signal-teal bg-signal-teal/5'
      : 'text-paper-dim border-transparent hover:text-paper'
  }`

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-ink-line/60 sticky top-0 z-40 bg-ink/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="font-data text-sm tracking-wide text-paper">
          tracez<span className="text-signal-amber">.</span>
        </NavLink>

        <nav className="hidden md:flex gap-1" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-paper-dim hover:text-paper"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} weight="duotone" /> : <List size={24} weight="duotone" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="md:hidden flex flex-col border-t border-ink-line/60 py-2" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={mobileLink} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
