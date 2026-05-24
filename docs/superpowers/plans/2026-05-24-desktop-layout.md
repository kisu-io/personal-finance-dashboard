# Desktop Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive desktop layout (≥ 1024px) with a left sidebar alongside the unchanged mobile layout.

**Architecture:** A `useIsDesktop()` hook in `app/page.tsx` selects between two fully separate component trees — `MobileApp` (current behaviour, extracted) and `DesktopApp` (new sidebar shell). All five views, `Header`, `BottomNav`, and every `lib/` file are untouched.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `hooks/useIsDesktop.ts` | SSR-safe `matchMedia('(min-width: 1024px)')` hook |
| Create | `components/layout/MobileApp.tsx` | Mobile layout shell (extracted from `page.tsx`) |
| Create | `components/layout/Sidebar.tsx` | Desktop sidebar: stats + nav |
| Create | `components/layout/DesktopApp.tsx` | Desktop layout shell |
| Modify | `app/page.tsx` | Thin router — renders `MobileApp` or `DesktopApp` |
| Modify | `app/globals.css` | Remove `max-width`/`margin` from `body` |
| Modify | `.gitignore` | Add `.superpowers/` |

---

## Task 1: `useIsDesktop` hook

**Files:**
- Create: `hooks/useIsDesktop.ts`

- [ ] **Step 1: Create the hook**

```ts
// hooks/useIsDesktop.ts
import * as React from "react";

export function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add hooks/useIsDesktop.ts
git commit -m "feat: add useIsDesktop hook"
```

---

## Task 2: `MobileApp` layout component

**Files:**
- Create: `components/layout/MobileApp.tsx`

This is a direct extraction of the current `app/page.tsx` logic. The only addition is a `max-w-[480px] mx-auto min-h-screen` wrapper `div` that replaces the `body` constraint being removed in Task 5.

- [ ] **Step 1: Create the component**

```tsx
// components/layout/MobileApp.tsx
"use client";
import * as React from "react";
import { Header } from "@/components/Header";
import { BottomNav, type ViewKey } from "@/components/BottomNav";
import { Overview } from "@/components/views/Overview";
import { Holdings } from "@/components/views/Holdings";
import { Performance } from "@/components/views/Performance";
import { Income } from "@/components/views/Income";
import { Manage } from "@/components/views/Manage";
import { FormSheets, type SheetKind } from "@/components/forms/Sheets";

export function MobileApp() {
  const [view, setView] = React.useState<ViewKey>("overview");
  const [sheet, setSheet] = React.useState<{ kind: SheetKind; id?: string }>({ kind: null });
  const openSheet = (kind: SheetKind, id?: string) => setSheet({ kind, id });
  const closeSheet = () => setSheet({ kind: null });

  return (
    <div className="mx-auto max-w-[480px] min-h-screen">
      <div className="pb-[84px]">
        <Header onAdd={() => openSheet("asset")} onFx={() => openSheet("fx")} />
        <main className="pt-0">
          {view === "overview" && <Overview />}
          {view === "holdings" && <Holdings onEdit={(id) => openSheet("asset", id)} />}
          {view === "perf" && <Performance />}
          {view === "income" && <Income />}
          {view === "manage" && <Manage openSheet={openSheet} />}
        </main>
        <BottomNav view={view} setView={setView} />
        <FormSheets kind={sheet.kind} id={sheet.id} onClose={closeSheet} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/MobileApp.tsx
git commit -m "feat: extract MobileApp layout component"
```

---

## Task 3: `Sidebar` component

**Files:**
- Create: `components/layout/Sidebar.tsx`

The sidebar mirrors what `Header` shows (net worth, change, holdings count, currency toggle, chips, FX rate, `+` add button) and replaces `BottomNav` with a vertical nav. It reads financial data directly from `useStore()`.

- [ ] **Step 1: Create the component**

