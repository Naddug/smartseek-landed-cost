"use client";

import Link from "next/link";
import { Crown, FileCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const tierIcons = {
  owner: FileCheck,
  partner: ShieldCheck,
  visibility: Crown,
} as const;

interface MonetizationTiersProps {
  variant?: "light" | "dark";
  showCtas?: boolean;
  className?: string;
}

export function MonetizationTiers({
  variant = "light",
  showCtas = true,
  className,
}: MonetizationTiersProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {ORTAQ_COPY.monetization.tiers.map((tier) => {
        const Icon = tierIcons[tier.id];
        return (
          <div
            key={tier.id}
            className={cn(
              "flex flex-col rounded-xl border p-5",
              isDark
                ? "border-ortaq-dark-border bg-ortaq-dark-elevated"
                : "card-editorial shadow-ortaq-sm"
            )}
          >
            <div
              className={cn(
                "mb-4 flex h-9 w-9 items-center justify-center rounded-lg",
                isDark ? "bg-blue-600/25 text-blue-300" : "bg-blue-50 text-blue-600"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <p className={isDark ? "type-eyebrow-light" : "type-eyebrow"}>{tier.eyebrow}</p>
            <h3
              className={cn(
                "mt-1 font-heading text-base font-semibold",
                isDark ? "text-ortaq-dark-text" : "text-ortaq-navy"
              )}
            >
              {tier.title}
            </h3>
            <p
              className={cn(
                "mt-2 flex-1 text-sm leading-relaxed",
                isDark ? "text-ortaq-dark-text-secondary" : "text-ortaq-text-secondary"
              )}
            >
              {tier.description}
            </p>
            {showCtas && tier.href && (
              <Link href={tier.href} className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full text-xs",
                    isDark && "btn-on-dark-outline"
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
