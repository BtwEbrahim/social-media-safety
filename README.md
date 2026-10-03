# Social Media Safety & Digital Footprint Awareness

College CEP project — a React site teaching social media safety, tracking/ad-tech awareness,
digital footprint/metadata risk, and account security, built by a student team for evaluation
by external graders. Live site: https://btwebrahim.github.io/social-media-safety/

## Layout

```
frontend/   React + Vite + Tailwind v4 app. See frontend/README.md for dev setup.
backend/    Supabase (managed Postgres + Auth) config for the passwordless booking flow.
            See backend/README.md for what this actually is and isn't.
```

## Quick start

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in Supabase project URL + anon key
npm run dev
```

## Deploy

Push to `main` — GitHub Actions builds `frontend/` and publishes `frontend/dist` to GitHub
Pages automatically (`.github/workflows/deploy.yml`). Requires two repo secrets set under
Settings → Secrets and variables → Actions: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
