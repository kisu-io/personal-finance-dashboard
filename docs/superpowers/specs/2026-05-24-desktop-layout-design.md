# Desktop Layout Design

**Date:** 2026-05-24  
**Status:** Approved

## Summary

Add a desktop layout (≥ 1024px) to the existing mobile-first finance dashboard. The mobile experience is unchanged. A `useIsDesktop()` hook at the page level switches between two completely separate component trees — `MobileApp` and `DesktopApp`. The five views and all `lib/` code are untouched.

---

## Layout Decisions

- **Desktop structure:** Left sidebar (≈220px, sticky full-height) + scrollable main content area
- **Sidebar contents:** Net worth stats, currency toggle, gross/debt/ITD chips, FX rate, `+` add button, five nav items
- **Content area:** Single scrolling column; cards stretch to fill full available width
- **Breakpoint:** 1024px (`lg` in Tailwind)
- **Mobile:** Entirely unchanged — sticky `Header`, bottom `BottomNav`, `max-width: 480px` body constraint

---

## Architecture

### New files

| File | Purpose |
|------|---------|
| `hooks/useIsDesktop.ts` | SSR-safe `matchMedia('(min-width: 1024px)')` hook |
| `components/layout/MobileApp.tsx` | Current mobile layout extracted from `page.tsx` |
| `components/layout/DesktopApp.tsx` | New desktop layout shell |
| `components/layout/Sidebar.tsx` | Desktop sidebar component |

### Modified files

| File | Change |
|------|--------|
| `app/page.tsx` | Thin router: uses `useIsDesktop()`, renders `<MobileApp>` or `<DesktopApp>` |
| `app/globals.css` | Remove `max-width: 480px` and `margin: 0 auto` from `body`; these move to a wrapper `div` inside `MobileApp` |

### Unchanged files

All five views (`Overview`, `Holdings`, `Performance`, `Income`, `Manage`), `Header`, `BottomNav`, `FormSheets`, all `lib/` files, all `components/ui/` files.

---

## Component Details

### `hooks/useIsDesktop.ts`

```ts
// Returns null on server/first paint (no render), true/false after mount.
// Listens to matchMedia for resize changes.
```

- Returns `null` until `useEffect` fires (avoids SSR hydration mismatch)
- Adds/removes `matchMedia` listener on mount/unmount
- Threshold: `(min-width: 1024px)`

### `app/page.tsx`

```tsx
const isDesktop = useIsDesktop();
if (isDesktop === null) return null; // mounting — avoid flash
return isDesktop ? <DesktopApp /> : <MobileApp />;
```

### `components/layout/MobileApp.tsx`

Exact extraction of current `app/page.tsx` logic:
- Owns `view` and `sheet` state
- Renders `<Header>` + view content + `<BottomNav>` + `<FormSheets>`
- Wraps content in a `div` with `max-w-[480px] mx-auto` (replaces the removed body constraint)

### `components/layout/DesktopApp.tsx`

```tsx
// flex h-screen overflow-hidden
// <Sidebar> (fixed left column) + <main className="flex-1 overflow-y-auto"> (active view)
```

- Owns `view` and `sheet` state (same shape as MobileApp)
- Renders `<Sidebar>` + the active view + `<FormSheets>`
- No `Header`, no `BottomNav`

### `components/layout/Sidebar.tsx`

Sections (top to bottom):

1. **Stats block** — "Net worth" label, large `d(nw)` amount, change arrow + `d(|chg|)` + `pct(chgPct)` + "this month", holdings count
2. **Currency toggle** — VND / USD pill (same as `Header`)
3. **Chips row** — Gross assets · Liabilities · ITD return (same data as `Header` chips)
4. **FX rate** — tap/click to open FX sheet
5. **Divider**
6. **Nav items** — Overview, Holdings, Performance, Income, Manage (vertical list, active item highlighted)
7. **Add button** — `+` button in the top-right of the stats block (mirrors current `Header` placement) to open the add-asset sheet

Props: `view: ViewKey`, `setView`, `onAdd: () => void`, `onFx: () => void`

Reads from `useStore()` for all financial data (same as `Header`).

---

## Behaviour

- **Resize:** If user resizes browser across the 1024px threshold, `useIsDesktop` fires, `page.tsx` re-evaluates, the correct tree renders. State (active view, open sheet) resets on switch — acceptable for a personal tool.
- **Sheets:** `FormSheets` is rendered inside both `MobileApp` and `DesktopApp`, so add/edit flows work on both layouts.
- **Scroll:** On desktop, `<main>` is `overflow-y-auto` and the sidebar is fixed-height with its own `overflow-y-auto` if content overflows.

---

## What Is Not Changing

- Finance engine (`lib/finance.ts`) — untouched
- Store / data layer (`lib/store.tsx`) — untouched
- All five view components — untouched
- `Header`, `BottomNav`, `FormSheets` — untouched (Header and BottomNav simply don't render on desktop)
- Design tokens, CSS variables, color palette — untouched
- Tests — untouched; no new test surface introduced
