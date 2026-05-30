import { cn } from "@ortaq/lib/cn";
import { typography } from "@ortaq/design/typography";
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
        narrow && "max-w-2xl",
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
  tone?: "default" | "alt" | "warm";
  spacing?: "breath" | "default" | "compact" | "quiet" | "hero";
};

const toneClasses = {
  default: "bg-ortaq-bg",
  alt: "bg-ortaq-bg-alt",
  warm: "bg-ortaq-bg-warm",
};

const spacingClasses = {
  breath: "py-16 sm:py-20 lg:py-24",
  default: "py-14 sm:py-16 lg:py-20",
  compact: "py-10 sm:py-12",
  quiet: "py-12 sm:py-14",
  hero: "pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-16 lg:pb-12",
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
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 sm:mb-10",
        align === "center" && "mx-auto max-w-xl text-center",
        className,
      )}
    >
      {label && <p className={cn(typography.kicker, "mb-3")}>{label}</p>}
      <h2 className={typography.h2}>{title}</h2>
      {description && <p className={cn(typography.lead, "mt-4 max-w-prose")}>{description}</p>}
    </header>
  );
}
