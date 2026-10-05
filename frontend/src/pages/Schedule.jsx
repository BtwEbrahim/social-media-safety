import { useCallback, useEffect, useState } from 'react'
import { CalendarCheck, CheckCircle } from '@phosphor-icons/react'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'

// Three fixed times a day, next five weekdays. Stored as plain date/time
// (no timezone), so the labels say which clock they mean.
const TIMES = ['11:00', '15:00', '18:00']
const DAYS_AHEAD = 5
const configured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

const pad = (n) => String(n).padStart(2, '0')
// Local date key. toISOString() would shift the date for anyone east of UTC.
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function nextWeekdays(count) {
  const out = []
  const d = new Date()
  while (out.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d))
  }
  return out
}

const input =
  'w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-paper ' +
  'focus:outline-none focus-visible:border-safe focus-visible:ring-2 focus-visible:ring-safe/30'

const primary = 'btn btn-primary'

export default function Schedule() {
  const [step, setStep] = useState('details') // details | link | slot | done
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [slot, setSlot] = useState(null) // { date, time }
  const [taken, setTaken] = useState(new Set())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const days = nextWeekdays(DAYS_AHEAD)
  const cleanEmail = email.trim().toLowerCase()
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)

  const loadTaken = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('booking_availability')
      .select('slot_date, slot_time')
    if (err) {
      setError('Could not load open slots. Refresh and try again.')
      return
    }
    setTaken(new Set(data.map((r) => `${r.slot_date}|${r.slot_time.slice(0, 5)}`)))
  }, [])

  useEffect(() => {
    let active = true

    async function resumeAfterMagicLink() {
      const { data, error: err } = await supabase.auth.getSession()
      if (!active || err || !data.session?.user?.email) return

      const savedName = localStorage.getItem('schedule_name')
      const sessionEmail = data.session.user.email.toLowerCase()
      if (!savedName) return

      setName(savedName)
      setEmail(sessionEmail)
      await loadTaken()
      if (active) setStep('slot')
    }

    resumeAfterMagicLink()

    return () => {
      active = false
    }
  }, [loadTaken])

  async function continueAfterLink() {
    setError('')
    setBusy(true)

    const { data, error: err } = await supabase.auth.getSession()
    if (err || !data.session?.user?.email) {
      setBusy(false)
      return setError('Open the sign-in link in your email first, then try again.')
    }

    const savedName = localStorage.getItem('schedule_name')
    const sessionEmail = data.session.user.email.toLowerCase()
    if (!savedName) {
      setBusy(false)
      return setError('Your booking details expired. Please start again.')
    }

    setName(savedName)
    setEmail(sessionEmail)
    await loadTaken()
    setBusy(false)
    setStep('slot')
  }

  async function sendLink(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    localStorage.setItem('schedule_name', name.trim())

    const redirectTo = `${window.location.origin}${window.location.pathname}`
    const { error: err } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    })
    setBusy(false)
    if (err) return setError(err.message)
    setStep('link')
  }

  async function book() {
    if (!slot) return
    setError('')
    setBusy(true)
    // No .select() after insert: the table has no read policy by design.
    const { error: err } = await supabase.from('bookings').insert({
      name: name.trim(),
      email: cleanEmail,
      slot_date: slot.date,
      slot_time: slot.time,
    })
    setBusy(false)
    if (err) {
      if (err.code === '23505') {
        setError('Someone booked that slot a moment ago. Pick another.')
        setSlot(null)
        loadTaken()
      } else {
        setError('Booking failed. Try again in a minute.')
      }
      return
    }
    await supabase.auth.signOut()
    localStorage.removeItem('schedule_name')
    setStep('done')
  }

  const stepNo = { details: 1, link: 2, slot: 3, done: 3 }[step]

  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 md:pt-24">
      <PageHeader icon={CalendarCheck} label="Book a session" title="No password. Just a sign-in link in your inbox.">
        Book a one-to-one privacy check with the team. We confirm your email with a
        one-time sign-in link, so there is no account to create and no password to leak.
      </PageHeader>

      {!configured && (
        <p className="mt-10 glass glass-exposed rounded-2xl p-4 text-sm text-paper-dim max-w-xl">
          Booking is switched off: the Supabase keys are missing from this build.
        </p>
      )}

      {configured && (
        <div className="mt-12 glass rounded-[2rem] p-6 md:p-8 max-w-xl">
          {step !== 'done' && (
            <p className="text-sm text-paper-dim mb-5">Step {stepNo} of 3</p>
          )}

          {step === 'details' && (
            <form onSubmit={sendLink} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-paper-dim mb-1.5">
                  Your name
                </label>
                <input id="name" className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-paper-dim mb-1.5">
                  Email address
                </label>
                <input id="email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <button type="submit" className={primary} disabled={busy || !name.trim() || !emailOk}>
                {busy ? 'Sending link' : 'Email me a sign-in link'}
              </button>
            </form>
          )}

          {step === 'link' && (
            <div className="space-y-5">
              <p className="text-paper-dim leading-relaxed">
                We sent a sign-in link to <span className="font-data text-paper">{cleanEmail}</span>.
                Open the email and click the link to verify your address.
              </p>
              <button type="button" className={primary} onClick={continueAfterLink} disabled={busy}>
                {busy ? 'Checking' : 'Continue to booking'}
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('schedule_name')
                  setError('')
                  setStep('details')
                }}
                className="block text-sm text-paper-dim hover:text-paper underline underline-offset-4"
              >
                Use a different email
              </button>
            </div>
          )}

          {step === 'slot' && (
            <div>
              <p className="text-paper-dim mb-5">
                Pick a time, {name.trim().split(' ')[0]}. Times are India Standard Time.
              </p>
              <div className="space-y-4">
                {days.map((d) => {
                  const key = dateKey(d)
                  return (
                    <div key={key} className="flex flex-wrap items-center gap-3">
                      <span className="font-medium text-sm w-28 text-paper-dim">
                        {d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      {TIMES.map((t) => {
                        const isTaken = taken.has(`${key}|${t}`)
                        const selected = slot?.date === key && slot?.time === t
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={isTaken}
                            aria-pressed={selected}
                            onClick={() => setSlot({ date: key, time: t })}
                            className={`font-data text-sm px-4 py-2 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safe ${
                              isTaken
                                ? 'border-white/8 text-paper-dim/40 line-through cursor-not-allowed'
                                : selected
                                ? 'border-safe bg-safe/20 text-safe'
                                : 'border-white/15 bg-white/5 text-paper hover:bg-white/12'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
              <button type="button" onClick={book} className={`${primary} mt-8`} disabled={busy || !slot}>
                {busy ? 'Booking' : 'Confirm this slot'}
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="glass glass-safe rounded-3xl p-6">
              <p className="flex items-center gap-2 text-2xl font-semibold text-safe">
                <CheckCircle size={22} weight="duotone" />
                Slot booked
              </p>
              <p className="text-paper-dim mt-3 leading-relaxed">
                {new Date(`${slot.date}T00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at{' '}
                <span className="font-data text-paper">{slot.time}</span> IST. We have your name and email for this
                booking only. You are signed out again.
              </p>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-5 text-sm text-exposed">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
