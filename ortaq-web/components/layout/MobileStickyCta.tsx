"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

export function MobileStickyCta() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hiddenPaths = ["/teklif", "/guven"];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;
  if (dismissed || !visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-ortaq-border bg-ortaq-surface/95 backdrop-blur-md safe-bottom md:hidden",
        "shadow-[0_-4px_24px_rgba(20,19,16,0.08)]",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 text-[0.8125rem] font-medium leading-snug text-ortaq-ink">
          {t("home.whitelabel.close.headline")}
        </p>
        <Link
          href="/teklif"
          className="inline-flex shrink-0 min-h-10 items-center justify-center rounded-md bg-ortaq-trust-deep px-4 text-[0.8125rem] font-semibold text-white"
        >
          {t("home.whitelabel.close.cta")}
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-ortaq-ink-soft"
          aria-label={isTR ? "Kapat" : "Close"}
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
