"use client";
import { useStore } from "@/lib/store";
import { snapReturn, twr, xirr, buildFlows, grossAssets, costBasis } from "@/lib/finance";
import { pct, arrow } from "@/lib/format";
import { Card } from "@/components/ui/card";

const BENCHES: [string, number][] = [
  ["VN-Index", 11.5], ["BTC (USD)", 42.0], ["USD savings 4.5%", 4.5], ["Gold SJC", 18.0],
];

function Metric({ k, v, x, tone }: { k: string; v: string; x?: string; tone?: "pos" | "neg" }) {
  return (
    <Card className="p-3.5">
      <div className="text-xs font-medium text-muted-foreground">{k}</div>
      <div className={`tabular mt-1.5 text-[22px] font-extrabold tracking-[-0.02em] ${tone === "pos" ? "text-pos" : tone === "neg" ? "text-neg" : ""}`}>{v}</div>
      {x && <div className="mt-0.5 text-[11.5px] font-medium text-faint">{x}</div>}
    </Card>
  );
}

export function Performance() {
  const { db, d } = useStore();
  const ytd = snapReturn(db, "ytd"), y1 = snapReturn(db, 12), tw = twr(db), xr = xirr(buildFlows(db));
  const mkt = grossAssets(db), cost = costBasis(db), un = mkt - cost;
  const me = xr ?? 0;
  const tone = (n: number | null) => (n == null ? undefined : n >= 0 ? "pos" : "neg");
  const f = (n: number | null) => (n != null ? `${arrow(n)} ${pct(n)}` : "—");

  return (
    <div className="animate-fade-up px-3.5 pt-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Metric k="YTD return" v={f(ytd)} x="annualized n/a" tone={tone(ytd)} />
        <Metric k="1Y return" v={f(y1)} tone={tone(y1)} />
        <Metric k="XIRR (money-weighted)" v={f(xr)} x="since inception" tone={tone(xr)} />
        <Metric k="TWR (time-weighted)" v={f(tw)} x="since inception" tone={tone(tw)} />
      </div>

      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Gains</div>
      <Card className="p-4">
        <Line k="Cost basis" v={d(cost)} />
        <Line k="Market value" v={d(mkt)} top />
        <Line k="Unrealized gain" v={`${d(un)} (${pct((un / cost) * 100)})`} top tone={un >= 0 ? "pos" : "neg"} />
        <Line k="Realized gain (ITD)" v={d(db.realized || 0)} top tone="pos" />
      </Card>

      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Vs benchmark · ITD</div>
      <Card className="p-4">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="text-[11.5px] font-semibold text-muted-foreground">
              <th className="border-b border-border py-1.5 text-left">Benchmark</th>
              <th className="border-b border-border py-1.5 text-right">Return</th>
              <th className="border-b border-border py-1.5 text-right">vs you</th>
            </tr>
          </thead>
          <tbody>
            {BENCHES.map(([n, r]) => {
              const diff = me - r;
              return (
                <tr key={n}>
                  <td className="border-b border-[hsl(var(--sep))] py-2.5 text-left font-medium">{n}</td>
                  <td className="tabular border-b border-[hsl(var(--sep))] py-2.5 text-right font-semibold">{pct(r)}</td>
                  <td className={`tabular border-b border-[hsl(var(--sep))] py-2.5 text-right font-semibold ${diff >= 0 ? "text-pos" : "text-neg"}`}>{arrow(diff)} {pct(diff)}</td>
                </tr>
              );
            })}
            <tr>
              <td className="py-2.5 text-left font-bold">You (XIRR)</td>
              <td className="tabular py-2.5 text-right font-bold">{me ? pct(me) : "—"}</td>
              <td className="py-2.5 text-right">—</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Line({ k, v, top, tone }: { k: string; v: string; top?: boolean; tone?: "pos" | "neg" }) {
  return (
    <div className={`flex items-center justify-between py-2 ${top ? "border-t border-border" : ""}`}>
      <span className="text-muted-foreground">{k}</span>
      <b className={`tabular ${tone === "pos" ? "text-pos" : tone === "neg" ? "text-neg" : ""}`}>{v}</b>
    </div>
  );
}
