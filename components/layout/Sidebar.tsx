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
