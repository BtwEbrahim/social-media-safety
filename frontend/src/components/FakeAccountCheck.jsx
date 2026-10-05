import { useState } from 'react'

const profiles = [
  {
    id: 1,
    name: 'Sarah_Miller_2024',
    photo: 'sarah-miller.jpg',
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
    name: 'Mukarram',
    photo: 'mukarram.jpg',
    handle: '@mukarram',
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

// Profile photos live in public/profiles/. If a file is missing the
// grey circle stays, so the page never shows a broken-image icon.
function Avatar({ photo, name }) {
  const [failed, setFailed] = useState(false)
  if (!photo || failed) {
    return <div className="w-12 h-12 rounded-full bg-white/15 shrink-0" />
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}profiles/${photo}`}
      alt={`Profile photo of ${name}`}
      onError={() => setFailed(true)}
      className="w-12 h-12 rounded-full object-cover shrink-0 bg-white/15"
    />
  )
}

export default function FakeAccountCheck() {
  const [revealed, setRevealed] = useState({})

  const reveal = (id) => setRevealed((r) => ({ ...r, [id]: true }))

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {profiles.map((p) => (
        <div
          key={p.id}
          className="glass rounded-3xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <Avatar photo={p.photo} name={p.name} />
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="font-data text-xs text-paper-dim">{p.handle}</p>
            </div>
          </div>
          <p className="text-paper-dim mb-3">{p.bio}</p>
          <div className="flex gap-4 font-data text-xs text-paper-dim mb-4">
            <span><b className="text-paper font-medium">{p.followers}</b> followers</span>
            <span><b className="text-paper font-medium">{p.following}</b> following</span>
            <span><b className="text-paper font-medium">{p.posts}</b> posts</span>
          </div>

          {!revealed[p.id] ? (
            <div className="flex gap-2">
              <button
                onClick={() => reveal(p.id)}
                className="btn btn-glass btn-sm text-exposed"
              >
                Fake
              </button>
              <button
                onClick={() => reveal(p.id)}
                className="btn btn-glass btn-sm text-safe"
              >
                Real
              </button>
            </div>
          ) : (
            <div
              className={`glass rounded-2xl p-4 ${p.isFake ? 'glass-exposed' : 'glass-safe'}`}
            >
              <p
                className={`text-sm font-semibold mb-2 ${
                  p.isFake ? 'text-exposed' : 'text-safe'
                }`}
              >
                {p.isFake ? 'This one is fake' : 'This one is real'}
              </p>
              <ul className="space-y-1.5">
                {p.reasons.map((r, i) => (
                  <li key={i} className="text-sm text-paper-dim leading-relaxed">
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
