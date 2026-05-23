import type { DB, Asset, AssetClass, Term } from "./types";

export const toVND = (amt: number, ccy: string, fx: number) => (ccy === "USD" ? amt * fx : amt);

export const assetVND = (x: Asset, fx: number) => toVND(x.qty * x.price, x.ccy, fx);
export const costVND = (x: Asset, fx: number) => toVND(x.qty * x.cost, x.ccy, fx);

export const grossAssets = (db: DB) => db.assets.reduce((s, x) => s + assetVND(x, db.fx), 0);
export const totalDebt = (db: DB) => db.debts.reduce((s, d) => s + toVND(d.balance, d.ccy, db.fx), 0);
export const netWorth = (db: DB) => grossAssets(db) - totalDebt(db);
export const costBasis = (db: DB) => db.assets.reduce((s, x) => s + costVND(x, db.fx), 0);

export interface ClassAlloc { cls: AssetClass; v: number; pctv: number; target: number; }

export function allocByClass(db: DB): ClassAlloc[] {
  const g = grossAssets(db) || 1;
  const m = new Map<AssetClass, number>();
  db.assets.forEach((x) => m.set(x.cls, (m.get(x.cls) || 0) + assetVND(x, db.fx)));
  return Array.from(m.entries())
    .map(([cls, v]) => ({
      cls,
      v,
      pctv: (v / g) * 100,
      target: db.assets.filter((a) => a.cls === cls).reduce((s, a) => s + (a.exclTarget ? 0 : a.target), 0),
    }))
    .sort((a, b) => b.v - a.v);
}

export function allocByTerm(db: DB): { t: Term; v: number; pctv: number }[] {
  const g = grossAssets(db) || 1;
  const m: Record<Term, number> = { short: 0, mid: 0, long: 0 };
  db.assets.forEach((x) => (m[x.term] += assetVND(x, db.fx)));
  return (["short", "mid", "long"] as Term[]).map((t) => ({ t, v: m[t], pctv: (m[t] / g) * 100 }));
}

export interface DriftItem { cls: AssetClass; pctv: number; target: number; dr: number; thr: number; over: boolean; }

export function driftItems(db: DB): DriftItem[] {
  return allocByClass(db)
    .filter((x) => x.target > 0)
    .map((x) => {
      const dr = x.pctv - x.target;
      const thr = Math.max(
        ...db.assets.filter((a) => a.cls === x.cls && !a.exclTarget).map((a) => a.drift || 5)
      );
      return { cls: x.cls, pctv: x.pctv, target: x.target, dr, thr, over: Math.abs(dr) > thr };
    });
}

/** XIRR via Newton's method. flows: amt<0 invested, >0 received. */
export function xirr(flows: { date: string; amt: number }[]): number | null {
  if (flows.length < 2) return null;
  const t0 = new Date(flows[0].date).getTime();
  const yr = (f: { date: string }) => (new Date(f.date).getTime() - t0) / (365 * 864e5);
  const npv = (r: number) => flows.reduce((s, f) => s + f.amt / Math.pow(1 + r, yr(f)), 0);
  const d = (r: number) => flows.reduce((s, f) => s - yr(f) * f.amt / Math.pow(1 + r, yr(f) + 1), 0);
  let r = 0.1;
  for (let i = 0; i < 80; i++) {
    const v = npv(r), dv = d(r);
    if (Math.abs(dv) < 1e-9) break;
    const nr = r - v / dv;
    if (!isFinite(nr)) break;
    if (Math.abs(nr - r) < 1e-7) { r = nr; break; }
    r = nr;
  }
  return isFinite(r) && r > -0.99 && r < 10 ? r * 100 : null;
}

export function buildFlows(db: DB): { date: string; amt: number }[] {
  const f = db.txns.map((t) => ({
    date: t.date,
    amt: (t.type === "deposit" || t.type === "buy" ? -1 : 1) * toVND(t.amount, t.ccy, db.fx),
  }));
  db.income.forEach((i) => f.push({ date: i.date, amt: toVND(i.amount, i.ccy, db.fx) }));
  f.sort((x, y) => +new Date(x.date) - +new Date(y.date));
  f.push({ date: new Date().toISOString().slice(0, 10), amt: netWorth(db) });
  return f;
}

/** Time-weighted return (annualized) from snapshots, removing external flows. */
export function twr(db: DB): number | null {
  const s = db.snapshots;
  if (s.length < 2) return null;
  let prod = 1;
  for (let i = 1; i < s.length; i++) {
    const start = new Date(s[i - 1].date), end = new Date(s[i].date);
    let flow = 0;
    db.txns.forEach((t) => {
      const dt = new Date(t.date);
      if (dt > start && dt <= end) flow += (t.type === "deposit" || t.type === "buy" ? 1 : -1) * toVND(t.amount, t.ccy, db.fx);
    });
    const denom = s[i - 1].value + flow;
    if (denom > 0) prod *= s[i].value / denom;
  }
  const years = (+new Date(s[s.length - 1].date) - +new Date(s[0].date)) / (365 * 864e5);
  return years > 0 ? (Math.pow(prod, 1 / years) - 1) * 100 : null;
}

/** Period return from snapshots. months = number or "ytd". */
export function snapReturn(db: DB, months: number | "ytd"): number | null {
  const s = db.snapshots;
  if (s.length < 2) return null;
  const now = s[s.length - 1].value;
  let idx: number;
  if (months === "ytd") {
    const y = new Date().getFullYear();
    idx = s.findIndex((p) => new Date(p.date).getFullYear() === y);
    if (idx > 0) idx--;
    if (idx < 0) idx = 0;
  } else {
    idx = Math.max(0, s.length - 1 - months);
  }
  const past = s[idx].value;
  return past > 0 ? (now / past - 1) * 100 : null;
}
