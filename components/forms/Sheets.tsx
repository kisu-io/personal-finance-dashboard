"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { CLASSES } from "@/lib/classes";
import type { Asset, Debt, Txn, AssetClass, Term, Currency, TxnType, DebtType } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type SheetKind = "asset" | "txn" | "debt" | "fx" | null;

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-12 w-full rounded-[10px] border border-border bg-card px-3 text-base text-foreground focus:border-foreground focus:outline-none focus:ring-[3px] focus:ring-foreground/10"
    />
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-3"><Label>{label}</Label>{children}</div>
);

export function FormSheets({ kind, id, onClose }: { kind: SheetKind; id?: string; onClose: () => void }) {
  const open = kind !== null;
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      {kind === "asset" && <SheetContent title={id ? "Edit investment / asset" : "New investment / asset"}><AssetForm id={id} onClose={onClose} /></SheetContent>}
      {kind === "txn" && <SheetContent title="Record a transaction"><TxnForm onClose={onClose} /></SheetContent>}
      {kind === "debt" && <SheetContent title={id ? "Edit liability" : "Add liability"}><DebtForm id={id} onClose={onClose} /></SheetContent>}
      {kind === "fx" && <SheetContent title="FX rate"><FxForm onClose={onClose} /></SheetContent>}
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
  const set = (k: keyof Asset, v: any) => setF((p) => ({ ...p, [k]: v }));
  const save = () => { upsertAsset({ ...f, id }); onClose(); };

  return (
    <>
      <Field label="Name"><Input value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="e.g. FPT, BTC, Vàng SJC" /></Field>
      <Field label="Asset class">
        <Select value={f.cls} onChange={(e) => set("cls", e.target.value as AssetClass)}>
          {(Object.keys(CLASSES) as AssetClass[]).map((k) => <option key={k} value={k}>{CLASSES[k].ico} {CLASSES[k].label}</option>)}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Time horizon">
          <Select value={f.term} onChange={(e) => set("term", e.target.value as Term)}>
            <option value="short">Ngắn hạn</option><option value="mid">Trung hạn</option><option value="long">Dài hạn</option>
          </Select>
        </Field>
        <Field label="Currency">
          <Select value={f.ccy} onChange={(e) => set("ccy", e.target.value as Currency)}><option>VND</option><option>USD</option></Select>
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
      <Button onClick={save}>{id ? "Save changes" : "Add asset"}</Button>
      {id && <Button variant="destructive" className="mt-2" onClick={() => { if (confirm("Delete this asset?")) { deleteAsset(id); onClose(); } }}>Delete</Button>}
      <Button variant="ghost" className="mt-2" onClick={onClose}>Cancel</Button>
    </>
  );
}

function TxnForm({ onClose }: { onClose: () => void }) {
  const { addTxn } = useStore();
  const [f, setF] = React.useState<Txn>({ type: "deposit", date: fmtDate(new Date()), ccy: "VND", amount: 0, note: "" });
  const set = (k: keyof Txn, v: any) => setF((p) => ({ ...p, [k]: v }));
  const save = () => { if (!f.amount) { alert("Enter an amount"); return; } addTxn(f); onClose(); };
  return (
    <>
      <Field label="Type">
        <Select value={f.type} onChange={(e) => set("type", e.target.value as TxnType)}>
          <option value="deposit">Deposit (vốn vào)</option><option value="withdrawal">Withdrawal (rút ra)</option>
          <option value="buy">Buy</option><option value="sell">Sell</option>
          <option value="dividend">Dividend</option><option value="interest">Interest</option>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Date"><Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Currency"><Select value={f.ccy} onChange={(e) => set("ccy", e.target.value as Currency)}><option>VND</option><option>USD</option></Select></Field>
      </div>
      <Field label="Amount"><Input type="number" value={String(f.amount || "")} onChange={(e) => set("amount", num(e.target.value))} /></Field>
      <Field label="Note"><Input value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} /></Field>
      <p className="-mt-1.5 mb-3 px-0.5 text-xs leading-snug text-faint">Deposits/withdrawals feed XIRR &amp; TWR. Dividend/interest also appear in Income.</p>
      <Button onClick={save}>Save transaction</Button>
      <Button variant="ghost" className="mt-2" onClick={onClose}>Cancel</Button>
    </>
  );
}

function DebtForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const { db, upsertDebt, deleteDebt } = useStore();
  const ex = id ? db.debts.find((x) => x.id === id) : undefined;
  const [f, setF] = React.useState<Partial<Debt>>(ex ?? { name: "", type: "mortgage", ccy: "VND", balance: 0, rate: 0, note: "" });
  const set = (k: keyof Debt, v: any) => setF((p) => ({ ...p, [k]: v }));
  const save = () => { upsertDebt({ ...f, id }); onClose(); };
  return (
    <>
      <Field label="Name"><Input value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Type">
        <Select value={f.type} onChange={(e) => set("type", e.target.value as DebtType)}>
          <option value="mortgage">Mortgage</option><option value="margin">Margin</option><option value="personal">Personal loan</option>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Outstanding balance"><Input type="number" value={String(f.balance ?? "")} onChange={(e) => set("balance", num(e.target.value))} /></Field>
        <Field label="Currency"><Select value={f.ccy} onChange={(e) => set("ccy", e.target.value as Currency)}><option>VND</option><option>USD</option></Select></Field>
      </div>
      <Field label="Interest rate %/yr"><Input type="number" value={String(f.rate ?? "")} onChange={(e) => set("rate", num(e.target.value))} /></Field>
      <Field label="Note"><Input value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} /></Field>
      <Button onClick={save}>{id ? "Save changes" : "Add liability"}</Button>
      {id && <Button variant="destructive" className="mt-2" onClick={() => { if (confirm("Delete?")) { deleteDebt(id); onClose(); } }}>Delete</Button>}
      <Button variant="ghost" className="mt-2" onClick={onClose}>Cancel</Button>
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
      <Button onClick={() => { setFx(Number(v) || db.fx); onClose(); }}>Save</Button>
      <Button variant="ghost" className="mt-2" onClick={onClose}>Cancel</Button>
    </>
  );
}
