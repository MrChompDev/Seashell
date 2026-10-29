# Seashell Customs

Client website and staff portal for **Seashell Customs** — "Home of the Premades." Built with Next.js 16 (App Router, Cache Components, Turbopack), Tailwind CSS v4, and Supabase (PostgreSQL + Discord OAuth).

## Stack

- **Next.js 16.4.3** — App Router, `src/` directory, TypeScript strict
- **React 19.3** · **Tailwind CSS v4** (design tokens in `src/app/globals.css`)
- **@supabase/ssr / supabase-js** — auth (Discord provider) + Postgres data
- **lucide-react** icons · Poppins + Great Vibes via `next/font`

## Quick Start

```bash
# 1. Install (exFAT-safe: no symlinks)
npm_config_tmp="$PWD/.npmtmp" npm install --no-bin-links

# 2. Environment
cp .env.example .env.local   # fill in Supabase URL + publishable key

# 3. Database — one time
#    Paste supabase/setup.sql into the Supabase SQL editor and run it.
#    Then enable Authentication > Providers > Discord
#    (callback: https://<project-ref>.supabase.co/auth/v1/callback)

# 4. Run
npm run dev        # development
npm run build && npm run start   # production (binless: see notes)
```

> **exFAT / binless note** — this drive doesn't support symlinks, so npm runs with
> `bin-links=false`. Run binaries directly, e.g.
> `node node_modules/next/dist/bin/next build`, or add `.cmd` style wrappers.

## Structure

```
src/
  app/                  → routes
    page.tsx            → home (services, Seashell+, gallery)
    order/              → order flow
    legal/              → ToS / privacy
    staff/              → sign-in + auth status copy
    dashboard/          → auth-gated staff portal (layout performs the session check)
      documents/  agreements/  loa/  tax-calculator/  admin/
  components/           → brand marks, site/portal shells, per-page clients
  lib/
    supabase/           → config · client (browser) · server (cookies, async)
    types.ts            → row types matching the Supabase schema
    utils.ts            → cx, formatDate
  proxy.ts              → Next 16 middleware (session cookie refresh)
supabase/
  setup.sql             → schema, RLS policies, triggers, seed data
```

## Data & auth notes

- `supabase/setup.sql` defines all tables (documents, agreements, agreement_signatures, loa_requests, staff_profiles, quick_links), RLS policies, and a `handle_new_user()` trigger.
- Real Discord login; the **first ever staff login is auto-promoted to Admin** by the signup trigger. Promote further staff via `/dashboard/admin`.
- Dynamic (`ƒ`) routes (`/dashboard/*`, `/staff`) render at request time (`export const instant = false`); marketing routes (`/`, `/order`, `/legal`) are statically prerendered.
