import { WifiHigh } from '@phosphor-icons/react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import PrivacySignals from '../components/PrivacySignals'

export default function Trackers() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader icon={WifiHigh} label="Trackers & Ads" title="The ad didn't guess. It was told.">
        Most social platforms are free to use because you're not really the
        customer — advertisers are, and you're the product being described
        to them. Every like, pause, and scroll is a data point that gets
        folded into a profile.
      </PageHeader>

      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold mb-4">
          See it work
        </h2>
        <p className="text-paper-dim text-sm mb-5 max-w-2xl leading-relaxed">
          We tested a real, ad-heavy news site with the blocker off, then
          on. No mockups — this is the same page, one setting changed.
        </p>
        <BeforeAfterSlider />
      </Reveal>

      <Reveal className="mt-14 grid md:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-6 md:p-7">
          <h2 className="text-2xl font-semibold mb-3">
            What actually gets collected
          </h2>
          <ul className="space-y-3 text-paper-dim leading-relaxed">
            <li>
              <span className="text-paper font-semibold">Cookies & IDs.</span>{' '}
              small files that let a tracker recognize you across different
              sites, not just within one.
            </li>
            <li>
              <span className="text-paper font-semibold">Fingerprinting.</span>{' '}
              your screen size, fonts, and browser quirks combine into a
              near-unique signature — works even without cookies.
            </li>
            <li>
              <span className="text-paper font-semibold">Behavioral data.</span>{' '}
              what you pause on, how long you watch, what you skip — all
              logged and fed back into recommendation systems.
            </li>
          </ul>
        </div>
        <div className="glass rounded-3xl p-6 md:p-7">
          <h2 className="text-2xl font-semibold mb-3">
            What blocking actually does
          </h2>
          <p className="text-paper-dim leading-relaxed mb-3">
            Independent 2026 testing found Brave's built-in Shields blocks
            roughly 84% of third-party tracking requests by default —
            meaningfully more than Firefox's strict tracking protection
            (~57%) or Safari's (~37%), because most trackers target
            requests directly rather than just cookies.
          </p>
          <p className="text-paper-dim leading-relaxed">
            One catch worth knowing: classic uBlock Origin no longer works
            properly on Chrome as of 2026, since Chrome dropped the
            extension system it depended on. Firefox and Brave both still
            support it fully — which is part of why privacy-focused guides
            increasingly recommend switching browsers, not just adding
            extensions.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold mb-4">
          Check your own browser
        </h2>
        <PrivacySignals />
      </Reveal>
    </div>
  )
}
