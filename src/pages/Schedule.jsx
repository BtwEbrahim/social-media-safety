import { useState } from 'react'

export default function Schedule() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')

  const requestCode = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setMessage('The booking service is not connected yet. Your email was not submitted.')
  }

  const verifyCode = (event) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setMessage('Enter the six-digit code from your email.')
      return
    }
    setMessage('OTP verification will be enabled when the Supabase auth connection is wired in.')
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="font-data text-signal-amber text-xs uppercase tracking-widest mb-4">
        Safety session
      </p>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight">
        Schedule a session without a password.
      </h1>
      <p className="text-paper-dim text-lg mt-5 max-w-2xl leading-relaxed">
        The booking flow is designed around email OTP authentication, so there is no
        new password to create or store.
      </p>

      <div className="mt-10 border border-ink-line rounded-lg bg-ink-raised p-6 md:p-8">
        {!sent ? (
          <form onSubmit={requestCode} className="space-y-5">
            <div>
              <label htmlFor="schedule-email" className="font-data text-xs text-paper-dim block mb-2">
                EMAIL ADDRESS
              </label>
              <input
                id="schedule-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded border border-ink-line bg-ink px-4 py-3 text-paper placeholder:text-paper-dim/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
              />
            </div>
            <button
              type="submit"
              className="font-data text-xs px-4 py-3 rounded bg-signal-teal text-paper hover:bg-signal-teal-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
            >
              REQUEST OTP
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-5">
            <div>
              <p className="font-data text-xs text-signal-teal mb-2">CODE REQUESTED</p>
              <p className="text-paper-dim text-sm">Enter the six-digit code sent to {email}.</p>
            </div>
            <div>
              <label htmlFor="schedule-code" className="font-data text-xs text-paper-dim block mb-2">
                ONE-TIME CODE
              </label>
              <input
                id="schedule-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full rounded border border-ink-line bg-ink px-4 py-3 text-paper placeholder:text-paper-dim/60 tracking-[0.35em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="font-data text-xs px-4 py-3 rounded bg-signal-teal text-paper hover:bg-signal-teal-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
              >
                VERIFY CODE
              </button>
              <button
                type="button"
                className="font-data text-xs px-4 py-3 rounded border border-ink-line text-paper-dim hover:text-paper transition-colors"
                onClick={() => {
                  setSent(false)
                  setCode('')
                  setMessage('')
                }}
              >
                CHANGE EMAIL
              </button>
            </div>
          </form>
        )}

        {message && (
          <p className="mt-5 border-l-2 border-signal-amber pl-3 text-sm text-paper-dim" role="status">
            {message}
          </p>
        )}
      </div>

      <p className="font-data text-[11px] text-paper-dim/70 mt-4">
        No credentials are stored by this page. OTP delivery and verification are pending the backend connection.
      </p>
    </div>
  )
}
