import type { AssetClass, Term } from "./types";

/** Categorical data uses a grayscale ramp (darkest = typically largest class).
 *  Red/green are reserved strictly for gain/loss & alerts.
 *  Pictographic icons live in `class-icons.tsx` (Tabler). */
export const CLASSES: Record<AssetClass, { label: string; color: string }> = {
  real_estate:   { label: "Bất động sản",          color: "#1C1C1E" },
  crypto:        { label: "Crypto",                 color: "#3A3A3C" },
  savings_term:  { label: "Tiết kiệm có kỳ hạn",    color: "#48484A" },
  vn_stock:      { label: "Cổ phiếu VN",            color: "#636366" },
  vn_etf:        { label: "ETF VN",                 color: "#7C7C80" },
  foreign_stock: { label: "Cổ phiếu nước ngoài",    color: "#8E8E93" },
  gold:          { label: "Vàng",                   color: "#A1A1A6" },
  usd_cash:      { label: "USD cash",               color: "#B5B5BA" },
  savings_flex:  { label: "Tiết kiệm linh hoạt",    color: "#C7C7CC" },
  bond:          { label: "Trái phiếu / P2P",       color: "#D8D8DC" },
};

export const TERMS: Record<Term, string> = {
  short: "Ngắn hạn",
  mid: "Trung hạn",
  long: "Dài hạn",
};

export const TXN_LABELS: Record<string, string> = {
  deposit: "Deposit (vốn vào)",
  withdrawal: "Withdrawal (rút ra)",
  buy: "Buy",
  sell: "Sell",
  dividend: "Dividend",
  interest: "Interest",
};

export const DEBT_LABELS: Record<string, string> = {
  mortgage: "Mortgage",
  margin: "Margin",
  personal: "Personal loan",
};
