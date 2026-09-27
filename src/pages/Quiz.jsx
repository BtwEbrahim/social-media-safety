import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const questions = [
  {
    q: 'What does an ad-blocker like Brave Shields actually stop?',
    options: [
      'It deletes ads that have already loaded',
      'It blocks the network requests that build your tracking profile',
      'It only hides ads visually, tracking still happens',
    ],
    correct: 1,
    explain:
      'Real blocking happens at the network level — stopping the request before a tracker ever gets your data, not just hiding an ad after the fact.',
  },
  {
    q: 'Someone with your exact name and photos creates an account and messages your friends for money. This is:',
    options: ['Catfishing', 'Impersonation', 'Phishing'],
    correct: 1,
    explain:
      'Catfishing uses a fake, invented identity. Impersonation copies a real, identifiable person\'s actual name and photos.',
  },
  {
    q: 'What can GPS metadata inside a photo reveal?',
    options: [
      'Only the camera model',
      'The exact location the photo was taken',
      'Nothing — metadata is just file size and format',
    ],
    correct: 1,
    explain:
      'EXIF metadata can carry precise GPS coordinates — this has been used in real cases to locate people from photos they thought were private.',
  },
  {
    q: 'Why is an authenticator app (TOTP) generally safer than SMS for 2FA?',
    options: [
      'It isn\'t — they\'re equally secure',
      'SMS can be intercepted by exploiting the phone network',
      'Authenticator apps require internet access, which is more secure',
    ],
    correct: 1,
    explain:
      'SMS relies on the cellular network\'s security, which has known interception methods. TOTP codes are generated locally from a shared secret and never transmitted.',
  },
  {
    q: 'What makes a passkey different from a password?',
    options: [
      'It\'s just a longer password',
      'It replaces the password with a cryptographic key that never leaves your device',
      'It\'s a temporary password that expires after one use',
    ],
    correct: 1,
    explain:
      'A passkey is a key pair — your device holds the private half and never sends it anywhere, so there\'s no password hash for a breach to steal.',
  },
]

export default function Quiz() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const select = (qIndex, oIndex) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [qIndex]: oIndex }))
  }

  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0
  )

  const allAnswered = questions.every((_, i) => answers[i] !== undefined)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHeader
        number="05"
        label="Quiz"
        icon="quiz"
        title="Did any of it stick?"
        intro="Five questions, one from each part of the site. No account, no tracking — same principle as everything above."
      />

      <div className="mt-12 space-y-8">
        {questions.map((q, qi) => (
          <div key={qi} className="border border-ink-line rounded-lg bg-ink-raised p-5">
            <p className="font-serif font-semibold mb-4">{qi + 1}. {q.q}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi
                const isCorrect = oi === q.correct
                let style = 'border-ink-line hover:border-paper-dim/50'
                if (submitted && isSelected && isCorrect) {
                  style = 'border-signal-teal bg-signal-teal/10'
                } else if (submitted && isSelected && !isCorrect) {
                  style = 'border-signal-amber bg-signal-amber/10'
                } else if (submitted && isCorrect) {
                  style = 'border-signal-teal/50'
                } else if (isSelected) {
                  style = 'border-paper text-paper'
                }

                return (
                  <button
                    key={oi}
                    onClick={() => select(qi, oi)}
                    className={`w-full text-left text-sm px-3 py-2 rounded border transition-colors ${style} ${
                      submitted ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {submitted && (
              <p className="text-xs text-paper-dim mt-3 leading-relaxed">
                {q.explain}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="font-data text-sm px-5 py-2.5 rounded bg-signal-teal/15 border border-signal-teal/40 text-signal-teal disabled:opacity-30 disabled:cursor-not-allowed hover:bg-signal-teal/25 transition-colors"
          >
            {allAnswered ? 'Submit' : `Answer all ${questions.length} to submit`}
          </button>
        ) : (
          <div className="border border-ink-line rounded-lg bg-ink-raised p-5 text-center">
            <p className="font-serif text-2xl font-semibold">
              {score} / {questions.length}
            </p>
            <p className="text-paper-dim text-sm mt-1">
              {score === questions.length
                ? 'All correct.'
                : 'Scroll up for explanations on anything you missed.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
