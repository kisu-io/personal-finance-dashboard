"use client";
import * as React from "react";
import type { ViewKey } from "@/components/BottomNav";
import type { TablerIcon } from "@/lib/class-icons";
import {
  IconLayoutGrid,
  IconWallet,
  IconChartLine,
  IconCashBanknote,
  IconSettings,
  IconHexagonalPrismPlus,
  IconPlus,
} from "@tabler/icons-react";

const NAV: { key: ViewKey; label: string; icon: TablerIcon }[] = [
  { key: "overview", label: "Dashboard",   icon: IconLayoutGrid },
  { key: "holdings", label: "Holdings",    icon: IconWallet },
  { key: "perf",     label: "Performance", icon: IconChartLine },
  { key: "income",   label: "Income",      icon: IconCashBanknote },
  { key: "manage",   label: "Manage",      icon: IconSettings },
];

interface SidebarProps {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  onAdd: () => void;
}

export function Sidebar({ view, setView, onAdd }: SidebarProps) {
  return (
    <aside className="flex h-full w-[200px] shrink-0 flex-col bg-card">
      {/* Brand */}
      <div className="px-6 pb-3 pt-7">
        <div className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-[9px] text-white"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--pastel-lav-ink)), hsl(var(--pastel-pink-ink)))",
            }}
          >
            <IconHexagonalPrismPlus size={15} stroke={2.2} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">finsa</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-2">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
          Menu
        </div>
        {NAV.map((it) => {
          const Icon = it.icon;
          const on = it.key === view;
          return (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={`group flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-[13px] font-medium transition-colors ${
                on
                  ? "bg-foreground text-card"
                  : "text-muted-foreground hover:bg-[hsl(var(--canvas))] hover:text-foreground"
              }`}
            >
              <Icon size={18} stroke={1.8} />
              {it.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom add */}
      <div className="px-3 pb-5">
        <button
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-1.5 rounded-[12px] bg-foreground px-3 py-2.5 text-[13px] font-semibold text-card transition-opacity hover:opacity-90"
        >
          <IconPlus size={16} stroke={2.2} /> Add holding
        </button>
      </div>
    </aside>
  );
}
