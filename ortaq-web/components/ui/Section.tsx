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

const spacingClasses = {
  breath: "py-14 sm:py-16 lg:py-20",
  stage: "py-12 sm:py-16 lg:py-20",
  default: "py-10 sm:py-12",
  compact: "py-8 sm:py-10",
  quiet: "py-8 sm:py-10",
  hero: "pt-8 pb-6 sm:pt-10 sm:pb-8",
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
