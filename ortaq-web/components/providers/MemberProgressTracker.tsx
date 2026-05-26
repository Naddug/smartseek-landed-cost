"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { markPageRead } from "@/lib/member/storage";

const TRACKED = new Set([
  "/basla",
  "/nasil-calisir",
  "/guven",
  "/riskler",
  "/sss",
  "/sozluk",
  "/sirket/karat-parca-konya",
  "/sirketler",
  "/degerlendirme",
]);

export function MemberProgressTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (TRACKED.has(pathname)) {
      markPageRead(pathname);
    }
  }, [pathname]);

  return null;
}
