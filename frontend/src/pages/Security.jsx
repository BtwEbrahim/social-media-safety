import { LockKey } from '@phosphor-icons/react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { useState } from 'react'

const passwordCheck = (pw) => {
  if (!pw) return null
  let score = 0
  if (pw.length >= 12) score++
  if (pw.length >= 16) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (/^(password|123456|qwerty|letmein)/i.test(pw)) score = 0
  return score
}

function PasswordStrength() {
  const [pw, setPw] = useState('')
  const score = passwordCheck(pw)
  const labels = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong', 'Very strong']
  const color =
    score === null
      ? 'bg-ink-line'
      : score <= 1
      ? 'bg-signal-amber'
      : score <= 3
      ? 'bg-signal-amber-dim'
      : 'bg-signal-teal'

  return (
    <div className="border border-ink-line rounded-lg bg-ink-raised p-5">
      <p className="font-data text-xs text-paper-dim uppercase tracking-wider mb-3">
        Type a test password — nothing is stored or sent anywhere
      </p>
      <input
        type="text"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Try one of your real patterns (not your real password)"
        className="w-full bg-ink border border-ink-line rounded px-3 py-2 font-data text-sm text-paper focus:outline-none focus:border-signal-teal/50"
      />
      <div className="flex gap-1 mt-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              score !== null && i <= score ? color : 'bg-ink-line'
            }`}
          />
        ))}
      </div>
      {score !== null && (
        <p className="font-data text-xs text-paper-dim mt-2">
          {labels[Math.min(score, 5)]}
        </p>
      )}
      <p className="text-xs text-paper-dim mt-3 leading-relaxed">
        A password manager makes this irrelevant — it generates and
        remembers a genuinely random 20+ character string per site, so
        you never have to think about strength again.
      </p>
    </div>
  )
}

export default function Security() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader icon={LockKey} label="Account Security" title="Locked and merely closed aren't the same thing.">
        Most accounts that get compromised weren't broken into — they were
        walked into, through a reused password or a login step that never
        actually verified anyone.
      </PageHeader>

      <Reveal className="mt-14">
        <h2 className="font-serif text-xl font-semibold mb-4">
          Check a password pattern
        </h2>
        <PasswordStrength />
      </Reveal>

      <Reveal className="mt-14 grid md:grid-cols-3 gap-6">
        <div>
          <p className="font-data text-xs text-signal-teal uppercase tracking-wider mb-2">
            Password managers
          </p>
          <p className="text-sm text-paper-dim leading-relaxed">
            Bitwarden and Proton Pass both use zero-knowledge encryption —
            the company itself can't read your vault, even if their
          servers were breached. Bitwarden's free tier no longer
            includes built-in 2FA code generation as of 2026; Proton Pass
            gives up to 3 free. Either is a genuine upgrade over reusing
            passwords across sites.
          </p>
        </div>
        <div>
          <p className="font-data text-xs text-signal-teal uppercase tracking-wider mb-2">
            2FA & TOTP
          </p>
          <p className="text-sm text-paper-dim leading-relaxed">
            TOTP — Time-based One-Time Password — generates a new 6-digit
            code every 30 seconds from a shared secret set up once between
            your app and the account. Both your phone and the server run
            the same clock-based formula, so the codes match without ever
            being sent over the network. This is why an authenticator app
            beats SMS codes: SMS can be intercepted by exploiting the
            phone network itself.
          </p>
        </div>
        <div>
          <p className="font-data text-xs text-signal-teal uppercase tracking-wider mb-2">
            Passkeys
          </p>
          <p className="text-sm text-paper-dim leading-relaxed">
            A passkey replaces the password entirely with a cryptographic
            key pair — your device holds a private key that never leaves
            it, and proves who you are using your fingerprint or PIN. Even
            if a site's database is breached, there's no password hash to
            steal, because there was never a password. Both Bitwarden and
            Proton Pass can store and sync passkeys.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="font-serif text-xl font-semibold mb-3">
          Where to start, realistically
        </h2>
        <p className="text-sm text-paper-dim leading-relaxed max-w-2xl">
          Pick one password manager and move your most important accounts
          first — email, banking, social media — since email is usually
          the reset path into everything else. Turn on an authenticator-app
          2FA everywhere it's offered before worrying about passkeys, which
          are newer and not yet supported everywhere. This order matters
          more than doing everything at once.
        </p>
      </Reveal>
    </div>
  )
}
