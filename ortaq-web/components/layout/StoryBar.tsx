"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

/**
 * StoryBar — Discovery journey navigation.
 *
 * Shows the visitor where they are in the product discovery path:
 *
 *   Ana Sayfa  →  Kimler İçin  →  Senaryolar  →  Neden ORTAQ  →  Demo
 *
 * Renders as a compact strip below the main nav.
 * Current page is highlighted. Others are navigable links.
 * Makes the three pages feel like a connected story, not independent pages.
 */

const steps = [
  { href: "/",            labelTR: "Ana Sayfa",    labelEN: "Home"       },
  { href: "/kimler-icin", labelTR: "Kimler İçin",  labelEN: "Who Is It For" },
  { href: "/senaryolar",  labelTR: "Senaryolar",   labelEN: "Use Cases"  },
  { href: "/neden-ortaq", labelTR: "Neden ORTAQ",  labelEN: "Why ORTAQ"  },
  { href: "/demo",        labelTR: "Demo",          labelEN: "Demo",      isDemoLink: true },
] as const;

export function StoryBar() {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  return (
    <div className="border-b border-ortaq-border bg-ortaq-surface/80">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label={isTR ? "Keşif yolculuğu" : "Discovery journey"}
          className="flex items-center gap-0 overflow-x-auto py-2 scrollbar-none"
        >
          {steps.map((step, i) => {
            const isActive = pathname === step.href;
            const isPast = steps.findIndex(s => s.href === pathname) > i;
            const label = isTR ? step.labelTR : step.labelEN;
            const isDemoLink = "isDemoLink" in step && step.isDemoLink;

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
                      : isPast
                      ? "text-ortaq-ink-soft line-through"
                      : isDemoLink
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
