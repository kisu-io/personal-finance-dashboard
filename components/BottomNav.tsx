"use client";

export type ViewKey = "overview" | "holdings" | "perf" | "income" | "manage";

const ITEMS: { key: ViewKey; label: string; path: string }[] = [
  { key: "overview", label: "Overview", path: "M3 13h8V3H3zM13 21h8V8h-8zM13 3v3M3 17v4h8" },
  { key: "holdings", label: "Holdings", path: "M3 6h18M3 12h18M3 18h18" },
  { key: "perf", label: "Performance", path: "M3 17l6-6 4 4 7-7M14 7h5v5" },
  { key: "income", label: "Income", path: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { key: "manage", label: "Manage", path: "M12 9a3 3 0 100 6 3 3 0 000-6z M19.4 13a7.5 7.5 0 000-2l2-1.5-2-3.5-2.4 1a7 7 0 00-1.7-1L15 3h-4l-.3 2a7 7 0 00-1.7 1l-2.4-1-2 3.5L6.6 11a7.5 7.5 0 000 2l-2 1.5 2 3.5 2.4-1a7 7 0 001.7 1l.3 2h4l.3-2a7 7 0 001.7-1l2.4 1 2-3.5z" },
];

export function BottomNav({ view, setView }: { view: ViewKey; setView: (v: ViewKey) => void }) {
  return (
    <nav className="safe-bottom fixed bottom-0 left-1/2 z-50 flex w-full max-w-[480px] -translate-x-1/2 justify-around border-t border-border bg-[rgba(249,249,251,0.86)] px-1.5 pt-2 backdrop-blur-xl">
      {ITEMS.map((it) => {
        const on = it.key === view;
        return (
          <button
            key={it.key}
            onClick={() => setView(it.key)}
            className={`flex flex-1 flex-col items-center gap-[3px] px-2.5 py-1 text-[10px] font-medium ${on ? "text-foreground" : "text-faint"}`}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d={it.path} />
            </svg>
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
