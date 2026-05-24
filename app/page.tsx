// app/page.tsx
"use client";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { MobileApp } from "@/components/layout/MobileApp";
import { DesktopApp } from "@/components/layout/DesktopApp";

export default function Page() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopApp /> : <MobileApp />;
}
