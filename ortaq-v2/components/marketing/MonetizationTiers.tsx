"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, TrendingUp, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const tierIcons = {
  owner: Sparkles,
  partner: ShieldCheck,
  visibility: Zap,
} as const;

interface MonetizationTiersProps {
  variant?: "light" | "dark";
  showCtas?: boolean;
  className?: string;
  layout?: "grid" | "homepage";
}

export function MonetizationTiers({
  variant = "light",
  showCtas = true,
  className,
  layout = "grid",
}: MonetizationTiersProps) {
  const isDark = variant === "dark";
  const isHomepage = layout === "homepage";

  return (
    <div
      className={cn(
        isHomepage
          ? "grid gap-5 lg:grid-cols-12 lg:items-stretch"
          : "grid gap-4 md:grid-cols-3",
        className
      )}
    >
      {ORTAQ_COPY.monetization.tiers.map((tier) => {
        const Icon = tierIcons[tier.id];
        const isPrimary = tier.emphasis === "primary";

        return (
          <div
            key={tier.id}
            className={cn(
              "flex flex-col rounded-2xl border p-6 transition-shadow",
              isHomepage && isPrimary && "lg:col-span-5 lg:p-8",
              isHomepage && tier.emphasis === "secondary" && "lg:col-span-4",
              isHomepage && tier.emphasis === "tertiary" && "lg:col-span-3",
              isPrimary
                ? isDark
                  ? "border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-ortaq-dark-elevated shadow-ortaq-dark"
                  : "border-blue-200 bg-gradient-to-br from-blue-50/80 to-white shadow-ortaq-md"
                : isDark
                  ? "border-ortaq-dark-border bg-ortaq-dark-elevated"
                  : "card-editorial shadow-ortaq-sm"
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  isPrimary
                    ? "bg-blue-600 text-white"
                    : isDark
                      ? "bg-blue-600/25 text-blue-300"
                      : "bg-blue-50 text-blue-600"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {isPrimary && (
                <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-blue-700">
                  Öne çıkan
                </span>
              )}
              {tier.id === "visibility" && (
                <TrendingUp className="h-4 w-4 text-ortaq-text-muted" />
              )}
            </div>

            <p className={isDark ? "type-eyebrow-light" : "type-eyebrow"}>{tier.eyebrow}</p>
            <h3
              className={cn(
                "mt-1 font-heading font-semibold leading-snug",
                isPrimary ? "text-lg md:text-xl" : "text-base",
                isDark ? "text-ortaq-dark-text" : "text-ortaq-navy"
              )}
            >
              {tier.title}
            </h3>
            <p
              className={cn(
                "mt-3 flex-1 text-sm leading-relaxed",
                isDark ? "text-ortaq-dark-text-secondary" : "text-ortaq-text-secondary"
              )}
            >
              {tier.description}
            </p>

            <ul className="mt-5 space-y-2.5 border-t border-dashed pt-4"
              style={{ borderColor: isDark ? "rgba(255,255,255,0.12)" : "var(--ortaq-line)" }}
            >
              {tier.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className={cn(
                    "flex items-start gap-2.5 text-sm",
                    isDark ? "text-ortaq-dark-text-secondary" : "text-ortaq-text-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                      isPrimary
                        ? "bg-blue-600 text-white"
                        : isDark
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-blue-50 text-blue-600"
                    )}
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>

            <p
              className={cn(
                "mt-4 text-xs leading-relaxed",
                isDark ? "text-ortaq-dark-text-muted" : "text-ortaq-text-muted"
              )}
            >
              {tier.microline}
            </p>

            {showCtas && tier.href && (
              <Link href={tier.href} className="mt-5">
                <Button
                  variant={isPrimary ? "default" : isDark ? "outlineOnDark" : "outline"}
                  size="sm"
                  className={cn(
                    "w-full text-xs",
                    isPrimary && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {tier.cta}
                </Button>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
