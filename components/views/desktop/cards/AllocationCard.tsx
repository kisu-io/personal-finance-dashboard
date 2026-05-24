"use client";
import { useStore } from "@/lib/store";
import { allocByClass, grossAssets } from "@/lib/finance";
import { CLASSES } from "@/lib/classes";
import { pastelAt } from "@/lib/pastel";
import { Doughnut } from "react-chartjs-2";

export function AllocationCard() {
  const { db, ds } = useStore();
  const slices = allocByClass(db);
  const total = grossAssets(db);
  const top = slices[0];

  const palette = slices.map((_, i) => pastelAt(i));

  return (
    <div className="bento-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="bento-title">Allocation</h3>
          <p className="bento-sub">{slices.length} asset classes</p>
        </div>
        {top && (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: palette[0].bg, color: palette[0].ink }}
          >
            largest · {top.pctv.toFixed(0)}%
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-[160px] w-[160px] shrink-0">
          <Doughnut
            data={{
              labels: slices.map((s) => CLASSES[s.cls].label),
              datasets: [
                {
                  data: slices.map((s) => s.v),
                  backgroundColor: palette.map((p) => p.bg),
                  borderColor: "#FFFFFF",
                  borderWidth: 3,
                  hoverOffset: 6,
                },
              ],
            }}
            options={{
              cutout: "68%",
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (c) =>
                      ` ${c.label}: ${ds(c.parsed)} · ${((c.parsed / total) * 100).toFixed(1)}%`,
                  },
                },
              },
            }}
          />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Total
              </div>
              <div className="tabular text-[15px] font-bold leading-tight">{ds(total)}</div>
            </div>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-1.5">
          {slices.map((s, i) => {
            const c = palette[i];
            return (
              <li
                key={s.cls}
                className="flex items-center gap-2 text-[12px]"
                title={CLASSES[s.cls].label}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ background: c.bg }}
                />
                <span className="min-w-0 flex-1 truncate text-foreground">
                  {CLASSES[s.cls].label}
                </span>
                <span className="tabular font-semibold text-foreground">
                  {s.pctv.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
