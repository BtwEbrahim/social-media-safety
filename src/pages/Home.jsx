import { Link } from 'react-router-dom'
import VisibleTrace from '../components/VisibleTrace'
import PhosphorIcon from '../components/PhosphorIcon'

const topics = [
  {
    to: '/trackers',
    icon: 'trackers',
    num: 'Trackers & Ads',
    desc: 'Every scroll feeds a profile. See what an ad-blocker actually stops, and what it doesn\'t.',
  },
  {
    to: '/safety',
    icon: 'safety',
    num: 'Social Safety',
    desc: 'Fake accounts, deepfakes, and scams that look real. How to spot them and what to do next.',
  },
  {
    to: '/footprint',
    icon: 'footprint',
    num: 'Digital Footprint',
    desc: 'That photo has more data attached to it than you posted. Metadata, IP logs, and what sticks.',
  },
  {
    to: '/security',
    icon: 'security',
    num: 'Account Security',
    desc: 'Passwords, 2FA, and passkeys — the difference between locked and merely closed.',
  },
]

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="flex items-center gap-2 mb-4">
          <PhosphorIcon name="home" size={18} className="text-signal-amber" />
          <p className="font-data text-signal-amber text-xs uppercase tracking-widest">
            A CEP project on digital safety
          </p>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-[1.1] max-w-3xl">
          You leave a trace on every site you visit.
          <span className="text-paper-dim"> This one shows you its own.</span>
        </h1>
        <p className="text-paper-dim text-lg mt-6 max-w-2xl leading-relaxed">
          Social media doesn't need to hack you to know a lot about you. It
          just needs you to keep using it normally. This site walks through
          four ways that happens — and what's actually in your control.
        </p>
      </section>

      <section className="pb-16">
        <VisibleTrace />
      </section>

      <section className="pb-24">
        <div className="grid sm:grid-cols-2 gap-4">
          {topics.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group border border-ink-line rounded-lg p-6 bg-ink-raised hover:border-signal-teal/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-signal-teal transition-colors">
                  {t.num}
                </h2>
                <PhosphorIcon name={t.icon} size={22} className="text-paper-dim group-hover:text-signal-teal transition-colors shrink-0" />
              </div>
              <p className="text-paper-dim text-sm leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
