import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  narrow?: boolean;
  wide?: boolean;
};

export function Container({ className, narrow, wide, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow && "max-w-[42rem]",
        wide && "max-w-6xl",
        !narrow && !wide && "max-w-6xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: "default" | "alt" | "warm" | "dark";
  spacing?: "breath" | "default" | "compact" | "quiet" | "hero" | "stage";
};

const toneClasses = {
  default: "bg-ortaq-bg",
  alt: "bg-ortaq-bg-alt",
  warm: "bg-ortaq-bg-warm",
  dark: "bg-ortaq-dark text-ortaq-cream",
};

/**
 * Section spacing scale.
 *
 * Tight enterprise rhythm. The historical `breath / stage / hero / quiet`
 * variants are retained as aliases so legacy pages keep compiling, but
 * every variant now maps to the same enterprise rhythm rather than the
 * old py-14/py-16/py-20 cinematic spacing.
 *
 * Operational pages (homepage, dossier) bypass this entirely and use
 * inline `.product-section` rhythm or per-section py-5/py-6.
 */
const spacingClasses = {
  default: "py-6 sm:py-8",
  compact: "py-5 sm:py-7",
  quiet: "py-5 sm:py-7",
  hero: "py-6 sm:py-8",
  stage: "py-6 sm:py-8",
  breath: "py-6 sm:py-8",
};

export function Section({
  className,
  tone = "default",
  spacing = "default",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(toneClasses[tone], spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  titleAs?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  titleAs = "h2",
  className,
}: SectionHeaderProps) {
  const TitleTag = titleAs;

  return (
    <header
      className={cn(
        "mb-5 sm:mb-6",
        align === "center" && "mx-auto max-w-xl text-center",
        className,
      )}
    >
      {label && <p className={cn(typography.label, "mb-1.5")}>{label}</p>}
      <TitleTag className={titleAs === "h1" ? typography.h1 : typography.h2}>{title}</TitleTag>
      {description && <p className={cn(typography.body, "mt-2 max-w-prose")}>{description}</p>}
    </header>
  );
}
