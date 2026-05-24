"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { toVND } from "@/lib/finance";
import type { Txn } from "@/lib/types";
import { Bar } from "react-chartjs-2";

/**
 * Decomposes each between-snapshot period into:
 *  - capital deployed by the user (deposit/buy − withdrawal/sell)
 *  - market gains (totalΔ − capital)
 *
 * Stacked bars let you see at a glance whether the portfolio grew because
 * you added money or because the assets earned.
 */
export function ContributionsCard() {
  const { db, ds } = useStore();
  const fx = db.fx;

  const series = React.useMemo(() => {
    const snaps = db.snapshots;
    if (snaps.length < 2) return { labels: [], capital: [], gains: [] };

    const recent = snaps.slice(-8);
    const labels = recent
      .slice(1)
      .map((s) => new Date(s.date).toLocaleString("en", { month: "short" }));

    const isInflow = (t: Txn) => t.type === "deposit" || t.type === "buy";
    const isOutflow = (t: Txn) => t.type === "withdrawal" || t.type === "sell";

    const capital: number[] = [];
    const gains: number[] = [];

    for (let i = 1; i < recent.length; i++) {
      const start = new Date(recent[i - 1].date);
      const end = new Date(recent[i].date);

      let net = 0;
      db.txns.forEach((t) => {
        const d = new Date(t.date);
        if (d <= start || d > end) return;
        const v = toVND(t.amount, t.ccy, fx);
        if (isInflow(t)) net += v;
        else if (isOutflow(t)) net -= v;
      });

      const totalChange = recent[i].value - recent[i - 1].value;
      const market = totalChange - net;

      capital.push(net);
      gains.push(market);
    }

    return { labels, capital, gains };
  }, [db, fx]);

  const empty = series.labels.length === 0;

  return (
    <div className="bento-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="bento-title">Capital vs Market</h3>
          <p className="bento-sub">What grew your net worth each period</p>
        </div>
      </div>

      <div className="mt-3 h-[200px]">
        {empty ? (
          <div className="grid h-full place-items-center text-[12px] text-muted-foreground">
            Need at least 2 snapshots
          </div>
        ) : (
          <Bar
            data={{
              labels: series.labels,
              datasets: [
                {
                  label: "Capital",
                  data: series.capital,
                  backgroundColor: "hsl(210 60% 78%)",
                  borderRadius: 6,
                  maxBarThickness: 22,
                  stack: "s",
                },
                {
                  label: "Market gains",
                  data: series.gains,
                  backgroundColor: (ctx) => {
                    const v = ctx.parsed?.y ?? (ctx.raw as number) ?? 0;
                    return v >= 0 ? "hsl(150 50% 65%)" : "hsl(345 65% 76%)";
                  },
                  borderRadius: 6,
                  maxBarThickness: 22,
                  stack: "s",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (c) => {
                      const v = c.parsed.y ?? 0;
                      return `${c.dataset.label}: ${v >= 0 ? "+" : ""}${ds(v)}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  stacked: true,
                  grid: { display: false },
                  ticks: { color: "#9A9AA0", font: { size: 10 } },
                },
                y: {
                  stacked: true,
                  grid: { color: "#EDEDF0" },
                  ticks: {
                    callback: (v) => ds(Number(v)),
                    color: "#9A9AA0",
                    font: { size: 10 },
                    maxTicksLimit: 5,
                  },
                },
              },
            }}
          />
        )}
      </div>

      <div className="mt-3 flex gap-4 text-[11px]">
        <Legend dot="hsl(210 60% 78%)" label="Capital deployed" />
        <Legend dot="hsl(150 50% 65%)" label="Market gains" />
        <Legend dot="hsl(345 65% 76%)" label="Market losses" />
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
