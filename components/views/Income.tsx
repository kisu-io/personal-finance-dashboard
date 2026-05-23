"use client";
import { useStore } from "@/lib/store";
import { toVND } from "@/lib/finance";
import { Card } from "@/components/ui/card";
import { IncomeBar } from "@/components/charts/Charts";

export function Income() {
  const { db, ds } = useStore();

  const byMonth: Record<string, number> = {};
  db.income.forEach((i) => {
    const k = i.date.slice(0, 7);
    byMonth[k] = (byMonth[k] || 0) + toVND(i.amount, i.ccy, db.fx);
  });
  const keys = Object.keys(byMonth).sort();
  const labels = keys.map((k) => {
    const [y, m] = k.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleDateString("en", { month: "short" });
  });
  const data = keys.map((k) => byMonth[k]);

  const yr = new Date().getFullYear();
  const ytd = db.income.filter((i) => new Date(i.date).getFullYear() === yr).reduce((s, i) => s + toVND(i.amount, i.ccy, db.fx), 0);
  const total = db.income.reduce((s, i) => s + toVND(i.amount, i.ccy, db.fx), 0);
  const log = [...db.income].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="animate-fade-up px-3.5 pt-4">
      <Card className="mb-3 p-4">
        <div className="text-[13px] font-semibold text-muted-foreground">Dividend &amp; interest income</div>
        <div className="mt-2 h-[160px]"><IncomeBar labels={labels} data={data} fmt={ds} /></div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        <Card className="p-3.5"><div className="text-xs font-medium text-muted-foreground">This year</div><div className="tabular mt-1.5 text-[22px] font-extrabold">{ds(ytd)}</div></Card>
        <Card className="p-3.5"><div className="text-xs font-medium text-muted-foreground">Avg / month</div><div className="tabular mt-1.5 text-[22px] font-extrabold">{ds(total / Math.max(1, keys.length))}</div></Card>
      </div>

      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Log</div>
      <Card className="p-4">
        {log.length ? log.map((i, idx) => (
          <div key={idx} className="flex items-center gap-3 border-b border-[hsl(var(--sep))] py-3 last:border-0">
            <div className="grayscale-ico grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] bg-background text-[17px]">💰</div>
            <div className="flex-1"><div className="text-[15px] font-semibold">{i.name}</div><div className="text-xs text-faint">{i.date}</div></div>
            <div className="tabular text-[15px] font-bold text-pos">+{ds(toVND(i.amount, i.ccy, db.fx))}</div>
          </div>
        )) : <div className="py-8 text-center text-sm text-faint">No income recorded yet</div>}
      </Card>
    </div>
  );
}
