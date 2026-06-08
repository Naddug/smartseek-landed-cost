"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/** Mobile quote CTA — fixed bottom bar on small screens. */

export function MobileStickyCta() {
  const { t, i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 240);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Don't show on quote or trust pages
  const hiddenPaths = ["/teklif", "/guven"];
  if (hiddenPaths.some(p => pathname.startsWith(p))) return null;
  if (dismissed) return null;
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-ortaq-border bg-white/97 backdrop-blur-md safe-bottom md:hidden",
        "shadow-[0_-4px_24px_rgba(20,19,16,0.12)]",
        "transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-[0.75rem] font-bold text-ortaq-ink leading-snug">
            {t("home.operator.closingCta.headline")}
          </p>
          <p className="text-[0.5625rem] text-ortaq-ink-muted">
            {t("home.operator.closingCta.subheadline")}
          </p>
        </div>

        <Link
          href="/teklif"
          className="inline-flex shrink-0 min-h-10 items-center justify-center rounded-lg bg-ortaq-trust px-4 text-[0.8125rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
        >
          {t("nav.getQuote")}
        </Link>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ortaq-border text-ortaq-ink-soft/50 transition-colors hover:border-ortaq-border-strong hover:text-ortaq-ink-soft"
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
