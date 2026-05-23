import type { DB } from "./types";

/** Verified mock dataset · Net worth 4.72 tỷ, XIRR ~14%, TWR ~11%, allocation = 100%.
 *  Phase 1 seed; replaced by Supabase data in Phase 2. */
export const seedDB: DB = {
  "fx": 25450,
  "assets": [
    {
      "id": "2ck8nrj",
      "name": "Techcombank 12M term deposit",
      "cls": "savings_term",
      "term": "long",
      "ccy": "VND",
      "qty": 1,
      "cost": 200000000,
      "price": 200000000,
      "note": "6.2%/năm · đáo hạn 2026-09",
      "target": 5.7,
      "drift": 4
    },
    {
      "id": "jdr35qe",
      "name": "ACB 6M term deposit",
      "cls": "savings_term",
      "term": "mid",
      "ccy": "VND",
      "qty": 1,
      "cost": 150000000,
      "price": 150000000,
      "note": "5.6%/năm · đáo hạn 2026-08",
      "target": 4.3,
      "drift": 4
    },
    {
      "id": "70rk7fd",
      "name": "VPBank flexible savings",
      "cls": "savings_flex",
      "term": "short",
      "ccy": "VND",
      "qty": 1,
      "cost": 95000000,
      "price": 95000000,
      "note": "Quỹ khẩn cấp",
      "target": 4,
      "drift": 3
    },
    {
      "id": "blmln3a",
      "name": "FPT",
      "cls": "vn_stock",
      "term": "long",
      "ccy": "VND",
      "qty": 1200,
      "cost": 95000,
      "price": 138000,
      "note": "",
      "target": 3.2,
      "drift": 5
    },
    {
      "id": "sxt4dlr",
      "name": "VCB",
      "cls": "vn_stock",
      "term": "long",
      "ccy": "VND",
      "qty": 600,
      "cost": 78000,
      "price": 91000,
      "note": "",
      "target": 1,
      "drift": 5
    },
    {
      "id": "3r2yyhi",
      "name": "HPG",
      "cls": "vn_stock",
      "term": "mid",
      "ccy": "VND",
      "qty": 5000,
      "cost": 24500,
      "price": 28900,
      "note": "",
      "target": 2.8,
      "drift": 5
    },
    {
      "id": "6iw2xwb",
      "name": "MWG",
      "cls": "vn_stock",
      "term": "mid",
      "ccy": "VND",
      "qty": 900,
      "cost": 52000,
      "price": 61500,
      "note": "",
      "target": 1.1,
      "drift": 5
    },
    {
      "id": "qcaxvhx",
      "name": "E1VFVN30 ETF",
      "cls": "vn_etf",
      "term": "long",
      "ccy": "VND",
      "qty": 9000,
      "cost": 21800,
      "price": 25400,
      "note": "VN30 ETF",
      "target": 4.5,
      "drift": 5
    },
    {
      "id": "lh49wen",
      "name": "FUEVFVND ETF",
      "cls": "vn_etf",
      "term": "mid",
      "ccy": "VND",
      "qty": 4000,
      "cost": 28000,
      "price": 31200,
      "note": "Diamond ETF",
      "target": 2.5,
      "drift": 5
    },
    {
      "id": "h5hp2po",
      "name": "VOO (S&P 500)",
      "cls": "foreign_stock",
      "term": "long",
      "ccy": "USD",
      "qty": 18,
      "cost": 455,
      "price": 548,
      "note": "",
      "target": 4.9,
      "drift": 5
    },
    {
      "id": "5hc80gk",
      "name": "NVDA",
      "cls": "foreign_stock",
      "term": "mid",
      "ccy": "USD",
      "qty": 30,
      "cost": 88,
      "price": 138,
      "note": "",
      "target": 2.1,
      "drift": 5
    },
    {
      "id": "8bagk5e",
      "name": "BTC",
      "cls": "crypto",
      "term": "mid",
      "ccy": "USD",
      "qty": 0.42,
      "cost": 48000,
      "price": 71500,
      "note": "cold wallet",
      "target": 6.5,
      "drift": 6
    },
    {
      "id": "pyikxrr",
      "name": "ETH (staking)",
      "cls": "crypto",
      "term": "mid",
      "ccy": "USD",
      "qty": 4.5,
      "cost": 2600,
      "price": 3450,
      "note": "staking 3.4% APR",
      "target": 3.3,
      "drift": 6
    },
    {
      "id": "bnzovkl",
      "name": "SOL",
      "cls": "crypto",
      "term": "short",
      "ccy": "USD",
      "qty": 60,
      "cost": 95,
      "price": 168,
      "note": "",
      "target": 2.2,
      "drift": 6
    },
    {
      "id": "oxrudec",
      "name": "Vàng SJC",
      "cls": "gold",
      "term": "long",
      "ccy": "VND",
      "qty": 15,
      "cost": 7600000,
      "price": 9250000,
      "note": "15 chỉ vật chất",
      "target": 5,
      "drift": 4
    },
    {
      "id": "kl8byuh",
      "name": "USD cash",
      "cls": "usd_cash",
      "term": "short",
      "ccy": "USD",
      "qty": 6500,
      "cost": 1,
      "price": 1,
      "note": "Wise + tiền mặt",
      "target": 3,
      "drift": 3
    },
    {
      "id": "t512zbz",
      "name": "Căn hộ cho thuê Q7",
      "cls": "real_estate",
      "term": "long",
      "ccy": "VND",
      "qty": 1,
      "cost": 2200000000,
      "price": 2650000000,
      "note": "đầu tư · cho thuê 14tr/th",
      "target": 40,
      "drift": 8
    },
    {
      "id": "ql45m91",
      "name": "Trái phiếu doanh nghiệp",
      "cls": "bond",
      "term": "mid",
      "ccy": "VND",
      "qty": 1,
      "cost": 100000000,
      "price": 104000000,
      "note": "8.5%/năm",
      "target": 2.7,
      "drift": 3
    },
    {
      "id": "nmrik1n",
      "name": "P2P lending (Tima)",
      "cls": "bond",
      "term": "short",
      "ccy": "VND",
      "qty": 1,
      "cost": 50000000,
      "price": 52000000,
      "note": "~18%/năm · rủi ro cao",
      "target": 1.3,
      "drift": 3
    }
  ],
  "debts": [
    {
      "id": "55e91c5",
      "name": "Mortgage căn hộ Q7",
      "type": "mortgage",
      "ccy": "VND",
      "balance": 1250000000,
      "rate": 9.3,
      "note": "còn 14 năm"
    },
    {
      "id": "ztlkbz7",
      "name": "Margin TCBS",
      "type": "margin",
      "ccy": "VND",
      "balance": 85000000,
      "rate": 13.5,
      "note": ""
    },
    {
      "id": "srl65zf",
      "name": "Vay tiêu dùng",
      "type": "personal",
      "ccy": "VND",
      "balance": 45000000,
      "rate": 11,
      "note": ""
    }
  ],
  "txns": [
    {
      "date": "2023-05-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 1800000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2023-11-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 400000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2024-05-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 500000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2024-11-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 300000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2025-05-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 350000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2025-08-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 150000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2025-11-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 250000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2026-02-23",
      "type": "deposit",
      "ccy": "VND",
      "amount": 200000000,
      "note": "Thêm vốn"
    },
    {
      "date": "2026-03-23",
      "type": "withdrawal",
      "ccy": "VND",
      "amount": 150000000,
      "note": "Rút vốn"
    },
    {
      "date": "2025-09-23",
      "type": "sell",
      "ccy": "VND",
      "amount": 60000000,
      "note": "Chốt lời HPG một phần"
    },
    {
      "date": "2026-01-23",
      "type": "sell",
      "ccy": "USD",
      "amount": 1800,
      "note": "Chốt lời SOL một phần"
    }
  ],
  "income": [
    {
      "date": "2025-03-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-04-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-04-23",
      "name": "Trái phiếu lãi kỳ",
      "amount": 4250000,
      "ccy": "VND"
    },
    {
      "date": "2025-05-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-05-23",
      "name": "FPT cổ tức",
      "amount": 9000000,
      "ccy": "VND"
    },
    {
      "date": "2025-06-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-06-23",
      "name": "VCB cổ tức",
      "amount": 5400000,
      "ccy": "VND"
    },
    {
      "date": "2025-07-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-07-23",
      "name": "Trái phiếu lãi kỳ",
      "amount": 4250000,
      "ccy": "VND"
    },
    {
      "date": "2025-08-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-08-23",
      "name": "Tiền gửi lãi kỳ",
      "amount": 6200000,
      "ccy": "VND"
    },
    {
      "date": "2025-09-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-09-23",
      "name": "ETH staking reward",
      "amount": 640000,
      "ccy": "VND"
    },
    {
      "date": "2025-10-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-10-23",
      "name": "Trái phiếu lãi kỳ",
      "amount": 4250000,
      "ccy": "VND"
    },
    {
      "date": "2025-10-23",
      "name": "P2P lending lãi",
      "amount": 1500000,
      "ccy": "VND"
    },
    {
      "date": "2025-11-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-11-23",
      "name": "ETF cổ tức",
      "amount": 2100000,
      "ccy": "VND"
    },
    {
      "date": "2025-12-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2025-12-23",
      "name": "VCB cổ tức",
      "amount": 5400000,
      "ccy": "VND"
    },
    {
      "date": "2026-01-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2026-01-23",
      "name": "Trái phiếu lãi kỳ",
      "amount": 4250000,
      "ccy": "VND"
    },
    {
      "date": "2026-01-23",
      "name": "ETH staking reward",
      "amount": 640000,
      "ccy": "VND"
    },
    {
      "date": "2026-02-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2026-02-23",
      "name": "Tiền gửi lãi kỳ",
      "amount": 6200000,
      "ccy": "VND"
    },
    {
      "date": "2026-03-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2026-03-23",
      "name": "P2P lending lãi",
      "amount": 1500000,
      "ccy": "VND"
    },
    {
      "date": "2026-04-23",
      "name": "Căn hộ Q7 cho thuê",
      "amount": 14000000,
      "ccy": "VND"
    },
    {
      "date": "2026-04-23",
      "name": "Trái phiếu lãi kỳ",
      "amount": 4250000,
      "ccy": "VND"
    },
    {
      "date": "2026-04-23",
      "name": "FPT cổ tức",
      "amount": 12000000,
      "ccy": "VND"
    },
    {
      "date": "2026-04-23",
      "name": "ETH staking reward",
      "amount": 640000,
      "ccy": "VND"
    }
  ],
  "snapshots": [
    {
      "date": "2023-05-23",
      "value": 1789000000
    },
    {
      "date": "2023-06-23",
      "value": 1816000000
    },
    {
      "date": "2023-07-23",
      "value": 1839000000
    },
    {
      "date": "2023-08-23",
      "value": 1839000000
    },
    {
      "date": "2023-09-23",
      "value": 1849000000
    },
    {
      "date": "2023-10-23",
      "value": 1881000000
    },
    {
      "date": "2023-11-23",
      "value": 2298000000
    },
    {
      "date": "2023-12-23",
      "value": 2295000000
    },
    {
      "date": "2024-01-23",
      "value": 2319000000
    },
    {
      "date": "2024-02-23",
      "value": 2357000000
    },
    {
      "date": "2024-03-23",
      "value": 2366000000
    },
    {
      "date": "2024-04-23",
      "value": 2367000000
    },
    {
      "date": "2024-05-23",
      "value": 2901000000
    },
    {
      "date": "2024-06-23",
      "value": 2941000000
    },
    {
      "date": "2024-07-23",
      "value": 2942000000
    },
    {
      "date": "2024-08-23",
      "value": 2955000000
    },
    {
      "date": "2024-09-23",
      "value": 3004000000
    },
    {
      "date": "2024-10-23",
      "value": 3033000000
    },
    {
      "date": "2024-11-23",
      "value": 3328000000
    },
    {
      "date": "2024-12-23",
      "value": 3358000000
    },
    {
      "date": "2025-01-23",
      "value": 3415000000
    },
    {
      "date": "2025-02-23",
      "value": 3431000000
    },
    {
      "date": "2025-03-23",
      "value": 3431000000
    },
    {
      "date": "2025-04-23",
      "value": 3477000000
    },
    {
      "date": "2025-05-23",
      "value": 3880000000
    },
    {
      "date": "2025-06-23",
      "value": 3885000000
    },
    {
      "date": "2025-07-23",
      "value": 3897000000
    },
    {
      "date": "2025-08-23",
      "value": 4110000000
    },
    {
      "date": "2025-09-23",
      "value": 4155000000
    },
    {
      "date": "2025-10-23",
      "value": 4151000000
    },
    {
      "date": "2025-11-23",
      "value": 4431000000
    },
    {
      "date": "2025-12-23",
      "value": 4507000000
    },
    {
      "date": "2026-01-23",
      "value": 4535000000
    },
    {
      "date": "2026-02-23",
      "value": 4732000000
    },
    {
      "date": "2026-03-23",
      "value": 4639000000
    },
    {
      "date": "2026-04-23",
      "value": 4711000000
    },
    {
      "date": "2026-05-23",
      "value": 4721000000
    }
  ],
  "realized": 29124000
};
