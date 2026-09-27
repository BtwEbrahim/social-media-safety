create table public.bookings (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) default auth.uid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  email text not null,
  slot_date date not null,
  slot_time time not null,
  status text not null default 'confirmed' check (status = 'confirmed'),
  created_at timestamptz not null default now(),
  constraint bookings_email_format check (position('@' in email) > 1),
  constraint bookings_slot_unique unique (slot_date, slot_time)
);

alter table public.bookings enable row level security;

revoke all on table public.bookings from anon, authenticated;
grant insert on table public.bookings to authenticated;

create policy "Authenticated users can create their own booking"
on public.bookings
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and lower(email) = lower((select auth.jwt() ->> 'email'))
  and status = 'confirmed'
);
