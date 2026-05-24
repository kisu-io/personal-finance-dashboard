"use client";
import { useStore } from "@/lib/store";
import { TXN_LABELS } from "@/lib/classes";
import { toVND } from "@/lib/finance";

const ACTION_TINTS: Record<string, { bg: string; ink: string }> = {
  deposit:    { bg: "hsl(var(--pastel-mint))",   ink: "hsl(var(--pastel-mint-ink))" },
  withdrawal: { bg: "hsl(var(--pastel-peach))",  ink: "hsl(var(--pastel-peach-ink))" },
  buy:        { bg: "hsl(var(--pastel-sky))",    ink: "hsl(var(--pastel-sky-ink))" },
  sell:       { bg: "hsl(var(--pastel-lav))",    ink: "hsl(var(--pastel-lav-ink))" },
  dividend:   { bg: "hsl(var(--pastel-butter))", ink: "hsl(var(--pastel-butter-ink))" },
  interest:   { bg: "hsl(var(--pastel-pink))",   ink: "hsl(var(--pastel-pink-ink))" },
};

export function ActivityCard() {
  const { db, ds } = useStore();
  const items = db.txns
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between">
        <h3 className="bento-title">Activity</h3>
        <button className="text-[12px] font-medium text-muted-foreground hover:text-foreground">
          See all →
        </button>
      </div>

      <ul className="mt-3 space-y-2">
        {items.length === 0 && (
          <li className="rounded-[14px] bg-[hsl(var(--canvas))] px-3 py-6 text-center text-[12px] text-muted-foreground">
            No recent activity
          </li>
        )}
        {items.map((t, i) => {
          const tint = ACTION_TINTS[t.type] || ACTION_TINTS.buy;
          const sign = t.type === "deposit" || t.type === "dividend" || t.type === "interest" || t.type === "sell" ? "+" : "−";
          return (
            <li
              key={`${t.date}-${i}`}
              className="flex items-center gap-3 rounded-[14px] px-3 py-2.5"
              style={{ background: tint.bg }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/70 text-[13px] font-bold"
                style={{ color: tint.ink }}
              >
                {sign}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold" style={{ color: tint.ink }}>
                  {t.note || TXN_LABELS[t.type]}
                </div>
                <div className="text-[10px]" style={{ color: tint.ink, opacity: 0.7 }}>
                  {new Date(t.date).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div className="tabular text-right text-[13px] font-bold" style={{ color: tint.ink }}>
                {sign}{ds(toVND(t.amount, t.ccy, db.fx))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
