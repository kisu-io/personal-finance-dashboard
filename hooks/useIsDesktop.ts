import * as React from "react";

export function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}
