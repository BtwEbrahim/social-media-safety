import { Link } from 'react-router-dom'
import { WifiHigh, UserFocus, Fingerprint, LockKey, ArrowRight } from '@phosphor-icons/react'
import VisibleTrace from '../components/VisibleTrace'
import useReveal from '../hooks/useReveal'

const topics = [
  {
    to: '/trackers',
    icon: WifiHigh,
    title: 'Trackers & Ads',
    desc: 'Every scroll feeds a profile. See what an ad-blocker actually stops, and what it doesn\'t.',
  },
  {
    to: '/safety',
    icon: UserFocus,
    title: 'Social Safety',
    desc: 'Fake accounts, deepfakes, and scams that look real. How to spot them and what to do next.',
  },
  {
    to: '/footprint',
    icon: Fingerprint,
    title: 'Digital Footprint',
    desc: 'That photo has more data attached to it than you posted. Metadata, IP logs, and what sticks.',
  },
  {
    to: '/security',
    icon: LockKey,
    title: 'Account Security',
    desc: 'Passwords, 2FA, and passkeys — the difference between locked and merely closed.',
  },
]

function TopicRow({ topic, index }) {
  const ref = useReveal()
  const Icon = topic.icon
  return (
    <Link
      ref={ref}
      to={topic.to}
      className="reveal group relative flex items-start gap-5 py-6 pl-6 border-l border-ink-line hover:border-signal-teal transition-colors duration-300"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <span className="absolute -left-px top-0 h-0 w-px bg-signal-teal group-hover:h-full transition-all duration-500" />
      <span className="shrink-0 mt-1 text-paper-dim group-hover:text-signal-teal transition-colors duration-300">
        <Icon size={22} weight="duotone" />
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-xl font-semibold group-hover:text-signal-teal transition-colors duration-300">
            {topic.title}
          </h2>
          <ArrowRight
            size={16}
            className="text-signal-teal opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          />
        </div>
        <p className="text-paper-dim text-sm leading-relaxed mt-1 max-w-xl">
          {topic.desc}
        </p>
      </div>
    </Link>
  )
}

export default function Home() {
  const traceRef = useReveal()

  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <p
          className="rise-in font-data text-signal-amber text-xs uppercase tracking-widest mb-4"
          style={{ animationDelay: '0ms' }}
        >
          A CEP project on digital safety
        </p>
        <h1
          className="rise-in font-serif text-4xl md:text-6xl font-semibold leading-[1.1] max-w-3xl"
          style={{ animationDelay: '80ms' }}
        >
          You leave a trace on every site you visit.
          <span className="text-paper-dim"> This one shows you its own.</span>
        </h1>
        <p
          className="rise-in text-paper-dim text-lg mt-6 max-w-2xl leading-relaxed"
          style={{ animationDelay: '160ms' }}
        >
          Social media doesn't need to hack you to know a lot about you. It
          just needs you to keep using it normally. This site walks through
          four ways that happens — and what's actually in your control.
        </p>
      </section>

      <section className="pb-16 rise-in" style={{ animationDelay: '240ms' }}>
        <VisibleTrace />
      </section>

      <section ref={traceRef} className="reveal pb-24">
        <p className="font-data text-xs text-paper-dim uppercase tracking-widest mb-2">
          Four places it happens
        </p>
        <div className="flex flex-col">
          {topics.map((topic, i) => (
            <TopicRow key={topic.to} topic={topic} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
