"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { CLASSES } from "@/lib/classes";
import { ClassIcon } from "@/lib/class-icons";
import { netWorth } from "@/lib/finance";
import type { Asset, Debt, Txn, IncomeEntry, AssetClass, Term, Currency, TxnType, DebtType } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type SheetKind = "asset" | "txn" | "debt" | "fx" | "snapshot" | "income" | null;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-3"><Label>{label}</Label>{children}</div>
);

const Sel = ({ value, onValueChange, children }: { value?: string; onValueChange: (v: string) => void; children: React.ReactNode }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
    <SelectContent>{children}</SelectContent>
  </Select>
);

export function FormSheets({ kind, id, onClose }: { kind: SheetKind; id?: string; onClose: () => void }) {
  const open = kind !== null;
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      {kind === "asset"    && <SheetContent title={id ? "Edit investment / asset" : "New investment / asset"}><AssetForm id={id} onClose={onClose} /></SheetContent>}
      {kind === "txn"      && <SheetContent title="Record a transaction"><TxnForm onClose={onClose} /></SheetContent>}
      {kind === "debt"     && <SheetContent title={id ? "Edit liability" : "Add liability"}><DebtForm id={id} onClose={onClose} /></SheetContent>}
      {kind === "fx"       && <SheetContent title="FX rate"><FxForm onClose={onClose} /></SheetContent>}
      {kind === "snapshot" && <SheetContent title="Save net-worth snapshot"><SnapshotForm onClose={onClose} /></SheetContent>}
      {kind === "income"   && <SheetContent title="Add income entry"><IncomeForm onClose={onClose} /></SheetContent>}
    </Sheet>
  );
}

function num(v: string) { return v === "" ? 0 : Number(v); }

function AssetForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const { db, upsertAsset, deleteAsset } = useStore();
  const ex = id ? db.assets.find((a) => a.id === id) : undefined;
  const [f, setF] = React.useState<Partial<Asset>>(
    ex ?? { name: "", cls: "vn_stock", term: "long", ccy: "VND", qty: 1, cost: 0, price: 0, target: 0, drift: 5, note: "" }
  );
  const set = (k: keyof Asset, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const save = () => { upsertAsset({ ...f, id }); onClose(); };

  return (
    <>
      <Field label="Name"><Input value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="e.g. FPT, BTC, Vàng SJC" /></Field>
      <Field label="Asset class">
        <Sel value={f.cls} onValueChange={(v) => set("cls", v as AssetClass)}>
          {(Object.keys(CLASSES) as AssetClass[]).map((k) => (
            <SelectItem key={k} value={k}>
              <span className="inline-flex items-center gap-2">
                <ClassIcon cls={k} size={15} stroke={1.9} />
                {CLASSES[k].label}
              </span>
            </SelectItem>
          ))}
        </Sel>
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Time horizon">
          <Sel value={f.term} onValueChange={(v) => set("term", v as Term)}>
            <SelectItem value="short">Ngắn hạn</SelectItem>
            <SelectItem value="mid">Trung hạn</SelectItem>
            <SelectItem value="long">Dài hạn</SelectItem>
          </Sel>
        </Field>
        <Field label="Currency">
          <Sel value={f.ccy} onValueChange={(v) => set("ccy", v as Currency)}>
            <SelectItem value="VND">VND</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </Sel>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Quantity / units"><Input type="number" value={String(f.qty ?? "")} onChange={(e) => set("qty", num(e.target.value))} /></Field>
        <Field label="Cost / unit"><Input type="number" value={String(f.cost ?? "")} onChange={(e) => set("cost", num(e.target.value))} /></Field>
      </div>
      <Field label="Current price / unit"><Input type="number" value={String(f.price ?? "")} onChange={(e) => set("price", num(e.target.value))} /></Field>
      <p className="-mt-1.5 mb-3 px-0.5 text-xs leading-snug text-faint">For deposits/cash, set quantity = 1 and put the full balance in both cost &amp; price.</p>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Target allocation %"><Input type="number" value={String(f.target ?? "")} onChange={(e) => set("target", num(e.target.value))} /></Field>
        <Field label="Drift band ±%"><Input type="number" value={String(f.drift ?? "")} onChange={(e) => set("drift", num(e.target.value))} /></Field>
      </div>
      <p className="-mt-1.5 mb-3 px-0.5 text-xs leading-snug text-faint">Target &amp; drift band are asked per investment, so each asset can have its own rebalancing rule.</p>
      <Field label="Note"><Input value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} /></Field>
      <Button className="w-full" onClick={save}>{id ? "Save changes" : "Add asset"}</Button>
      {id && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-2 w-full">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this asset?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove the holding from your portfolio.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { deleteAsset(id); onClose(); }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Cancel</Button>
    </>
  );
}

