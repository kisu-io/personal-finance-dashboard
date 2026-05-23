"use client";
import * as React from "react";
import type { DB, Asset, Debt, Txn, Currency } from "./types";
import { seedDB } from "./seed";
import { disp, dispShort, uid } from "./format";
import { toVND } from "./finance";

const KEY = "pf_webapp_v1";

interface StoreCtx {
  db: DB;
  ccy: Currency;
  setCcy: (c: Currency) => void;
  d: (vnd: number) => string;       // full amount in active currency
  ds: (vnd: number) => string;      // compact amount in active currency
  upsertAsset: (a: Partial<Asset> & { id?: string }) => void;
  deleteAsset: (id: string) => void;
  addTxn: (t: Txn) => void;
  upsertDebt: (d: Partial<Debt> & { id?: string }) => void;
  deleteDebt: (id: string) => void;
  setFx: (fx: number) => void;
  reset: () => void;
  exportJSON: () => void;
}

const Ctx = React.createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = React.useState<DB>(seedDB);
  const [ccy, setCcy] = React.useState<Currency>("VND");
  const [hydrated, setHydrated] = React.useState(false);

  // hydrate from localStorage on mount (client only)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDb(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // persist
  React.useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
    }
  }, [db, hydrated]);

  const value: StoreCtx = {
    db,
    ccy,
    setCcy,
    d: (vnd) => disp(vnd, ccy, db.fx),
    ds: (vnd) => dispShort(vnd, ccy, db.fx),
    upsertAsset: (a) =>
      setDb((p) => {
        if (a.id && p.assets.some((x) => x.id === a.id)) {
          return { ...p, assets: p.assets.map((x) => (x.id === a.id ? { ...x, ...a } as Asset : x)) };
        }
        return { ...p, assets: [...p.assets, { ...(a as Asset), id: uid() }] };
      }),
    deleteAsset: (id) => setDb((p) => ({ ...p, assets: p.assets.filter((x) => x.id !== id) })),
    addTxn: (t) =>
      setDb((p) => {
        const next: DB = { ...p, txns: [...p.txns, t] };
        if (t.type === "dividend" || t.type === "interest") {
          next.income = [...p.income, { date: t.date, name: t.note || (t.type === "dividend" ? "Dividend" : "Interest"), amount: t.amount, ccy: t.ccy }];
        }
        if (t.type === "sell") {
          next.realized = (p.realized || 0) + toVND(t.amount, t.ccy, p.fx) * 0.1;
        }
        return next;
      }),
    upsertDebt: (d) =>
      setDb((p) => {
        if (d.id && p.debts.some((x) => x.id === d.id)) {
          return { ...p, debts: p.debts.map((x) => (x.id === d.id ? { ...x, ...d } as Debt : x)) };
        }
        return { ...p, debts: [...p.debts, { ...(d as Debt), id: uid() }] };
      }),
    deleteDebt: (id) => setDb((p) => ({ ...p, debts: p.debts.filter((x) => x.id !== id) })),
    setFx: (fx) => setDb((p) => ({ ...p, fx })),
    reset: () => setDb(seedDB),
    exportJSON: () => {
      const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "finance_dashboard.json"; a.click();
      URL.revokeObjectURL(url);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
