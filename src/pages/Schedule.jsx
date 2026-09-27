import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import PhosphorIcon from '../components/PhosphorIcon'

const slots = ['10:00', '11:30', '14:00', '15:30', '17:00']

function upcomingDays(count = 5) {
  const days = []
  const date = new Date()
  date.setHours(12, 0, 0, 0)

  while (days.length < count) {
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      days.push(new Date(date))
    }
    date.setDate(date.getDate() + 1)
  }

  return days
}

function formatDay(date) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function dateKey(date) {
  return date.toISOString().slice(0, 10)
}

export default function Schedule() {
  const days = useMemo(() => upcomingDays(), [])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(dateKey(days[0]))
  const [selectedTime, setSelectedTime] = useState('')
  const [message, setMessage] = useState('')

  const requestCode = (event) => {
    event.preventDefault()
    setMessage('OTP delivery is not connected yet. Nothing was submitted.')
    setStep(2)
  }

  const verifyCode = (event) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setMessage('Enter the six-digit code from your email.')
      return
    }
    setMessage('Code format accepted. Slot selection is ready; Supabase verification is still pending.')
    setStep(3)
  }

  const bookSlot = (event) => {
    event.preventDefault()
    if (!selectedTime) return
    setMessage('The slot is selected locally. The booking write will be enabled with the Supabase connection.')
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
      <PageHeader
        number="06"
        label="Safety Session"
        icon="schedule"
        title="Schedule a session without a password."
        intro="The booking flow is designed around email OTP authentication, so there is no new password to create or store."
      />

      <div className="flex items-center gap-2 mb-6 font-data text-[11px] uppercase tracking-wider text-paper-dim">
        {[['01', 'Details'], ['02', 'Verify'], ['03', 'Choose a slot']].map(([number, label], index) => (
          <div key={number} className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded border ${step > index ? 'border-signal-teal/50 text-signal-teal bg-signal-teal/10' : 'border-ink-line'}`}>
              {number}
            </span>
            <span className={step === index + 1 ? 'text-paper' : ''}>{label}</span>
            {index < 2 && <span className="text-ink-line">/</span>}
          </div>
        ))}
      </div>

      <div className="border border-ink-line rounded-lg bg-ink-raised p-6 md:p-8">
        {step === 1 && (
          <form onSubmit={requestCode} className="space-y-5">
            <div>
              <label htmlFor="schedule-name" className="font-data text-xs text-paper-dim block mb-2">
                NAME
              </label>
              <input
                id="schedule-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded border border-ink-line bg-ink px-4 py-3 text-paper placeholder:text-paper-dim/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-teal"
              />
            </div>
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
        )}

        {step === 2 && (
          <form onSubmit={verifyCode} className="space-y-5">
            <div className="flex items-start gap-3">
              <PhosphorIcon name="security" size={24} className="text-signal-teal mt-0.5 shrink-0" />
              <div>
                <p className="font-data text-xs text-signal-teal mb-2">CODE REQUESTED</p>
                <p className="text-paper-dim text-sm">Enter the six-digit code sent to {email}.</p>
              </div>
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
                  setStep(1)
                  setCode('')
                  setMessage('')
                }}
              >
                CHANGE EMAIL
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={bookSlot} className="space-y-6">
            <div>
              <p className="font-data text-xs text-signal-teal mb-2">IDENTITY VERIFIED</p>
              <p className="text-paper-dim text-sm">Choose an available weekday and a 30-minute session time.</p>
            </div>

            <div>
              <p className="font-data text-xs text-paper-dim uppercase tracking-wider mb-3">DATE</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {days.map((day) => {
                  const value = dateKey(day)
                  const active = selectedDate === value
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setSelectedDate(value)}
                      className={`rounded border px-3 py-3 text-left transition-colors ${active ? 'border-signal-teal bg-signal-teal/10 text-signal-teal' : 'border-ink-line text-paper-dim hover:text-paper hover:border-paper-dim/50'}`}
                    >
                      <span className="font-data text-xs">{formatDay(day)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="font-data text-xs text-paper-dim uppercase tracking-wider mb-3">TIME</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {slots.map((time) => {
                  const active = selectedTime === time
                  return (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded border px-3 py-2.5 font-data text-xs transition-colors ${active ? 'border-signal-amber bg-signal-amber/10 text-signal-amber' : 'border-ink-line text-paper-dim hover:text-paper hover:border-paper-dim/50'}`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedTime}
              className="font-data text-xs px-4 py-3 rounded bg-signal-teal text-paper hover:bg-signal-teal-dim transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              CONFIRM SESSION
            </button>
          </form>
        )}

        {message && (
          <p className="mt-5 border-l-2 border-signal-amber pl-3 text-sm text-paper-dim" role="status">
            {message}
          </p>
        )}
      </div>

      <p className="font-data text-[11px] text-paper-dim/70 mt-4">
        Demo state only: no name, email, OTP, or booking is sent anywhere until the Supabase connection is enabled.
      </p>
    </div>
  )
}
