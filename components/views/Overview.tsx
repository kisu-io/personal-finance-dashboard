"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { grossAssets, allocByClass, allocByTerm, driftItems } from "@/lib/finance";
import { CLASSES, TERMS } from "@/lib/classes";
import { pct, arrow } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NetWorthChart, AllocDonut } from "@/components/charts/Charts";

const RANGES = [{ l: "6M", r: 6 }, { l: "1Y", r: 12 }, { l: "All", r: 0 }];

export function Overview() {
  const { db, ds } = useStore();
  const [range, setRange] = React.useState(6);

  let s = db.snapshots.slice();
  if (range > 0) s = s.slice(-range - 1);
  const labels = s.map((p) => new Date(p.date).toLocaleDateString("en", { month: "short", year: "2-digit" }));
  const data = s.map((p) => p.value);

  const g = grossAssets(db);
  const ac = allocByClass(db);
  const drift = driftItems(db);
  const alerts = drift.filter((x) => x.over);
  const at = allocByTerm(db);

  return (
    <div className="animate-fade-up px-3.5 pt-4">
      {/* Net worth over time */}
      <Card className="mb-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold text-muted-foreground">Net worth over time</div>
          <ToggleGroup
            type="single"
            value={String(range)}
            onValueChange={(v) => { if (v !== "") setRange(Number(v)); }}
            className="h-auto gap-0 rounded-[9px] bg-[#E9E9EB] p-0.5"
          >
            {RANGES.map((x) => (
              <ToggleGroupItem
                key={x.l}
                value={String(x.r)}
                className="h-auto min-w-0 rounded-[7px] px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-transparent hover:text-muted-foreground data-[state=on]:bg-card data-[state=on]:shadow-sm data-[state=on]:text-foreground"
              >{x.l}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="mt-2 h-[170px]"><NetWorthChart labels={labels} data={data} fmt={ds} /></div>
      </Card>

      {/* Allocation */}
      <Card className="mb-3 p-4">
        <div className="text-[13px] font-semibold text-muted-foreground">Allocation · current vs target</div>
        <div className="mt-2 flex items-center gap-3.5">
          <div className="h-32 w-32 shrink-0">
            <AllocDonut
              labels={ac.map((x) => CLASSES[x.cls].label)}
              values={ac.map((x) => x.v)}
              colors={ac.map((x) => CLASSES[x.cls].color)}
              pctOf={(v) => `${((v / g) * 100).toFixed(1)}%`}
            />
          </div>
          <div className="flex flex-1 flex-wrap gap-x-3 gap-y-2">
            {ac.map((x) => (
              <span key={x.cls} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <i className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CLASSES[x.cls].color }} />
                {CLASSES[x.cls].label} · {x.pctv.toFixed(0)}%
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Drift */}
      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Target drift</div>
      <Card className="mb-3 p-4">
        {alerts.length > 0 && (
          <Badge variant="neg" className="mb-2.5">⚠︎ {alerts.length} class(es) drifted beyond band — consider rebalancing</Badge>
        )}
        {drift.map((x) => {
          const span = Math.max(x.target, x.pctv);
          return (
            <div key={x.cls} className="border-b border-[hsl(var(--sep))] py-2.5 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{CLASSES[x.cls].ico} {CLASSES[x.cls].label}</span>
                <span className={`flex items-center gap-1 text-xs font-bold ${x.over ? "text-neg" : "text-muted-foreground"}`}>
                  {arrow(x.dr)} {pct(x.dr)}{x.over ? " ⚠︎" : ""}
                </span>
              </div>
              <div className="relative mt-2 h-[7px] overflow-hidden rounded-md bg-background">
                <i className="absolute inset-y-0 left-0 rounded-md" style={{ width: `${Math.min(100, (x.pctv / span) * 100)}%`, background: x.over ? "hsl(var(--neg))" : "#000" }} />
                <span className="absolute -top-[3px] -bottom-[3px] z-10 w-[2px] rounded-sm bg-black" style={{ left: `${Math.min(99, (x.target / span) * 100)}%` }} />
              </div>
              <div className="mt-1.5 text-[11px] text-faint">current {x.pctv.toFixed(1)}% · target {x.target}% · band ±{x.thr}%</div>
            </div>
          );
        })}
      </Card>

      {/* By horizon */}
      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">By time horizon</div>
      <Card className="mb-3 p-4">
        {at.map(({ t, v, pctv }) => (
          <div key={t} className="border-b border-[hsl(var(--sep))] py-2.5 last:border-0">
            <div className="flex items-center justify-between">
              <Badge variant="tag">{TERMS[t]}</Badge>
              <span><b className="tabular">{ds(v)}</b> <span className="text-xs text-faint">· {pctv.toFixed(0)}%</span></span>
            </div>
            <div className="relative mt-2 h-[7px] overflow-hidden rounded-md bg-background">
              <i className="absolute inset-y-0 left-0 rounded-md bg-black" style={{ width: `${pctv}%` }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
