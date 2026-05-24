"use client";
import { useStore } from "@/lib/store";
import { assetVND } from "@/lib/finance";
import { ClassIcon } from "@/lib/class-icons";
import { Sparkline, syntheticSeries } from "@/components/charts/Sparkline";

const ROW_TINTS = [
  { bg: "hsl(var(--pastel-peach))", line: "hsl(var(--pastel-peach-ink))" },
  { bg: "hsl(var(--pastel-sky))",   line: "hsl(var(--pastel-sky-ink))" },
  { bg: "hsl(var(--pastel-lav))",   line: "hsl(var(--pastel-lav-ink))" },
  { bg: "hsl(var(--pastel-mint))",  line: "hsl(var(--pastel-mint-ink))" },
];

export function StockMarketCard() {
  const { db, ds } = useStore();
  const rows = db.assets
    .slice()
    .sort((a, b) => assetVND(b, db.fx) - assetVND(a, db.fx))
    .slice(0, 4);

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between">
        <h3 className="bento-title">Watchlist</h3>
        <span className="text-[11px] text-muted-foreground">Top holdings</span>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((a, i) => {
          const change = a.cost > 0 ? ((a.price - a.cost) / a.cost) * 100 : 0;
          const tint = ROW_TINTS[i % ROW_TINTS.length];
          const series = syntheticSeries(a.id + "watch", 20, a.price || 1);
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-[14px] px-3 py-2.5"
              style={{ background: tint.bg }}
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/70"
                style={{ color: tint.line }}
              >
                <ClassIcon cls={a.cls} size={16} stroke={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold" style={{ color: tint.line }}>
                  {a.name}
                </div>
                <div className="tabular text-[11px]" style={{ color: tint.line, opacity: 0.7 }}>
                  {ds(assetVND(a, db.fx))}
                </div>
              </div>
              <div style={{ color: tint.line }}>
                <Sparkline data={series} width={70} height={26} stroke="currentColor" strokeWidth={1.5} />
              </div>
              <div
                className={`tabular w-14 text-right text-[11px] font-bold ${change >= 0 ? "text-pos" : "text-neg"}`}
              >
                {change >= 0 ? "+" : ""}{change.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
