import FakeAccountCheck from '../components/FakeAccountCheck'
import PageHeader from '../components/PageHeader'

const reportPaths = [
  {
    situation: 'Someone made a fake account pretending to be you',
    action: 'Use the platform\'s impersonation report form directly — Instagram\'s asks for a government ID to confirm you\'re really the person being impersonated. Only the real person (or their parent/guardian) can file it.',
  },
  {
    situation: 'A real account posted a deepfake or edited image of you',
    action: 'This doesn\'t fit the impersonation form — report the specific post under harassment or bullying instead. If it\'s intimate imagery, platforms and laws treat that as a distinct, more serious category.',
  },
  {
    situation: 'An ad is impersonating a brand or using a fake giveaway',
    action: 'Report the ad specifically (three-dot menu → Report ad → fraud/scam). Ad-fraud reports get reviewed faster than general impersonation reports, since they cost the platform advertiser trust directly.',
  },
]

export default function Safety() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader
        number="02"
        label="Social Media Safety"
        icon="safety"
        title="Most scams don't look like scams."
        intro="They look like a friend request, a modeling offer, a giveaway, or someone who already seems to know you. The tell is rarely in what they say — it's in the shape of the account behind it."
        narrow
      />

      <section className="mt-14">
        <h2 className="font-serif text-xl font-semibold mb-4">
          Real or fake? Click to check your read.
        </h2>
        <FakeAccountCheck />
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-semibold mb-3">
          Catfishing & impersonation — the actual difference
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-ink-line rounded-lg p-5 bg-ink-raised">
            <p className="font-data text-xs text-signal-amber uppercase tracking-wider mb-2">
              Catfishing
            </p>
            <p className="text-sm text-paper-dim leading-relaxed">
              Someone invents a persona — often with stolen photos of a
              real, unrelated person — to build a relationship or extract
              money, usually over weeks or months. The "person" doesn't
              exist; the photos belong to someone who has no idea they're
              being used.
            </p>
          </div>
          <div className="border border-ink-line rounded-lg p-5 bg-ink-raised">
            <p className="font-data text-xs text-signal-amber uppercase tracking-wider mb-2">
              Impersonation
            </p>
            <p className="text-sm text-paper-dim leading-relaxed">
              Someone copies a real, identifiable person's actual name and
              photos to pretend to be them — often to scam that person's
              own friends and followers, who assume the account really is
              them.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-semibold mb-4">
          If it happens to you: which report to file
        </h2>
        <div className="space-y-3">
          {reportPaths.map((r, i) => (
            <div
              key={i}
              className="border border-ink-line rounded-lg p-4 bg-ink-raised"
            >
              <p className="font-serif font-semibold text-sm mb-1">
                {r.situation}
              </p>
              <p className="text-sm text-paper-dim leading-relaxed">
                {r.action}
              </p>
            </div>
          ))}
        </div>
        <p className="text-paper-dim text-xs mt-4 leading-relaxed">
          One report often isn't enough — platforms weigh multiple reports
          on the same content more heavily. If friends see it too, ask them
          to report it under the same category.
        </p>
      </section>
    </div>
  )
}
