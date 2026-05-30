import { cn } from "../lib/cn";

export const typography = {
  h1: "font-heading text-[2rem] leading-[1.08] text-ortaq-ink sm:text-[2.75rem] lg:text-[3rem]",
  h2: "font-heading text-[1.625rem] leading-[1.12] text-ortaq-ink sm:text-[2rem] lg:text-[2.25rem]",
  h3: "font-heading text-lg leading-snug text-ortaq-ink sm:text-xl",
  lead: "text-base leading-[1.65] text-ortaq-ink-muted sm:text-lg sm:leading-[1.6]",
  body: "text-[0.9375rem] leading-[1.65] text-ortaq-ink-muted sm:text-base",
  bodySm: "text-sm leading-[1.65] text-ortaq-ink-muted",
  kicker: "editorial-kicker",
  caption: "figure-note",
  link: "text-ortaq-ink underline-offset-[3px] decoration-ortaq-border-strong hover:decoration-ortaq-ink transition-colors",
} as const;

export function typ(classNames: keyof typeof typography, extra?: string) {
  return cn(typography[classNames], extra);
}
