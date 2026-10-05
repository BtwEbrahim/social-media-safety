import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/trackers', label: 'Trackers' },
  { to: '/safety', label: 'Social safety' },
  { to: '/footprint', label: 'Footprint' },
  { to: '/security', label: 'Security' },
]

const desktopLink = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
    isActive
      ? 'text-paper bg-white/14 shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]'
      : 'text-paper-dim hover:text-paper hover:bg-white/8'
  }`

const mobileLink = ({ isActive }) =>
  `block px-4 py-3 rounded-2xl text-base font-medium ${
    isActive ? 'text-paper bg-white/12' : 'text-paper-dim hover:text-paper'
  }`

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="glass rounded-full max-w-4xl mx-auto flex items-center justify-between pl-5 pr-2 h-14">
        <NavLink to="/" className="flex items-center gap-2 font-display font-semibold text-lg" onClick={() => setOpen(false)}>
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-glow-cyan to-glow-pink" aria-hidden="true" />
          tracez
        </NavLink>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/schedule" className="btn btn-primary btn-sm ml-2">
            Book a session
          </NavLink>
        </nav>

        <button
          type="button"
          className="md:hidden w-10 h-10 grid place-items-center rounded-full text-paper hover:bg-white/10"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="glass rounded-3xl md:hidden max-w-4xl mx-auto mt-2 p-2" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={mobileLink} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/schedule" className="btn btn-primary w-full mt-2" onClick={() => setOpen(false)}>
            Book a session
          </NavLink>
        </nav>
      )}
    </header>
  )
}
