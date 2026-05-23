export type AssetClass =
  | "savings_term" | "savings_flex" | "vn_stock" | "vn_etf" | "foreign_stock"
  | "crypto" | "gold" | "usd_cash" | "real_estate" | "bond";

export type Term = "short" | "mid" | "long";
export type Currency = "VND" | "USD";

export type TxnType = "deposit" | "withdrawal" | "buy" | "sell" | "dividend" | "interest";
export type DebtType = "mortgage" | "margin" | "personal";

export interface Asset {
  id: string;
  name: string;
  cls: AssetClass;
  term: Term;
  ccy: Currency;
  qty: number;
  cost: number;     // cost per unit
  price: number;    // current price per unit
  target: number;   // target allocation %
  drift: number;    // drift band ±%
  note?: string;
  exclTarget?: boolean;
  symbol?: string;  // for future price feeds
}

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  ccy: Currency;
  balance: number;
  rate: number;
  note?: string;
}

export interface Txn {
  date: string;
  type: TxnType;
  ccy: Currency;
  amount: number;
  note?: string;
}

export interface IncomeEntry {
  date: string;
  name: string;
  amount: number;
  ccy: Currency;
}

export interface Snapshot {
  date: string;
  value: number; // VND
}

export interface DB {
  fx: number; // VND per USD
  assets: Asset[];
  debts: Debt[];
  txns: Txn[];
  income: IncomeEntry[];
  snapshots: Snapshot[];
  realized: number; // realized gains ITD (VND)
}
