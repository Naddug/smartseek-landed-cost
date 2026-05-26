"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { ChevronDown } from "lucide-react";

/**
 * Two visual tiers — primary (operational body) and secondary (back matter).
 *
 * Removed in this refactor:
 *   - The `description` prop. Section descriptions were meta-narration that
 *     diluted scan density. Column headers and the data itself carry meaning;
 *     the dossier no longer explains what each section is.
 *   - The `tone="muted"` prop. Replaced by `tier="secondary"`.
 *
 * Collapsible mode uses native <details> for accessibility and zero JS.
 * Default is `open`; anchor links into the section always reveal content.
 */

type DossierSectionProps = {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
  tier?: "primary" | "secondary";
  /** Render as <details> with a clickable summary. Default false. */
  collapsible?: boolean;
};

export function DossierSection({
  id,
  label,
  title,
  children,
  className,
  tier = "primary",
  collapsible = false,
}: DossierSectionProps) {
  const titleClass = tier === "secondary" ? typography.h3 : typography.h2;
  const sectionBase =
    "scroll-mt-[7.5rem] border-b border-ortaq-border sm:scroll-mt-24";
  const sectionBg = tier === "secondary" ? "bg-ortaq-bg-alt/40" : "";

  if (collapsible) {
    return (
      <details
        id={id}
        open
        className={cn(sectionBase, "group", sectionBg, className)}
      >
        <summary
          className={cn(
            "flex cursor-pointer items-start justify-between gap-3 py-4 sm:py-5",
            "list-none [&::-webkit-details-marker]:hidden",
          )}
        >
          <div className="min-w-0">
            <p className={typography.label}>{label}</p>
            <h2 className={cn(titleClass, "mt-1")}>{title}</h2>
          </div>
          <ChevronDown
            className="mt-1 h-4 w-4 shrink-0 text-ortaq-ink-soft transition-transform group-open:rotate-180"
            strokeWidth={1.5}
            aria-hidden
          />
        </summary>
        <div className="pb-5 sm:pb-6">{children}</div>
      </details>
    );
  }

  return (
    <section id={id} className={cn(sectionBase, "py-5 sm:py-6", sectionBg, className)}>
      <header className="mb-3 sm:mb-4">
        <p className={typography.label}>{label}</p>
        <h2 className={cn(titleClass, "mt-1")}>{title}</h2>
      </header>
      {children}
    </section>
  );
}
