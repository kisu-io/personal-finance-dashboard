import type { AssetClass, Term } from "./types";

/** Categorical data uses a grayscale ramp (darkest = typically largest class).
 *  Red/green are reserved strictly for gain/loss & alerts. */
export const CLASSES: Record<AssetClass, { label: string; ico: string; color: string }> = {
  real_estate:   { label: "Bất động sản",          ico: "🏠", color: "#1C1C1E" },
  crypto:        { label: "Crypto",                 ico: "₿", color: "#3A3A3C" },
  savings_term:  { label: "Tiết kiệm có kỳ hạn",    ico: "🏦", color: "#48484A" },
  vn_stock:      { label: "Cổ phiếu VN",            ico: "📈", color: "#636366" },
  vn_etf:        { label: "ETF VN",                 ico: "🧺", color: "#7C7C80" },
  foreign_stock: { label: "Cổ phiếu nước ngoài",    ico: "🌎", color: "#8E8E93" },
  gold:          { label: "Vàng",                   ico: "🪙", color: "#A1A1A6" },
  usd_cash:      { label: "USD cash",               ico: "💵", color: "#B5B5BA" },
  savings_flex:  { label: "Tiết kiệm linh hoạt",    ico: "💧", color: "#C7C7CC" },
  bond:          { label: "Trái phiếu / P2P",       ico: "📜", color: "#D8D8DC" },
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
