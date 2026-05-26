import { cn } from "@/lib/cn";

/** Editorial type system — slow, institutional reading */
export const typography = {
  display:
    "font-heading text-[2.25rem] leading-[1.02] tracking-[-0.035em] text-ortaq-ink sm:text-[3.25rem] lg:text-[3.75rem]",
  displayLight:
    "font-heading text-[2.5rem] leading-[1.04] tracking-[-0.04em] text-ortaq-cream sm:text-[3.5rem] lg:text-[4.25rem]",
  editorial:
    "font-heading text-[1.75rem] leading-[1.12] tracking-[-0.025em] text-ortaq-ink sm:text-[2.375rem] lg:text-[2.75rem]",
  editorialLight:
    "font-heading text-[1.75rem] leading-[1.12] tracking-[-0.025em] text-ortaq-cream sm:text-[2.375rem] lg:text-[2.75rem]",
  h1: "font-heading text-[2rem] leading-[1.06] tracking-[-0.03em] text-ortaq-ink sm:text-[2.75rem] lg:text-[3rem]",
  h2: "font-heading text-[1.625rem] leading-[1.1] tracking-[-0.028em] text-ortaq-ink sm:text-[2.125rem]",
  h3: "font-heading text-[1.125rem] leading-[1.15] tracking-[-0.02em] text-ortaq-ink sm:text-[1.375rem]",
  lead: "text-[1.0625rem] leading-[1.72] text-ortaq-ink-muted sm:text-[1.25rem] sm:leading-[1.68]",
  leadLight: "text-[1.0625rem] leading-[1.72] text-ortaq-cream/85 sm:text-[1.25rem]",
  prose: "text-[1rem] leading-[1.82] text-ortaq-ink-muted sm:text-[1.0625rem] sm:leading-[1.78]",
  proseLight: "text-[1rem] leading-[1.82] text-ortaq-cream/78 sm:text-[1.0625rem]",
  body: "text-[0.9375rem] leading-[1.72] text-ortaq-ink-muted sm:text-base",
  bodySm: "text-[0.875rem] leading-[1.65] text-ortaq-ink-muted",
  kicker: "editorial-kicker",
  kickerLight: "editorial-kicker-light",
  caption: "figure-note",
  link: "text-ortaq-ink underline-offset-[3px] decoration-ortaq-border-strong hover:decoration-ortaq-ink transition-colors duration-200",
  linkLight:
    "text-ortaq-cream/90 underline-offset-[3px] decoration-white/30 hover:decoration-white/70 transition-colors duration-200",
} as const;

export function typ(classNames: keyof typeof typography, extra?: string) {
  return cn(typography[classNames], extra);
}
