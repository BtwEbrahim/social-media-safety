-- 0003_bookings_grants.sql
-- Fixes 42501 permission denied for table bookings.
-- Root cause: migration 0002 created the table but did not grant
-- INSERT privileges to the authenticated role.
-- Intentionally INSERT only. Read access is not widened here.

GRANT INSERT ON public.bookings TO authenticated;
