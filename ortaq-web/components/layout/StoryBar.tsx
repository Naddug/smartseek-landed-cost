"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

const steps = [
  { href: "/", labelTR: "Ana Sayfa", labelEN: "Home" },
  { href: "/nasil-calisir", labelTR: "Nasıl Çalışır", labelEN: "How It Works" },
  { href: "/ne-yapiyoruz", labelTR: "Ne Yapıyoruz", labelEN: "What We Do" },
  { href: "/neden-ortaq", labelTR: "Neden ORTAQ", labelEN: "Why ORTAQ" },
  { href: "/teklif", labelTR: "Teklif", labelEN: "Quote", isCta: true },
] as const;

export function StoryBar() {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <div className="border-b border-ortaq-border bg-ortaq-surface/80">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label={isTR ? "Site yolculuğu" : "Site journey"}
          className="flex items-center gap-0 overflow-x-auto py-2 scrollbar-none"
        >
          {steps.map((step, i) => {
            const isActive = pathname === step.href;
            const label = isTR ? step.labelTR : step.labelEN;
            const isCta = "isCta" in step && step.isCta;

            return (
              <div key={step.href} className="flex shrink-0 items-center">
                {i > 0 && (
                  <span className="mx-2 text-[0.5rem] text-ortaq-ink-soft/40">→</span>
                )}
                <Link
                  href={step.href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-2.5 py-1 text-[0.5625rem] font-semibold transition-colors",
                    isActive
                      ? "bg-ortaq-ink text-ortaq-cream"
                      : isCta
                        ? "text-ortaq-trust hover:text-ortaq-trust-soft"
                        : "text-ortaq-ink-soft hover:text-ortaq-ink",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
