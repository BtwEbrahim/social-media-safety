# Frontend

React 19 + Vite + Tailwind v4 (via `@tailwindcss/vite`). Deployed as a GitHub Pages project
site, so `base` in `vite.config.js` must stay `/social-media-safety/` unless the repo is
renamed.

## Dev

```bash
npm install
cp .env.example .env.local   # Supabase project URL + anon key — see ../backend/README.md
npm run dev
```

## Structure

- `src/pages/` — one file per route (Home, Trackers, Safety, Footprint, Security, Quiz)
- `src/components/` — shared/interactive pieces (EXIF reader, before/after slider, etc.)
- `src/hooks/useReveal.js` — Intersection Observer scroll-reveal hook, no external library
- `src/lib/supabase.js` — Supabase client singleton, reads `VITE_SUPABASE_*` env vars

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run lint` — oxlint
- `npm run deploy` — manual `gh-pages -d dist` fallback (CI via GitHub Actions is primary)
