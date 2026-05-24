"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { toVND } from "@/lib/finance";
import { Line } from "react-chartjs-2";

type RangeKey = "1M" | "6M" | "1Y";

const RANGES: { key: RangeKey; months: number }[] = [
  { key: "1M", months: 1 },
  { key: "6M", months: 6 },
  { key: "1Y", months: 12 },
];

export function CashFlowCard() {
  const { db, ds } = useStore();
  const [range, setRange] = React.useState<RangeKey>("6M");
  const months = RANGES.find((r) => r.key === range)!.months;

  const buckets = React.useMemo(() => {
    const now = new Date();
    const keys: string[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const inflow = new Map(keys.map((k) => [k, 0]));
    const outflow = new Map(keys.map((k) => [k, 0]));

    db.txns.forEach((t) => {
      const k = t.date.slice(0, 7);
      if (!inflow.has(k)) return;
      const amt = toVND(t.amount, t.ccy, db.fx);
      if (t.type === "deposit" || t.type === "dividend" || t.type === "interest" || t.type === "sell") {
        inflow.set(k, (inflow.get(k) || 0) + amt);
      } else {
        outflow.set(k, (outflow.get(k) || 0) + amt);
      }
    });

    db.income.forEach((i) => {
      const k = i.date.slice(0, 7);
      if (!inflow.has(k)) return;
      inflow.set(k, (inflow.get(k) || 0) + toVND(i.amount, i.ccy, db.fx));
    });

    const labels = keys.map((k) => {
      const [, m] = k.split("-");
      return new Date(2000, Number(m) - 1, 1).toLocaleString("en", { month: "short" });
    });

    return {
      labels,
      inflow: keys.map((k) => inflow.get(k) || 0),
      outflow: keys.map((k) => outflow.get(k) || 0),
    };
  }, [db, months]);

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="bento-title">Cash Flow</h3>
          <p className="bento-sub">Inflow vs outflow by month</p>
        </div>
        <div className="flex gap-0.5 rounded-[10px] bg-[hsl(var(--canvas))] p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-[8px] px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                range === r.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {r.key}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 h-[200px]">
        <Line
          data={{
            labels: buckets.labels,
            datasets: [
              {
                label: "Inflow",
                data: buckets.inflow,
                borderColor: "hsl(150 60% 45%)",
                backgroundColor: "hsla(150,60%,45%,0.10)",
                cubicInterpolationMode: "monotone",
                pointRadius: 3,
                pointBackgroundColor: "hsl(150 60% 45%)",
                pointBorderWidth: 0,
                pointHoverRadius: 5,
                fill: true,
                borderWidth: 2,
              },
              {
                label: "Outflow",
                data: buckets.outflow,
                borderColor: "hsl(345 65% 55%)",
                backgroundColor: "hsla(345,65%,55%,0.08)",
                cubicInterpolationMode: "monotone",
                pointRadius: 3,
                pointBackgroundColor: "hsl(345 65% 55%)",
                pointBorderWidth: 0,
                pointHoverRadius: 5,
                fill: true,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${ds(c.parsed.y ?? 0)}` } },
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: "#9A9AA0", font: { size: 10 } } },
              y: {
                grid: { color: "#EDEDF0" },
                ticks: { callback: (v) => ds(Number(v)), color: "#9A9AA0", font: { size: 10 }, maxTicksLimit: 4 },
              },
            },
          }}
        />
      </div>

      <div className="mt-3 flex gap-4 text-[11px]">
        <Legend dot="hsl(150 60% 45%)" label="Inflow" />
        <Legend dot="hsl(345 65% 55%)" label="Outflow" />
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <i className="h-2 w-2 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}
