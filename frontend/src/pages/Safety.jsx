import { UserFocus } from '@phosphor-icons/react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import FakeAccountCheck from '../components/FakeAccountCheck'

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
      <PageHeader icon={UserFocus} label="Social Media Safety" title="Most scams don't look like scams.">
        They look like a friend request, a modeling offer, a giveaway, or
        someone who already seems to know you. The tell is rarely in what
        they say — it's in the shape of the account behind it.
      </PageHeader>

      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold mb-4">
          Real or fake? Click to check your read.
        </h2>
        <FakeAccountCheck />
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold mb-3">
          Catfishing & impersonation — the actual difference
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6">
            <p className="text-lg font-semibold text-exposed mb-2">
              Catfishing
            </p>
            <p className="text-paper-dim leading-relaxed">
              Someone invents a persona — often with stolen photos of a
              real, unrelated person — to build a relationship or extract
              money, usually over weeks or months. The "person" doesn't
              exist; the photos belong to someone who has no idea they're
              being used.
            </p>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="text-lg font-semibold text-exposed mb-2">
              Impersonation
            </p>
            <p className="text-paper-dim leading-relaxed">
              Someone copies a real, identifiable person's actual name and
              photos to pretend to be them — often to scam that person's
              own friends and followers, who assume the account really is
              them.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold mb-4">
          If it happens to you: which report to file
        </h2>
        <div className="space-y-3 max-w-3xl">
          {reportPaths.map((r, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-4"
            >
              <p className="font-semibold mb-1">
                {r.situation}
              </p>
              <p className="text-paper-dim leading-relaxed">
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
      </Reveal>
    </div>
  )
}
