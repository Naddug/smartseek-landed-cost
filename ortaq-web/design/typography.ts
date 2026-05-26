import { cn } from "@/lib/cn";

/**
 * Canonical typography contract.
 *
 * Strict 7-tier hierarchy, ordered top-down:
 *
 *   display     hero / masthead headline
 *   h1          page-level title
 *   h2          section title (primary tier)
 *   h3          sub-section title (secondary tier)
 *   label       uppercase kicker, used above any heading or above tables
 *   table       table cells — body-weight with tabular-nums on by default
 *   meta        timestamps, dimensions, captions inside dense layouts
 *
 * Plus essentials:
 *
 *   body        default copy
 *   bodySm      compact copy
 *   caption     tertiary copy
 *   link        underline contract for inline links
 *   metric      large tabular-nums stat (rare; only in summary cards)
 *
 * No serif/cinematic tokens. The serif font is opt-in via the explicit
 * `font-heading` utility class — never the default.
 *
 * No `light` variants. Surfaces that need light copy on dark backgrounds
 * compose `text-ortaq-cream` / `text-ortaq-cream/80` at the call site.
 */
export const typography = {
  // Headings — sans, tight tracking, balanced wrap
  display:
    "font-body text-[1.625rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ortaq-ink sm:text-[2rem] lg:text-[2.125rem]",
  h1: "font-body text-[1.375rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ortaq-ink sm:text-[1.5rem]",
  h2: "font-body text-[1.125rem] font-semibold leading-[1.2] tracking-[-0.015em] text-ortaq-ink sm:text-[1.1875rem]",
  h3: "font-body text-[0.9375rem] font-semibold leading-[1.25] text-ortaq-ink sm:text-base",

  // Body
  body: "text-[0.875rem] leading-[1.55] text-ortaq-ink-muted sm:text-[0.9375rem]",
  bodySm: "text-[0.8125rem] leading-[1.5] text-ortaq-ink-muted",
  caption: "text-[0.75rem] leading-[1.45] text-ortaq-ink-soft",

  // Specialist
  label: "text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft",
  table: "text-[0.8125rem] leading-[1.45] tabular-nums text-ortaq-ink",
  meta: "text-[0.75rem] leading-[1.45] tabular-nums text-ortaq-ink-soft",
  metric: "font-body text-[1.375rem] font-semibold leading-none tabular-nums text-ortaq-ink sm:text-[1.5rem]",

  // Inline link contract
  link: "text-ortaq-ink underline-offset-2 decoration-ortaq-border-strong hover:decoration-ortaq-ink transition-colors",
} as const;

export function typ(classNames: keyof typeof typography, extra?: string) {
  return cn(typography[classNames], extra);
}