```tsx
// components/layout/Sidebar.tsx
"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { grossAssets, totalDebt, netWorth, xirr, buildFlows } from "@/lib/finance";
import { pct, arrow, fmtN } from "@/lib/format";
import type { ViewKey } from "@/components/BottomNav";

const NAV: { key: ViewKey; label: string; path: string }[] = [
  { key: "overview",  label: "Overview",     path: "M3 13h8V3H3zM13 21h8V8h-8zM13 3v3M3 17v4h8" },
  { key: "holdings",  label: "Holdings",     path: "M3 6h18M3 12h18M3 18h18" },
  { key: "perf",      label: "Performance",  path: "M3 17l6-6 4 4 7-7M14 7h5v5" },
  { key: "income",    label: "Income",       path: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { key: "manage",    label: "Manage",       path: "M12 9a3 3 0 100 6 3 3 0 000-6z M19.4 13a7.5 7.5 0 000-2l2-1.5-2-3.5-2.4 1a7 7 0 00-1.7-1L15 3h-4l-.3 2a7 7 0 00-1.7 1l-2.4-1-2 3.5L6.6 11a7.5 7.5 0 000 2l-2 1.5 2 3.5 2.4-1a7 7 0 001.7 1l.3 2h4l.3-2a7 7 0 001.7-1l2.4 1 2-3.5z" },
];

interface SidebarProps {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  onAdd: () => void;
  onFx: () => void;
}

export function Sidebar({ view, setView, onAdd, onFx }: SidebarProps) {
  const { db, ccy, setCcy, d, ds } = useStore();
  const nw = netWorth(db);
  const s = db.snapshots;
  const prev = s.length >= 2 ? s[s.length - 2].value : nw;
  const chg = nw - prev;
  const chgPct = prev ? (chg / prev) * 100 : 0;
  const itd = xirr(buildFlows(db));

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card">
      {/* Stats block */}
      <div className="border-b border-border p-5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-muted-foreground">Net worth</span>
          <button
            onClick={onAdd}
            aria-label="Add investment"
            className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[22px] font-light leading-none text-primary-foreground"
          >+</button>
        </div>

        <div className="tabular mt-1.5 text-[26px] font-extrabold leading-[1.04] tracking-[-0.03em]">{d(nw)}</div>

        <div className={`mt-1 text-xs font-bold ${chg >= 0 ? "text-pos" : "text-neg"}`}>
          {arrow(chg)} {d(Math.abs(chg))} ({pct(chgPct)}) this month
        </div>
        <div className="mt-0.5 text-xs text-faint">{db.assets.length} holdings</div>

        {/* Currency toggle */}
        <div className="mt-3.5 inline-flex rounded-[9px] bg-[#E9E9EB] p-0.5 text-[12px] font-semibold">
          {(["VND", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCcy(c)}
              className={`rounded-[7px] px-2.5 py-1.5 ${ccy === c ? "bg-card shadow-sm" : "text-foreground/70"}`}
            >
              {c === "VND" ? "₫ VND" : "$ USD"}
            </button>
          ))}
        </div>

        {/* Stat chips */}
        <div className="mt-3 flex flex-col gap-1.5">
          <Chip k="Gross assets" v={ds(grossAssets(db))} />
          <Chip k="Liabilities"  v={ds(totalDebt(db))} />
          <Chip
            k="ITD return"
            v={itd != null ? `${arrow(itd)} ${pct(itd)}` : "—"}
            tone={itd != null ? (itd >= 0 ? "pos" : "neg") : undefined}
          />
        </div>

        {/* FX rate */}
        <div onClick={onFx} className="tabular mt-2.5 cursor-pointer text-xs text-faint">
          1 $ = {fmtN(db.fx)} ₫
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5 pt-3">
        {NAV.map((it) => {
          const on = it.key === view;
          return (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors ${
                on
                  ? "bg-[#F2F2F7] font-semibold text-foreground"
                  : "text-faint hover:bg-[#F2F2F7] hover:text-foreground"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={it.path} />
              </svg>
              {it.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function Chip({ k, v, tone }: { k: string; v: string; tone?: "pos" | "neg" }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-background px-2.5 py-1.5">
      <span className="text-[11px] font-medium text-muted-foreground">{k}</span>
      <span className={`tabular text-[12px] font-bold ${tone === "pos" ? "text-pos" : tone === "neg" ? "text-neg" : ""}`}>
        {v}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Sidebar.tsx
git commit -m "feat: add desktop Sidebar component"
```

---

## Task 4: `DesktopApp` layout component

**Files:**
- Create: `components/layout/DesktopApp.tsx`

