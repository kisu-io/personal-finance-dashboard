"use client";
import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Overview } from "@/components/views/Overview";
import { Holdings } from "@/components/views/Holdings";
import { Performance } from "@/components/views/Performance";
import { Income } from "@/components/views/Income";
import { Manage } from "@/components/views/Manage";
import { FormSheets, type SheetKind } from "@/components/forms/Sheets";
import type { ViewKey } from "@/components/BottomNav";

export function DesktopApp() {
  const [view, setView] = React.useState<ViewKey>("overview");
  const [sheet, setSheet] = React.useState<{ kind: SheetKind; id?: string }>({ kind: null });
  const openSheet = (kind: SheetKind, id?: string) => setSheet({ kind, id });
  const closeSheet = () => setSheet({ kind: null });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        view={view}
        setView={setView}
        onAdd={() => openSheet("asset")}
        onFx={() => openSheet("fx")}
      />
      <main className="flex-1 overflow-y-auto">
        {view === "overview"  && <Overview />}
        {view === "holdings"  && <Holdings onEdit={(id) => openSheet("asset", id)} />}
        {view === "perf"      && <Performance />}
        {view === "income"    && <Income />}
        {view === "manage"    && <Manage openSheet={openSheet} />}
      </main>
      <FormSheets kind={sheet.kind} id={sheet.id} onClose={closeSheet} />
    </div>
  );
}
