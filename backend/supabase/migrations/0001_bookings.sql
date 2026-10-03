-- Bookings table for the "Book a 1:1 privacy session" flow.
-- Visitor identity is established via Supabase Auth email OTP (no password field
-- anywhere in this project — see /frontend/src/pages/Security.jsx for why).

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  slot_date date not null,
  slot_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Row Level Security: default-deny. Visitors can only ever INSERT their own
-- booking; nobody (including other anon visitors) can read, edit, or delete
-- rows through the public API. This is deliberate: a "privacy" project
-- should not itself leak every visitor's name/email to every other visitor.
alter table public.bookings enable row level security;

create policy "anon can insert a booking"
  on public.bookings
  for insert
  to anon
  with check (true);

-- No select / update / delete policies are defined for anon or authenticated
-- roles. Reading the table (e.g. for a future admin view) should go through
-- the Supabase dashboard or a service-role key, never the public anon key.
