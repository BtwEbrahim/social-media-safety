import BeforeAfterSlider from '../components/BeforeAfterSlider'
import PrivacySignals from '../components/PrivacySignals'

export default function Trackers() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-data text-signal-amber text-xs uppercase tracking-widest mb-4">
        01 — Trackers & Ads
      </p>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold max-w-2xl leading-tight">
        The ad didn't guess. It was told.
      </h1>
      <p className="text-paper-dim text-lg mt-5 max-w-2xl leading-relaxed">
        Most social platforms are free to use because you're not really the
        customer — advertisers are, and you're the product being described
        to them. Every like, pause, and scroll is a data point that gets
        folded into a profile.
      </p>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-semibold mb-4">
          See it work
        </h2>
        <p className="text-paper-dim text-sm mb-5 max-w-2xl leading-relaxed">
          We tested a real, ad-heavy news site with the blocker off, then
          on. No mockups — this is the same page, one setting changed.
        </p>
        <BeforeAfterSlider />
      </section>

      <section className="mt-14 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-serif text-xl font-semibold mb-3">
            What actually gets collected
          </h2>
          <ul className="space-y-3 text-sm text-paper-dim leading-relaxed">
            <li>
              <span className="text-paper font-data text-xs">COOKIES & IDS —</span>{' '}
              small files that let a tracker recognize you across different
              sites, not just within one.
            </li>
            <li>
              <span className="text-paper font-data text-xs">FINGERPRINTING —</span>{' '}
              your screen size, fonts, and browser quirks combine into a
              near-unique signature — works even without cookies.
            </li>
            <li>
              <span className="text-paper font-data text-xs">BEHAVIORAL DATA —</span>{' '}
              what you pause on, how long you watch, what you skip — all
              logged and fed back into recommendation systems.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold mb-3">
            What blocking actually does
          </h2>
          <p className="text-sm text-paper-dim leading-relaxed mb-3">
            Independent 2026 testing found Brave's built-in Shields blocks
            roughly 84% of third-party tracking requests by default —
            meaningfully more than Firefox's strict tracking protection
            (~57%) or Safari's (~37%), because most trackers target
            requests directly rather than just cookies.
          </p>
          <p className="text-sm text-paper-dim leading-relaxed">
            One catch worth knowing: classic uBlock Origin no longer works
            properly on Chrome as of 2026, since Chrome dropped the
            extension system it depended on. Firefox and Brave both still
            support it fully — which is part of why privacy-focused guides
            increasingly recommend switching browsers, not just adding
            extensions.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-semibold mb-4">
          Check your own browser
        </h2>
        <PrivacySignals />
      </section>
    </div>
  )
}
