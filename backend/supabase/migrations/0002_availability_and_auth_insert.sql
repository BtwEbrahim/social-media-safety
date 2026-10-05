-- Run AFTER 0001_bookings.sql.
--
-- Why this exists:
-- 1. The booking flow verifies an email OTP first. After verification the
--    Supabase client acts as the `authenticated` role, not `anon`, so the
--    anon-only INSERT policy from 0001 would reject every booking.
-- 2. The slot picker must show which slots are taken WITHOUT exposing other
--    visitors' names or emails. The table has no SELECT policy (on purpose),
--    so a narrow view is the only thing the public API can read.
-- 3. Two visitors must not be able to book the same slot.

-- 1. Replace the open anon insert with an authenticated one that is tied to
--    the verified email. A visitor can only insert a row for the address they
--    just proved they own.
drop policy if exists "anon can insert a booking" on public.bookings;

create policy "verified visitor can insert own booking"
  on public.bookings
  for insert
  to authenticated
  with check (email = lower(auth.jwt() ->> 'email'));

-- 2. One live booking per slot. Cancelled rows free the slot up again.
create unique index if not exists bookings_one_live_per_slot
  on public.bookings (slot_date, slot_time)
  where status <> 'cancelled';

-- 3. Availability view: dates and times only, no PII.
--    Postgres views run with their owner's rights by default, which is what
--    lets this view read the locked-down table. The Supabase security advisor
--    may flag it as "security definer"; that is intentional here because the
--    view exposes only slot_date and slot_time.
create or replace view public.booking_availability
  with (security_invoker = false) as
  select slot_date, slot_time
  from public.bookings
  where status <> 'cancelled';

grant select on public.booking_availability to anon, authenticated;
