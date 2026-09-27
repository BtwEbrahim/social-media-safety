# Supabase setup

The schedule page uses Supabase Auth email OTP and the Data API. The browser only receives the publishable key; database access is protected by RLS.

## 1. Create the table

Open the Supabase SQL Editor and run:

`supabase/migrations/202609270001_create_bookings.sql`

The migration allows authenticated users to insert only their own booking and prevents two users from taking the same date/time slot.

## 2. Enable email OTP

Email authentication is enabled by default. In **Authentication → Email Templates → Magic Link**, use `{{ .Token }}` in the email body so Supabase sends the six-digit OTP instead of only a magic link.

For example:

```html
<h2>Your privacy session code</h2>
<p>Enter this six-digit code on the Social Media Safety site:</p>
<p>{{ .Token }}</p>
```

## 3. Local development

Copy `.env.example` to `.env.local` and fill in the project URL and publishable key from the Supabase Connect dialog.

```bash
cp .env.example .env.local
npm run dev
```

Never put a Supabase secret/service-role key in this file or in frontend code.

## 4. GitHub Pages

The Pages workflow reads:

- Repository variable: `SUPABASE_URL`
- Repository secret: `SUPABASE_PUBLISHABLE_KEY`

Add both before merging this branch into `main`. The publishable key is intended for browser use; RLS is the protection boundary.
