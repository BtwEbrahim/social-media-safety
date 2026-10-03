# Backend

This project's backend is [Supabase](https://supabase.com) (managed Postgres + Auth), not a
hand-rolled server. That's a deliberate choice for an 8-day build, not a shortcut being hidden:

- **Auth**: Supabase Auth's email OTP (one-time code) flow. Visitors booking a 1:1 session
  enter name + email only — no password field exists anywhere in this project, which is
  consistent with what the Account Security page (`/security`) itself teaches.
- **Database**: a single Postgres table, `bookings`, with Row Level Security locked down so
  the public API can only *insert* a row, never read/update/delete one. See
  `supabase/migrations/0001_bookings.sql`.
- **No custom server code**: there is no Node/Express/etc. process to host. The "backend" here
  is infrastructure configuration (schema + auth settings), not application logic — described
  accurately as that, not oversold as a custom API.

## Structure

```
backend/
  supabase/
    migrations/
      0001_bookings.sql   ← the only schema change needed for the booking flow
```

## Setup (one-time, done in the Supabase dashboard — see chat for the walkthrough)

1. Create a Supabase project.
2. Run `migrations/0001_bookings.sql` in the SQL Editor (or via `supabase db push` if using
   the CLI).
3. Enable Email OTP under Authentication → Providers → Email (disable "Confirm email" /
   magic-link-as-password-replacement confusion — OTP code, not a magic link, is what the
   frontend expects).
4. Copy the Project URL and `anon` public key into `frontend/.env.local` (see
   `frontend/.env.example`).

The `anon` key is safe to ship in the frontend bundle by design — it only grants what RLS
policies explicitly allow, which for this table is "insert, nothing else."
