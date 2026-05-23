"use client";
import { useStore } from "@/lib/store";
import { grossAssets, totalDebt, netWorth, xirr, buildFlows } from "@/lib/finance";
import { pct, arrow, fmtN } from "@/lib/format";

export function Header({ onAdd, onFx }: { onAdd: () => void; onFx: () => void }) {
  const { db, ccy, setCcy, d, ds } = useStore();
  const nw = netWorth(db);
  const s = db.snapshots;
  const prev = s.length >= 2 ? s[s.length - 2].value : nw;
  const chg = nw - prev;
  const chgPct = prev ? (chg / prev) * 100 : 0;
  const itd = xirr(buildFlows(db));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background px-[18px] pb-4 pt-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-muted-foreground">Net worth</span>
        <button
          onClick={onAdd}
          aria-label="Add investment"
          className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[22px] font-light leading-none text-primary-foreground"
        >+</button>
      </div>

      <div className="tabular mt-1.5 text-[38px] font-extrabold leading-[1.04] tracking-[-0.03em]">{d(nw)}</div>

      <div className="mt-1.5 flex items-center gap-2 text-sm">
        <span className={`font-bold ${chg >= 0 ? "text-pos" : "text-neg"}`}>
          {arrow(chg)} {d(Math.abs(chg))} ({pct(chgPct)}) this month
        </span>
        <span className="text-faint">· {db.assets.length} holdings</span>
      </div>

      <div className="mt-3.5 inline-flex rounded-[9px] bg-[#E9E9EB] p-0.5 text-[13px] font-semibold">
        {(["VND", "USD"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCcy(c)}
            className={`rounded-[7px] px-3 py-1.5 ${ccy === c ? "bg-card shadow-sm" : "text-foreground/70"}`}
          >
            {c === "VND" ? "₫ VND" : "$ USD"}
          </button>
        ))}
      </div>

      <div className="mt-3.5 flex overflow-hidden rounded-lg border border-border bg-card">
        <Chip k="Gross assets" v={ds(grossAssets(db))} />
        <Chip k="Liabilities" v={ds(totalDebt(db))} border />
        <Chip k="ITD return" v={itd != null ? `${arrow(itd)} ${pct(itd)}` : "—"} border tone={itd != null ? (itd >= 0 ? "pos" : "neg") : undefined} />
      </div>

      <div onClick={onFx} className="tabular mt-2.5 cursor-pointer text-right text-xs text-faint">
        1 $ = {fmtN(db.fx)} ₫
      </div>
    </header>
  );
}

function Chip({ k, v, border, tone }: { k: string; v: string; border?: boolean; tone?: "pos" | "neg" }) {
  return (
    <div className={`flex-1 px-3 py-2.5 ${border ? "border-l border-border" : ""}`}>
      <div className="text-[11px] font-medium text-muted-foreground">{k}</div>
      <div className={`tabular mt-0.5 text-base font-bold ${tone === "pos" ? "text-pos" : tone === "neg" ? "text-neg" : ""}`}>{v}</div>
    </div>
  );
}
