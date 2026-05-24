"use client";
import { useStore } from "@/lib/store";
import { assetVND } from "@/lib/finance";
import { CLASSES } from "@/lib/classes";
import { ClassIcon } from "@/lib/class-icons";
import { Sparkline, syntheticSeries } from "@/components/charts/Sparkline";
import { IconTriangleFilled, IconTriangleInvertedFilled } from "@tabler/icons-react";
import type { Asset } from "@/lib/types";

const TINTS = [
  { bg: "hsl(var(--pastel-pink))",   ink: "hsl(var(--pastel-pink-ink))" },
  { bg: "hsl(var(--pastel-lav))",    ink: "hsl(var(--pastel-lav-ink))" },
  { bg: "hsl(var(--pastel-mint))",   ink: "hsl(var(--pastel-mint-ink))" },
  { bg: "hsl(var(--pastel-butter))", ink: "hsl(var(--pastel-butter-ink))" },
];

export function MyPortfolioCard() {
  const { db, ds } = useStore();
  const top = db.assets
    .slice()
    .sort((a, b) => assetVND(b, db.fx) - assetVND(a, db.fx))
    .slice(0, 3);

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between">
        <h3 className="bento-title">My Portfolio</h3>
        <button className="text-[12px] font-medium text-muted-foreground hover:text-foreground">
          View all →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {top.map((a, i) => (
          <AssetTile key={a.id} asset={a} tint={TINTS[i % TINTS.length]} totalVND={assetVND(a, db.fx)} ds={ds} />
        ))}
      </div>
    </div>
  );
}

function AssetTile({
  asset, tint, totalVND, ds,
}: {
  asset: Asset; tint: { bg: string; ink: string }; totalVND: number; ds: (v: number) => string;
}) {
  const change = asset.cost > 0 ? ((asset.price - asset.cost) / asset.cost) * 100 : 0;
  const series = syntheticSeries(asset.id, 18, asset.price || 1);
  const cls = CLASSES[asset.cls];

  return (
    <div
      className="flex flex-col gap-3 rounded-[18px] p-4 transition-transform hover:-translate-y-0.5"
      style={{ background: tint.bg, color: tint.ink, minHeight: 180 }}
    >
      <div className="flex items-center gap-2">
        <span
          className="grid h-9 w-9 place-items-center rounded-full bg-white/70"
          style={{ color: tint.ink }}
        >
          <ClassIcon cls={asset.cls} size={18} stroke={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold leading-tight">{asset.name}</div>
          <div className="truncate text-[10px] opacity-70">{cls.label}</div>
        </div>
      </div>

      <div className="flex-1" style={{ color: tint.ink }}>
        <Sparkline data={series} width={220} height={48} stroke="currentColor" strokeWidth={1.6} />
      </div>

      <div>
        <div className="tabular text-[18px] font-bold leading-tight">{ds(totalVND)}</div>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className="tabular inline-flex items-center gap-1 rounded-full bg-white/55 px-1.5 py-0.5 text-[10px] font-bold"
          >
            {change >= 0 ? (
              <IconTriangleFilled size={9} />
            ) : (
              <IconTriangleInvertedFilled size={9} />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-[10px] opacity-70">since cost</span>
        </div>
      </div>
    </div>
  );
}
