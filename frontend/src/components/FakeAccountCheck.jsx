import { useState } from 'react'

const profiles = [
  {
    id: 1,
    name: 'Sarah_Miller_2024',
    handle: '@sarah.miller.official.real',
    bio: 'Model | Traveler | DM for collab 💌',
    followers: '2.1M',
    following: '3',
    posts: 12,
    isFake: true,
    reasons: [
      'Huge follower count but only 12 posts and following almost no one — real accounts with that reach usually follow people back.',
      '"Official" and "real" stuffed into the handle is a common impersonation tactic, not something genuine accounts need to say.',
      '"DM for collab" on a brand-new-looking account is a classic opener for romance and investment scams.',
    ],
  },
  {
    id: 2,
    name: 'Owais Sheikh',
    handle: '@owais.codes',
    bio: 'BSCIT student. Building things, breaking things.',
    followers: '340',
    following: '410',
    posts: 87,
    isFake: false,
    reasons: [
      'Follower and following counts are in a normal, human range.',
      'Post count and account activity look organic, built up over time.',
      'Bio is specific and low-key — not selling anything, not urging contact.',
    ],
  },
]

export default function FakeAccountCheck() {
  const [revealed, setRevealed] = useState({})

  const reveal = (id) => setRevealed((r) => ({ ...r, [id]: true }))

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {profiles.map((p) => (
        <div
          key={p.id}
          className="border border-ink-line rounded-lg bg-ink-raised p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-ink-line shrink-0" />
            <div>
              <p className="font-serif font-semibold text-sm">{p.name}</p>
              <p className="font-data text-xs text-paper-dim">{p.handle}</p>
            </div>
          </div>
          <p className="text-sm text-paper-dim mb-3">{p.bio}</p>
          <div className="flex gap-4 font-data text-xs text-paper-dim mb-4">
            <span>{p.followers} followers</span>
            <span>{p.following} following</span>
            <span>{p.posts} posts</span>
          </div>

          {!revealed[p.id] ? (
            <div className="flex gap-2">
              <button
                onClick={() => reveal(p.id)}
                className="font-data text-xs px-3 py-1.5 rounded border border-signal-amber/40 text-signal-amber hover:bg-signal-amber/10 transition-colors"
              >
                Fake
              </button>
              <button
                onClick={() => reveal(p.id)}
                className="font-data text-xs px-3 py-1.5 rounded border border-signal-teal/40 text-signal-teal hover:bg-signal-teal/10 transition-colors"
              >
                Real
              </button>
            </div>
          ) : (
            <div
              className={`rounded p-3 border ${
                p.isFake
                  ? 'border-signal-amber/30 bg-signal-amber/5'
                  : 'border-signal-teal/30 bg-signal-teal/5'
              }`}
            >
              <p
                className={`font-data text-xs uppercase tracking-wider mb-2 ${
                  p.isFake ? 'text-signal-amber' : 'text-signal-teal'
                }`}
              >
                {p.isFake ? 'This one is fake' : 'This one is real'}
              </p>
              <ul className="space-y-1.5">
                {p.reasons.map((r, i) => (
                  <li key={i} className="text-xs text-paper-dim leading-relaxed">
                    · {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
