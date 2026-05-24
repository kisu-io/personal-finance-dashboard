"use client";
import * as React from "react";
import { Header } from "@/components/Header";
import { BottomNav, type ViewKey } from "@/components/BottomNav";
import { Overview } from "@/components/views/Overview";
import { Holdings } from "@/components/views/Holdings";
import { Performance } from "@/components/views/Performance";
import { Income } from "@/components/views/Income";
import { Manage } from "@/components/views/Manage";
import { FormSheets, type SheetKind } from "@/components/forms/Sheets";

export function MobileApp() {
  const [view, setView] = React.useState<ViewKey>("overview");
  const [sheet, setSheet] = React.useState<{ kind: SheetKind; id?: string }>({ kind: null });
  const openSheet = (kind: SheetKind, id?: string) => setSheet({ kind, id });
  const closeSheet = () => setSheet({ kind: null });

  return (
    <div className="mx-auto max-w-[480px] min-h-screen">
      <div className="pb-[84px]">
        <Header onAdd={() => openSheet("asset")} onFx={() => openSheet("fx")} />
        <main className="pt-0">
          {view === "overview" && <Overview />}
          {view === "holdings" && <Holdings onEdit={(id) => openSheet("asset", id)} />}
          {view === "perf" && <Performance />}
          {view === "income" && <Income />}
          {view === "manage" && <Manage openSheet={openSheet} />}
        </main>
        <BottomNav view={view} setView={setView} />
        <FormSheets kind={sheet.kind} id={sheet.id} onClose={closeSheet} />
      </div>
    </div>
  );
}
