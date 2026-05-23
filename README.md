# Personal Finance Dashboard — Web App

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui. Mobile-first, Apple-inspired (black / white / red / green). This is **Phase 1**: the prototype ported to a real, type-safe, tested codebase. Data is still local (localStorage seed); Phase 2 swaps in cloud sync.

## Run it

```bash
cd webapp
npm install
npm run dev        # http://localhost:3000  (open on your phone via your LAN IP)
```

Other scripts:

```bash
npm run build      # production build
npm test           # vitest — finance engine unit tests (10 tests)
```

## What's here

- `lib/finance.ts` — XIRR, TWR, period returns, allocation, drift. Pure & unit-tested.
- `lib/finance.test.ts` — known-answer + reconciliation tests (NW 4.72 tỷ, XIRR ~14%, TWR ~11%, alloc = 100%, 2 drift flags).
- `lib/seed.ts` — verified mock dataset (19 holdings, 3 debts, 31 income, 37 snapshots).
- `lib/store.tsx` — React context + localStorage persistence + CRUD (Phase 2 replaces this with Supabase).
- `lib/format.ts`, `lib/classes.ts`, `lib/types.ts` — formatting, grayscale class palette, types.
- `components/views/*` — Overview, Holdings, Performance, Income, Manage (all five screens).
- `components/charts/Charts.tsx` — Chart.js (net-worth line, allocation donut, income bars).
- `components/ui/*` — shadcn primitives (button, card, badge, input, label, separator, sheet).
- `components/forms/Sheets.tsx` — add/edit bottom sheets for assets, transactions, debts, FX.

## Verified

`tsc --noEmit` clean · `vitest` 10/10 pass · `next build` compiles all routes.

## Next (per webapp-plan.md)

- **Phase 2** — Supabase: schema + single-account auth + RLS; replace `store.tsx` localStorage with the DB.
- **Phase 3** — price feeds (CoinGecko / FX / gold / VN + foreign stocks) via Edge Functions, with manual override.
- **Phase 4** — daily snapshot cron + drift / deposit-maturity alerts.
- **Phase 5–6** — PWA install, accessibility pass, deploy to Vercel.
