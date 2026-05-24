import {
  IconHome2,
  IconCurrencyBitcoin,
  IconBuildingBank,
  IconTrendingUp,
  IconShoppingBag,
  IconWorld,
  IconCoinFilled,
  IconCash,
  IconDroplet,
  IconCertificate,
  type Icon,
} from "@tabler/icons-react";
import type { AssetClass } from "./types";

export type TablerIcon = Icon;

export const CLASS_ICONS: Record<AssetClass, TablerIcon> = {
  real_estate:   IconHome2,
  crypto:        IconCurrencyBitcoin,
  savings_term:  IconBuildingBank,
  vn_stock:      IconTrendingUp,
  vn_etf:        IconShoppingBag,
  foreign_stock: IconWorld,
  gold:          IconCoinFilled,
  usd_cash:      IconCash,
  savings_flex:  IconDroplet,
  bond:          IconCertificate,
};

interface ClassIconProps {
  cls: AssetClass;
  size?: number;
  stroke?: number;
  className?: string;
}

/** Convenience wrapper that picks the right Tabler icon for an AssetClass. */
export function ClassIcon({ cls, size = 18, stroke = 1.8, className }: ClassIconProps) {
  const Icon = CLASS_ICONS[cls];
  return <Icon size={size} stroke={stroke} className={className} />;
}