function TxnForm({ onClose }: { onClose: () => void }) {
  const { addTxn } = useStore();
  const [f, setF] = React.useState<Txn>({ type: "deposit", date: fmtDate(new Date()), ccy: "VND", amount: 0, note: "" });
  const set = (k: keyof Txn, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const save = () => { if (!f.amount) { alert("Enter an amount"); return; } addTxn(f); onClose(); };

  return (
    <>
      <Field label="Type">
        <Sel value={f.type} onValueChange={(v) => set("type", v as TxnType)}>
          <SelectItem value="deposit">Deposit (vốn vào)</SelectItem>
          <SelectItem value="withdrawal">Withdrawal (rút ra)</SelectItem>
          <SelectItem value="buy">Buy</SelectItem>
          <SelectItem value="sell">Sell</SelectItem>
          <SelectItem value="dividend">Dividend</SelectItem>
          <SelectItem value="interest">Interest</SelectItem>
        </Sel>
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Date"><Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Currency">
          <Sel value={f.ccy} onValueChange={(v) => set("ccy", v as Currency)}>
            <SelectItem value="VND">VND</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </Sel>
        </Field>
      </div>
      <Field label="Amount"><Input type="number" value={String(f.amount || "")} onChange={(e) => set("amount", num(e.target.value))} /></Field>
      {f.type === "sell" && (
        <>
          <Field label="Realized gain (optional)">
            <Input type="number" value={f.gainAmt != null ? String(f.gainAmt) : ""} onChange={(e) => set("gainAmt", e.target.value === "" ? undefined : num(e.target.value))} placeholder="Leave blank if unknown" />
          </Field>
          <p className="-mt-1.5 mb-3 px-0.5 text-xs leading-snug text-faint">Proceeds minus cost basis for this sell. Recorded in Performance → Realized gain.</p>
        </>
      )}
      <Field label="Note"><Input value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} /></Field>
      <p className="-mt-1.5 mb-3 px-0.5 text-xs leading-snug text-faint">Deposits/withdrawals feed XIRR &amp; TWR. Dividend/interest also appear in Income.</p>
      <Button className="w-full" onClick={save}>Save transaction</Button>
      <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Cancel</Button>
    </>
  );
}

function DebtForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const { db, upsertDebt, deleteDebt } = useStore();
  const ex = id ? db.debts.find((x) => x.id === id) : undefined;
  const [f, setF] = React.useState<Partial<Debt>>(ex ?? { name: "", type: "mortgage", ccy: "VND", balance: 0, rate: 0, note: "" });
  const set = (k: keyof Debt, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const save = () => { upsertDebt({ ...f, id }); onClose(); };

  return (
    <>
      <Field label="Name"><Input value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Type">
        <Sel value={f.type} onValueChange={(v) => set("type", v as DebtType)}>
          <SelectItem value="mortgage">Mortgage</SelectItem>
          <SelectItem value="margin">Margin</SelectItem>
          <SelectItem value="personal">Personal loan</SelectItem>
        </Sel>
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Outstanding balance"><Input type="number" value={String(f.balance ?? "")} onChange={(e) => set("balance", num(e.target.value))} /></Field>
        <Field label="Currency">
          <Sel value={f.ccy} onValueChange={(v) => set("ccy", v as Currency)}>
            <SelectItem value="VND">VND</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </Sel>
        </Field>
      </div>
      <Field label="Interest rate %/yr"><Input type="number" value={String(f.rate ?? "")} onChange={(e) => set("rate", num(e.target.value))} /></Field>
      <Field label="Note"><Input value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} /></Field>
      <Button className="w-full" onClick={save}>{id ? "Save changes" : "Add liability"}</Button>
      {id && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-2 w-full">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this liability?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove the debt entry.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { deleteDebt(id); onClose(); }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Cancel</Button>
    </>
  );
}

function FxForm({ onClose }: { onClose: () => void }) {
  const { db, setFx } = useStore();
  const [v, setV] = React.useState(String(db.fx));
  return (
    <>
      <Field label="VND per 1 USD"><Input type="number" value={v} onChange={(e) => setV(e.target.value)} /></Field>
      <p className="-mt-1.5 mb-3 px-0.5 text-xs leading-snug text-faint">Used to convert USD-denominated assets and to switch the dual-currency view.</p>
      <Button className="w-full" onClick={() => { setFx(Number(v) || db.fx); onClose(); }}>Save</Button>
      <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Cancel</Button>
    </>
  );
}

function SnapshotForm({ onClose }: { onClose: () => void }) {
  const { db, addSnapshot } = useStore();
  const [date, setDate] = React.useState(fmtDate(new Date()));
  const [value, setValue] = React.useState(String(Math.round(netWorth(db))));
  const save = () => {
    const v = Number(value);
    if (!v) { alert("Enter a value"); return; }
    addSnapshot({ date, value: v });
    onClose();
  };
  return (
    <>
      <Field label="Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      <Field label="Net worth (VND)"><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
      <p className="-mt-1.5 mb-3 px-0.5 text-xs leading-snug text-faint">Pre-filled with today's calculated net worth. Snapshots power TWR and the net-worth chart — save one monthly.</p>
      <Button className="w-full" onClick={save}>Save snapshot</Button>
      <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Cancel</Button>
    </>
  );
}

function IncomeForm({ onClose }: { onClose: () => void }) {
  const { addIncome } = useStore();
  const [f, setF] = React.useState<IncomeEntry>({ date: fmtDate(new Date()), name: "", amount: 0, ccy: "VND" });
  const set = (k: keyof IncomeEntry, v: string | number) => setF((p) => ({ ...p, [k]: v }));
  const save = () => {
    if (!f.name) { alert("Enter a description"); return; }
    if (!f.amount) { alert("Enter an amount"); return; }
    addIncome(f);
    onClose();
  };
  return (
    <>
      <Field label="Description"><Input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Căn hộ cho thuê, Lương tháng 5" /></Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Date"><Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Currency">
          <Sel value={f.ccy} onValueChange={(v) => set("ccy", v as Currency)}>
            <SelectItem value="VND">VND</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </Sel>
        </Field>
      </div>
      <Field label="Amount"><Input type="number" value={String(f.amount || "")} onChange={(e) => set("amount", num(e.target.value))} /></Field>
      <Button className="w-full" onClick={save}>Add income entry</Button>
      <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Cancel</Button>
    </>
  );
}
