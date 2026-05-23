import { describe, it, expect } from "vitest";
import { seedDB } from "./seed";
import {
  xirr, twr, snapReturn, buildFlows, netWorth, grossAssets, totalDebt,
  costBasis, allocByClass, driftItems,
} from "./finance";

describe("xirr known-answer", () => {
  it("returns ~10% for a 1-year double cashflow", () => {
    const r = xirr([{ date: "2025-01-01", amt: -1000 }, { date: "2026-01-01", amt: 1100 }]);
    expect(r).toBeCloseTo(10, 1);
  });
  it("returns ~21% for a 2-year compounded cashflow", () => {
    const r = xirr([{ date: "2024-01-01", amt: -1000 }, { date: "2026-01-01", amt: 1464.1 }]);
    expect(r).toBeCloseTo(21, 0);
  });
});

describe("seed portfolio reconciles", () => {
  it("net worth ≈ 4.72 tỷ", () => {
    expect(netWorth(seedDB) / 1e9).toBeCloseTo(4.72, 1);
  });
  it("gross − debt = net worth", () => {
    expect(grossAssets(seedDB) - totalDebt(seedDB)).toBeCloseTo(netWorth(seedDB), 2);
  });
  it("allocation sums to 100%", () => {
    const sum = allocByClass(seedDB).reduce((s, x) => s + x.pctv, 0);
    expect(sum).toBeCloseTo(100, 1);
  });
  it("portfolio XIRR is in a believable range (10–20%)", () => {
    const r = xirr(buildFlows(seedDB))!;
    expect(r).toBeGreaterThan(10);
    expect(r).toBeLessThan(20);
  });
  it("TWR is positive and below XIRR", () => {
    const t = twr(seedDB)!;
    const x = xirr(buildFlows(seedDB))!;
    expect(t).toBeGreaterThan(0);
    expect(t).toBeLessThanOrEqual(x);
  });
  it("YTD and 1Y returns are defined", () => {
    expect(snapReturn(seedDB, "ytd")).not.toBeNull();
    expect(snapReturn(seedDB, 12)).not.toBeNull();
  });
  it("unrealized gain is positive vs cost basis", () => {
    expect(grossAssets(seedDB)).toBeGreaterThan(costBasis(seedDB));
  });
  it("flags exactly the crypto and term-savings drift", () => {
    const over = driftItems(seedDB).filter((d) => d.over).map((d) => d.cls).sort();
    expect(over).toEqual(["crypto", "savings_term"]);
  });
});
