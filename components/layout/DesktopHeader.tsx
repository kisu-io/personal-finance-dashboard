"use client";
import { useStore } from "@/lib/store";
import { fmtN } from "@/lib/format";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ViewKey } from "@/components/BottomNav";
import { IconSearch, IconBell } from "@tabler/icons-react";

const TITLE: Record<ViewKey, string> = {
  overview: "Overview",
  holdings: "Holdings",
  perf:     "Performance",
  income:   "Income",
  manage:   "Manage",
};

interface DesktopHeaderProps {
  view: ViewKey;
  onFx: () => void;
}

export function DesktopHeader({ view, onFx }: DesktopHeaderProps) {
  const { db, ccy, setCcy } = useStore();

  return (
    <header className="flex items-center gap-4 px-8 pb-2 pt-6">
      <h1 className="text-[22px] font-bold tracking-tight">{TITLE[view]}</h1>

      <div className="ml-4 flex h-9 max-w-[320px] flex-1 items-center gap-2 rounded-full bg-card px-4 ring-1 ring-border/60">
        <IconSearch size={15} stroke={1.9} className="text-muted-foreground" />
        <input
          placeholder="Search"
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
        />
      </div>

      <button
        onClick={onFx}
        className="hidden h-9 items-center gap-1.5 rounded-full bg-card px-3 text-[12px] font-medium text-muted-foreground ring-1 ring-border/60 transition-colors hover:text-foreground md:inline-flex"
        title="Edit FX rate"
      >
        <span className="tabular">1$ = {fmtN(db.fx)} ₫</span>
      </button>

      <ToggleGroup
        type="single"
        value={ccy}
        onValueChange={(v) => { if (v) setCcy(v as typeof ccy); }}
        className="h-9 gap-0 rounded-full bg-card p-0.5 ring-1 ring-border/60"
      >
        {(["VND", "USD"] as const).map((c) => (
          <ToggleGroupItem
            key={c}
            value={c}
            className="h-auto min-w-0 rounded-full px-3 py-1.5 text-[12px] font-semibold text-muted-foreground hover:bg-transparent hover:text-muted-foreground data-[state=on]:bg-foreground data-[state=on]:text-card data-[state=on]:shadow-none"
          >
            {c === "VND" ? "₫" : "$"} {c}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <button
        aria-label="Notifications"
        className="grid h-9 w-9 place-items-center rounded-full bg-card text-muted-foreground ring-1 ring-border/60 transition-colors hover:text-foreground"
      >
        <IconBell size={17} stroke={1.8} />
      </button>

      <button className="flex h-9 items-center gap-2 rounded-full bg-card pl-1 pr-3 ring-1 ring-border/60">
        <span
          className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-white"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--pastel-lav-ink)), hsl(var(--pastel-pink-ink)))",
          }}
        >
          A
        </span>
        <span className="text-[12px] font-semibold">Alexander</span>
      </button>
    </header>
  );
}
