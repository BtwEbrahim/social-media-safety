import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import PhosphorIcon from './PhosphorIcon'

const links = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/trackers', label: 'Trackers & Ads', icon: 'trackers' },
  { to: '/safety', label: 'Social Safety', icon: 'safety' },
  { to: '/footprint', label: 'Digital Footprint', icon: 'footprint' },
  { to: '/security', label: 'Account Security', icon: 'security' },
  { to: '/quiz', label: 'Quiz', icon: 'quiz' },
  { to: '/schedule', label: 'Schedule', icon: 'schedule' },
]

const linkClass = ({ isActive }) =>
  `font-data text-xs px-3 py-2 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
    isActive
      ? 'text-signal-teal bg-signal-teal/10'
      : 'text-paper-dim hover:text-paper'
  }`

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className="border-b border-ink-line/60 sticky top-0 z-40 bg-ink/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <NavLink
          to="/"
          className="font-data text-sm tracking-wide text-paper"
          onClick={() => setOpen(false)}
        >
          traces<span className="text-signal-amber">.</span>
        </NavLink>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-paper-dim hover:text-paper rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((value) => !value)}
        >
          <PhosphorIcon name="menu" size={22} className="transition-transform" />
        </button>

        <nav
          id="site-navigation"
          className={`${
            open ? 'flex' : 'hidden'
          } md:flex absolute md:static left-0 right-0 top-16 md:top-auto flex-col md:flex-row gap-1 p-4 md:p-0 border-b md:border-0 border-ink-line bg-ink md:bg-transparent shadow-lg md:shadow-none overflow-x-auto`}
          aria-label="Primary navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <PhosphorIcon name={link.icon} size={16} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
