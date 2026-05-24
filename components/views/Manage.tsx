"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { toVND } from "@/lib/finance";
import { DEBT_LABELS } from "@/lib/classes";
import { fmtN } from "@/lib/format";
import { Card } from "@/components/ui/card";
import type { SheetKind } from "@/components/forms/Sheets";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconPlus,
  IconArrowsExchange,
  IconBuildingBank,
  IconCoin,
  IconCurrencyDollar,
  IconCameraPlus,
  IconDownload,
  IconUpload,
  IconRefresh,
} from "@tabler/icons-react";
import type { TablerIcon } from "@/lib/class-icons";

export function Manage({ openSheet }: { openSheet: (k: SheetKind, id?: string) => void }) {
  const { db, ds, reset, exportJSON, importJSON } = useStore();
  const [resetOpen, setResetOpen] = React.useState(false);

  const Item = ({ icon: Icon, label, extra, onClick }: { icon: TablerIcon; label: string; extra?: string; onClick: () => void }) => (
    <div onClick={onClick} className="mb-2.5 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-[15px] font-medium">
      <span className="text-muted-foreground"><Icon size={19} stroke={1.8} /></span>
      {label}
      {extra && <span className="tabular ml-auto text-faint">{extra}</span>}
    </div>
  );

  return (
    <div className="animate-fade-up px-3.5 pt-4">
      <div className="mx-1.5 mb-2 mt-0.5 text-[13px] font-semibold text-muted-foreground">Add</div>
      <Item icon={IconPlus}            label="New investment / asset" onClick={() => openSheet("asset")} />
      <Item icon={IconArrowsExchange}  label="Record a transaction"  onClick={() => openSheet("txn")} />
      <Item icon={IconBuildingBank}    label="Add a liability"        onClick={() => openSheet("debt")} />
      <Item icon={IconCoin}            label="Add income entry"       onClick={() => openSheet("income")} />

      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Liabilities</div>
      <Card className="p-4">
        {db.debts.length ? db.debts.map((dbt) => (
          <div key={dbt.id} onClick={() => openSheet("debt", dbt.id)} className="flex cursor-pointer items-center gap-3 border-b border-[hsl(var(--sep))] py-3 last:border-0">
            <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] bg-neg-tint text-neg">
              <IconBuildingBank size={18} stroke={1.9} />
            </div>
            <div className="flex-1"><div className="text-[15px] font-semibold">{dbt.name}</div><div className="text-xs text-faint">{DEBT_LABELS[dbt.type] || dbt.type} · {dbt.rate}%/năm</div></div>
            <div className="tabular text-[15px] font-bold text-neg">−{ds(toVND(dbt.balance, dbt.ccy, db.fx))}</div>
          </div>
        )) : <div className="py-8 text-center text-sm text-faint">No liabilities</div>}
      </Card>

      <div className="mx-1.5 mb-2 mt-5 text-[13px] font-semibold text-muted-foreground">Settings</div>
      <Item icon={IconCurrencyDollar} label="FX rate" extra={`1$ = ${fmtN(db.fx)}₫`} onClick={() => openSheet("fx")} />
      <Item icon={IconCameraPlus}     label="Save net-worth snapshot" onClick={() => openSheet("snapshot")} />
      <Item icon={IconDownload}       label="Export data (JSON)"     onClick={exportJSON} />
      <Item icon={IconUpload}         label="Import data (JSON)"     onClick={importJSON} />
      <Item icon={IconRefresh}        label="Reset to sample data"   onClick={() => setResetOpen(true)} />
      <div className="mt-2 px-0.5 text-xs leading-relaxed text-faint">
        Phase 1 prototype · data stored locally on this device. Phase 2 swaps this for cloud sync (Supabase) with one login.
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to sample data?</AlertDialogTitle>
            <AlertDialogDescription>All local changes will be lost and replaced with the seed portfolio.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={reset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
