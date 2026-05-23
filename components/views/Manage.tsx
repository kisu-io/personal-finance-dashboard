"use client";
import { useStore } from "@/lib/store";
import { toVND } from "@/lib/finance";
import { DEBT_LABELS } from "@/lib/classes";
import { fmtN } from "@/lib/format";
import { Card } from "@/components/ui/card";
import type { SheetKind } from "@/components/forms/Sheets";

export function Manage({ openSheet }: { openSheet: (k: SheetKind, id?: string) => void }) {
  const { db, ds, reset, exportJSON } = useStore();

  const Item = ({ em, label, extra, onClick }: { em: string; label: string; extra?: string; onClick: () => void }) => (
    <div onClick={onClick} className="mb-2.5 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-[15px] font-medium">
      <span className="grayscale-ico text-[19px]">{em}</span>
      {label}
      {extra && <span className="tabular ml-auto text-faint">{extra}</span>}
    </div>
  );

  return (
    <div className="animate-fade-up px-3.5 pt-4">
      <div className="mx-1.5 mb-2 mt-0.5 text-[13px] font-semibold text-muted-foreground">Add</div>
      <Item em="➕" label="New investment / asset" onClick={() => openSheet("asset")} />
      <Item em="🔁" label="Record a transaction" onClick={() => openSheet("txn")} />
      <Item em="🏦" label="Add a liability" onClick={() => openSheet("debt")} />

      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Liabilities</div>
      <Card className="p-4">
        {db.debts.length ? db.debts.map((dbt) => (
          <div key={dbt.id} onClick={() => openSheet("debt", dbt.id)} className="flex cursor-pointer items-center gap-3 border-b border-[hsl(var(--sep))] py-3 last:border-0">
            <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] bg-neg-tint text-[17px]">🏦</div>
            <div className="flex-1"><div className="text-[15px] font-semibold">{dbt.name}</div><div className="text-xs text-faint">{DEBT_LABELS[dbt.type] || dbt.type} · {dbt.rate}%/năm</div></div>
            <div className="tabular text-[15px] font-bold text-neg">−{ds(toVND(dbt.balance, dbt.ccy, db.fx))}</div>
          </div>
        )) : <div className="py-8 text-center text-sm text-faint">No liabilities</div>}
      </Card>

      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Settings</div>
      <Item em="💱" label="FX rate" extra={`1$ = ${fmtN(db.fx)}₫`} onClick={() => openSheet("fx")} />
      <Item em="⬇️" label="Export data (JSON)" onClick={exportJSON} />
      <Item em="♻️" label="Reset to sample data" onClick={() => { if (confirm("Reset to sample data? Local changes will be lost.")) reset(); }} />
      <div className="mt-2 px-0.5 text-xs leading-relaxed text-faint">
        Phase 1 prototype · data stored locally on this device. Phase 2 swaps this for cloud sync (Supabase) with one login.
      </div>
    </div>
  );
}
