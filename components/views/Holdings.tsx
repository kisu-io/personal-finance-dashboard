"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { grossAssets, assetVND, costVND, allocByClass } from "@/lib/finance";
import { CLASSES, TERMS } from "@/lib/classes";
import { ClassIcon } from "@/lib/class-icons";
import { pct, arrow, fmtN } from "@/lib/format";
import type { Asset, Term } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Holdings({ onEdit }: { onEdit: (id: string) => void }) {
  const { db, ds } = useStore();
  const [mode, setMode] = React.useState<"term" | "class">("term");
  const g = grossAssets(db) || 1;

  const Row = (x: Asset) => {
    const v = assetVND(x, db.fx), c = costVND(x, db.fx), gain = v - c, gp = c > 0 ? (gain / c) * 100 : 0;
    return (
      <div key={x.id} onClick={() => onEdit(x.id)} className="flex cursor-pointer items-center gap-3 border-b border-[hsl(var(--sep))] py-3 last:border-0">
        <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] bg-background text-muted-foreground">
          <ClassIcon cls={x.cls} size={18} stroke={1.9} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold">{x.name}</div>
          <div className="mt-px text-xs text-faint">
            {CLASSES[x.cls].label} · {x.ccy}{x.qty !== 1 ? ` · ${fmtN(x.qty, x.qty % 1 ? 2 : 0)} @ ${fmtN(x.price)}` : ""} · {((v / g) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="whitespace-nowrap text-right">
          <div className="tabular text-[15px] font-bold">{ds(v)}</div>
          <div className={`tabular mt-px flex items-center justify-end gap-0.5 text-xs font-semibold ${gain >= 0 ? "text-pos" : "text-neg"}`}>
            <span className="text-[9px]">{arrow(gain)}</span>{pct(gp)}
          </div>
        </div>
      </div>
    );
  };

  const Group = ({ title, badge, sum, items }: { title: React.ReactNode; badge?: boolean; sum: number; items: Asset[] }) => (
    <>
      <div className="mx-1.5 mb-1.5 mt-[18px] flex items-center justify-between">
        <div className="flex items-center gap-2">{badge ? <Badge variant="tag">{title}</Badge> : <span className="text-[15px] font-bold">{title}</span>}</div>
        <div className="tabular text-[12.5px] font-medium text-faint">{ds(sum)} · {((sum / g) * 100).toFixed(0)}%</div>
      </div>
      <Card className="px-4 py-1">{items.map(Row)}</Card>
    </>
  );

  return (
    <div className="animate-fade-up px-3.5 pt-4">
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(v) => { if (v) setMode(v as "term" | "class"); }}
        className="mb-3 h-auto w-full gap-0 rounded-[9px] bg-[#E9E9EB] p-0.5"
      >
        {(["term", "class"] as const).map((m) => (
          <ToggleGroupItem
            key={m}
            value={m}
            className="h-auto min-w-0 flex-1 rounded-[7px] px-3 py-1.5 text-[13px] font-semibold text-muted-foreground hover:bg-transparent hover:text-muted-foreground data-[state=on]:bg-card data-[state=on]:shadow-sm data-[state=on]:text-foreground"
          >
            {m === "term" ? "By horizon" : "By asset class"}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {mode === "term"
        ? (["short", "mid", "long"] as Term[]).map((t) => {
            const arr = db.assets.filter((x) => x.term === t);
            if (!arr.length) return null;
            const sum = arr.reduce((s, x) => s + assetVND(x, db.fx), 0);
            return <Group key={t} title={TERMS[t]} badge sum={sum} items={arr} />;
          })
        : allocByClass(db).map(({ cls }) => {
            const arr = db.assets.filter((x) => x.cls === cls);
            const sum = arr.reduce((s, x) => s + assetVND(x, db.fx), 0);
            const title = (
              <span className="flex items-center gap-1.5">
                <ClassIcon cls={cls} size={15} stroke={1.9} />
                {CLASSES[cls].label}
              </span>
            );
            return <Group key={cls} title={title} sum={sum} items={arr} />;
          })}
    </div>
  );
}
