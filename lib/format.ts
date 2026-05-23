import type { Currency } from "./types";

export function fmtN(n: number, dec = 0): string {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/** Full amount in the active display currency. `vnd` is always in VND base. */
export function disp(vnd: number, ccy: Currency, fx: number): string {
  if (ccy === "USD") {
    const v = vnd / fx;
    return "$" + fmtN(v, Math.abs(v) < 1000 ? 2 : 0);
  }
  return fmtN(vnd, 0) + "₫";
}

/** Compact amount (tỷ / tr or M / K) in the active display currency. */
export function dispShort(vnd: number, ccy: Currency, fx: number): string {
  const v = ccy === "USD" ? vnd / fx : vnd;
  const abs = Math.abs(v);
  let s = v;
  let suf = "";
  if (ccy === "VND") {
    if (abs >= 1e9) { s = v / 1e9; suf = " tỷ"; }
    else if (abs >= 1e6) { s = v / 1e6; suf = " tr"; }
  } else {
    if (abs >= 1e6) { s = v / 1e6; suf = "M"; }
    else if (abs >= 1e3) { s = v / 1e3; suf = "K"; }
  }
  const num = fmtN(s, Math.abs(s) < 100 ? (suf ? 1 : 0) : 0);
  return ccy === "USD" ? "$" + num + suf : num + suf;
}

export function pct(x: number, dec = 1): string {
  return (x >= 0 ? "+" : "") + x.toFixed(dec) + "%";
}

export function arrow(x: number): string {
  return x > 0 ? "▲" : x < 0 ? "▼" : "·";
}

export function fmtDate(d: string | number | Date): string {
  return new Date(d).toISOString().slice(0, 10);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}
