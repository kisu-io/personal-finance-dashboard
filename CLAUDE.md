# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also used as final verification)
npm test         # vitest unit tests (finance engine only)
npm run lint     # next lint
npx tsc --noEmit # type check without emitting
```

Run a single test file:
```bash
npx vitest run lib/finance.test.ts
```

## Architecture

This is a **single-page, mobile-first** Next.js 14 App Router app. There is exactly one route (`app/page.tsx`). Navigation is purely client-side view switching — no additional routes.

### Data flow

`lib/store.tsx` is the single source of truth. It wraps `DB` (from `lib/types.ts`) in React context, hydrates from `localStorage` on mount, and persists on every mutation. All five views and all forms consume `useStore()`. **Phase 2** will replace `localStorage` with Supabase.

`DB` shape:
- `assets[]` — holdings with current price, cost basis, target allocation, drift threshold
- `debts[]` — liabilities
- `txns[]` — cash-flow ledger (deposit/withdrawal/buy/sell/dividend/interest)
- `income[]` — derived from dividend/interest txns, plus direct entries
- `snapshots[]` — periodic net-worth snapshots (needed for TWR)
- `fx` — single VND/USD exchange rate (manual, replaced by price feeds in Phase 3)
- `realized` — ITD realized gains (VND)

### Finance engine (`lib/finance.ts`)

Pure functions, no React. Implements XIRR (Newton's method), TWR (chain-linked from snapshots), period returns, allocation by asset class and liquidity term, and drift detection. **All changes here require passing the 10 vitest tests in `lib/finance.test.ts`.** The seed portfolio has known answers (NW ≈ 4.72 tỷ VND, XIRR ~14%, TWR ~11%, exactly 2 drift flags: `crypto` and `savings_term`).

### Views and components

`app/page.tsx` manages the active `ViewKey` and which bottom sheet is open, passing callbacks down. Five views live in `components/views/`: Overview, Holdings, Performance, Income, Manage. Charts are isolated in `components/charts/Charts.tsx` (Chart.js via react-chartjs-2). Form bottom sheets (add/edit asset, debt, transaction, FX) live in `components/forms/Sheets.tsx`.

`components/ui/` is shadcn/ui primitives (new-york style, neutral base color). Do not modify these files by hand — use `npx shadcn@latest add <component>` to add new ones.

### Currency display

`useStore()` exposes `d(vnd)` and `ds(vnd)` helpers that format a VND amount in whichever currency (`VND`/`USD`) the user has toggled. Always use these instead of formatting numbers directly in views.

## Design

Apple-inspired, mobile-first: **black / white / red (loss) / green (gain)** palette. See `app/globals.css` for CSS custom properties and `lib/classes.ts` for the Tailwind class palette used across views.

## Roadmap context

- **Phase 2** — Supabase replaces `store.tsx` localStorage (schema + RLS + single-account auth)
- **Phase 3** — Live price feeds via Edge Functions (CoinGecko, FX, gold, stocks)
- **Phase 4** — Daily snapshot cron + drift/maturity alerts
- **Phase 5–6** — PWA, accessibility pass, Vercel deploy