The outer `div` is `h-screen overflow-hidden flex`. The sidebar takes `h-full`. The `<main>` is `flex-1 overflow-y-auto` so it scrolls independently. `FormSheets` is rendered here so add/edit flows work on desktop.

- [ ] **Step 1: Create the component**

```tsx
// components/layout/DesktopApp.tsx
"use client";
import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Overview } from "@/components/views/Overview";
import { Holdings } from "@/components/views/Holdings";
import { Performance } from "@/components/views/Performance";
import { Income } from "@/components/views/Income";
import { Manage } from "@/components/views/Manage";
import { FormSheets, type SheetKind } from "@/components/forms/Sheets";
import type { ViewKey } from "@/components/BottomNav";

export function DesktopApp() {
  const [view, setView] = React.useState<ViewKey>("overview");
  const [sheet, setSheet] = React.useState<{ kind: SheetKind; id?: string }>({ kind: null });
  const openSheet = (kind: SheetKind, id?: string) => setSheet({ kind, id });
  const closeSheet = () => setSheet({ kind: null });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        view={view}
        setView={setView}
        onAdd={() => openSheet("asset")}
        onFx={() => openSheet("fx")}
      />
      <main className="flex-1 overflow-y-auto">
        {view === "overview"  && <Overview />}
        {view === "holdings"  && <Holdings onEdit={(id) => openSheet("asset", id)} />}
        {view === "perf"      && <Performance />}
        {view === "income"    && <Income />}
        {view === "manage"    && <Manage openSheet={openSheet} />}
      </main>
      <FormSheets kind={sheet.kind} id={sheet.id} onClose={closeSheet} />
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/DesktopApp.tsx
git commit -m "feat: add DesktopApp layout component"
```

---

## Task 5: Wire `page.tsx` and fix `globals.css`

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

Two independent changes: (a) make `page.tsx` a thin router, (b) remove the `max-width`/`margin` from `body` since `MobileApp` now owns that constraint via its wrapper `div`.

- [ ] **Step 1: Replace `app/page.tsx`**

Replace the entire file content with:

```tsx
// app/page.tsx
"use client";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { MobileApp } from "@/components/layout/MobileApp";
import { DesktopApp } from "@/components/layout/DesktopApp";

export default function Page() {
  const isDesktop = useIsDesktop();
  if (isDesktop === null) return null;
  return isDesktop ? <DesktopApp /> : <MobileApp />;
}
```

- [ ] **Step 2: Update `app/globals.css` body rule**

Find the `body { ... }` block in `@layer base` and remove `max-width: 480px;` and `margin: 0 auto;`. Leave everything else unchanged. The result should look like:

```css
body {
  @apply bg-background text-foreground font-sans antialiased;
  min-height: 100vh;
  letter-spacing: -0.01em;
}
```

- [ ] **Step 3: Update `.gitignore`**

Add `.superpowers/` on its own line at the end of `.gitignore`.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Run existing tests to confirm nothing broke**

```bash
npm test
```

Expected: `10 tests | 10 passed`.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/globals.css .gitignore
git commit -m "feat: wire desktop/mobile layout router"
```

---

## Task 6: Build verification and manual smoke test

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: exits 0, no TypeScript or webpack errors, all routes compiled.

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```

Open `http://localhost:3000`.

- [ ] **Step 3: Desktop smoke test (browser window > 1024px)**

- Sidebar is visible on the left with net worth amount, currency toggle, chips, FX rate, and five nav items
- Clicking each nav item switches the view; active item is highlighted
- `+` button in sidebar opens the add-asset sheet
- Clicking the FX rate opens the FX sheet
- Currency toggle (VND ↔ USD) updates all values in the sidebar and the active view
- Scrolling the main content area does not scroll the sidebar
- Resize window below 1024px → mobile layout appears with bottom nav and sticky header

- [ ] **Step 4: Mobile smoke test (browser window < 1024px)**

- Sticky header shows with net worth, currency toggle, chips
- Bottom nav is present
- All five views still work
- Add / edit sheets open correctly

- [ ] **Step 5: Final commit (if any fixes were needed)**

```bash
git add -p
git commit -m "fix: desktop layout smoke test corrections"
```
