"use client";
import { useStore } from "@/lib/store";
import { grossAssets, totalDebt, netWorth, xirr, buildFlows } from "@/lib/finance";
import { pct, arrow } from "@/lib/format";

export function NetWorthHero() {
  const { db, d, ds } = useStore();
  const nw = netWorth(db);
  const snapshots = db.snapshots;
  const prev = snapshots.length >= 2 ? snapshots[snapshots.length - 2].value : nw;
  const chg = nw - prev;
  const chgPct = prev ? (chg / prev) * 100 : 0;
  const itd = xirr(buildFlows(db));
  const pos = chg >= 0;

  return (
    <section className="bento-card">
      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Net worth
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span className="tabular text-[36px] font-bold leading-none tracking-[-0.025em]">
              {d(nw)}
            </span>
            <span
              className={`tabular inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                pos
                  ? "bg-[hsl(var(--pastel-mint))] text-[hsl(var(--pastel-mint-ink))]"
                  : "bg-[hsl(var(--pastel-peach))] text-[hsl(var(--pastel-peach-ink))]"
              }`}
            >
              {arrow(chg)} {d(Math.abs(chg))} ({pct(chgPct)})
            </span>
            <span className="text-[12px] text-muted-foreground">this month</span>
          </div>
          <div className="mt-1.5 text-[12px] text-muted-foreground">
            {db.assets.length} holdings · {db.debts.length} liabilit{db.debts.length === 1 ? "y" : "ies"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip label="Gross assets" value={ds(grossAssets(db))} tint="sky" />
          <Chip label="Liabilities"  value={ds(totalDebt(db))}   tint="peach" />
          <Chip
            label="ITD return"
            value={itd != null ? `${arrow(itd)} ${pct(itd)}` : "—"}
            tint={itd != null && itd >= 0 ? "mint" : "peach"}
          />
        </div>
      </div>
    </section>
  );
}

type Tint = "mint" | "sky" | "peach" | "lav" | "pink" | "butter";
const TINT_MAP: Record<Tint, { bg: string; ink: string }> = {
  mint:   { bg: "hsl(var(--pastel-mint))",   ink: "hsl(var(--pastel-mint-ink))" },
  sky:    { bg: "hsl(var(--pastel-sky))",    ink: "hsl(var(--pastel-sky-ink))" },
  peach:  { bg: "hsl(var(--pastel-peach))",  ink: "hsl(var(--pastel-peach-ink))" },
  lav:    { bg: "hsl(var(--pastel-lav))",    ink: "hsl(var(--pastel-lav-ink))" },
  pink:   { bg: "hsl(var(--pastel-pink))",   ink: "hsl(var(--pastel-pink-ink))" },
  butter: { bg: "hsl(var(--pastel-butter))", ink: "hsl(var(--pastel-butter-ink))" },
};

function Chip({ label, value, tint }: { label: string; value: string; tint: Tint }) {
  const { bg, ink } = TINT_MAP[tint];
  return (
    <div className="rounded-[12px] px-3 py-2" style={{ background: bg }}>
      <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: ink, opacity: 0.7 }}>
        {label}
      </div>
      <div className="tabular text-[14px] font-bold" style={{ color: ink }}>{value}</div>
    </div>
  );
}
