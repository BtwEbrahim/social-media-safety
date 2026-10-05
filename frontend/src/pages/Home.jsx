import { Link } from 'react-router-dom'
import { WifiHigh, UserFocus, Fingerprint, LockKey, ArrowUpRight } from '@phosphor-icons/react'
import VisibleTrace from '../components/VisibleTrace'
import useReveal from '../hooks/useReveal'

// Each tile gets its own size and light so the grid reads as a layout,
// not four copies of one card. span = columns out of 6 on desktop.
const topics = [
  {
    to: '/trackers',
    icon: WifiHigh,
    title: 'Trackers & ads',
    desc: "Every scroll feeds a profile. See what an ad-blocker actually stops, and what it doesn't.",
    span: 'md:col-span-4',
    glow: 'from-glow-blue/35',
    big: true,
  },
  {
    to: '/safety',
    icon: UserFocus,
    title: 'Social safety',
    desc: 'Fake accounts, deepfakes and scams that look real, and what to do next.',
    span: 'md:col-span-2',
    glow: 'from-glow-pink/30',
  },
  {
    to: '/footprint',
    icon: Fingerprint,
    title: 'Digital footprint',
    desc: 'That photo carries more data than you posted. Upload one and see.',
    span: 'md:col-span-2',
    glow: 'from-glow-cyan/30',
  },
  {
    to: '/security',
    icon: LockKey,
    title: 'Account security',
    desc: 'Passwords, 2FA and passkeys: the difference between locked and merely closed.',
    span: 'md:col-span-4',
    glow: 'from-glow-purple/35',
    big: true,
  },
]

function Tile({ topic, index }) {
  const ref = useReveal()
  const Icon = topic.icon
  return (
    <Link
      ref={ref}
      to={topic.to}
      style={{ transitionDelay: `${index * 70}ms` }}
      className={`reveal glass group relative overflow-hidden rounded-[2rem] p-7 ${topic.big ? 'min-h-52' : 'min-h-48'} flex flex-col justify-between ${topic.span} hover:border-white/25 transition-colors`}
    >
      <span className={`pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br ${topic.glow} to-transparent blur-2xl`} />
      <span className="relative grid place-items-center w-11 h-11 rounded-2xl bg-white/10 border border-white/15">
        <Icon size={22} weight="duotone" />
      </span>
      <div className="relative mt-8">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {topic.title}
          <ArrowUpRight size={18} className="opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300" />
        </h2>
        <p className="text-paper-dim mt-1.5 max-w-md">{topic.desc}</p>
      </div>
    </Link>
  )
}

export default function Home() {
  const gridRef = useReveal()

  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="pt-16 pb-10 md:pt-24 md:pb-12">
        <p className="rise-in text-paper-dim mb-5" style={{ animationDelay: '0ms' }}>
          A college CEP project on social media safety
        </p>
        <h1
          className="rise-in text-5xl md:text-7xl font-semibold leading-[1.02] max-w-4xl"
          style={{ animationDelay: '80ms' }}
        >
          You leave a trace on every site you visit.
          <span className="block bg-gradient-to-r from-glow-cyan via-glow-purple to-glow-pink bg-clip-text text-transparent">
            This one shows you its own.
          </span>
        </h1>
        <p className="rise-in text-paper-dim text-lg md:text-xl mt-7 max-w-2xl" style={{ animationDelay: '160ms' }}>
          Social media doesn't need to hack you to know a lot about you. It just
          needs you to keep using it normally. Four ways that happens, and what
          is actually in your control.
        </p>
        <div className="rise-in flex flex-wrap gap-3 mt-9" style={{ animationDelay: '220ms' }}>
          <Link to="/footprint" className="btn btn-primary">Check a photo's metadata</Link>
          <Link to="/security" className="btn btn-glass">Test a password</Link>
        </div>
      </section>

      <section className="pb-12 rise-in" style={{ animationDelay: '280ms' }}>
        <VisibleTrace />
      </section>

      <section ref={gridRef} className="reveal pb-20">
        <h2 className="text-2xl font-semibold mb-5">Where it happens</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {topics.map((t, i) => (
            <Tile key={t.to} topic={t} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
