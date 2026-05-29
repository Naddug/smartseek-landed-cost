import type { ReactNode } from "react";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type LandingSectionProps = {
  id?: string;
  ariaLabel: string;
  label: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
  surface?: "default" | "alt" | "surface";
};

const surfaceClass = {
  default: "bg-ortaq-bg border-ortaq-border",
  alt: "bg-ortaq-bg-alt border-ortaq-border",
  surface: "bg-ortaq-surface border-ortaq-border",
} as const;

export function LandingSection({
  id,
  ariaLabel,
  label,
  title,
  lead,
  children,
  className,
  surface = "default",
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn("border-b scroll-mt-20", surfaceClass[surface], className)}
      aria-label={ariaLabel}
    >
      <Container wide className="py-10 sm:py-12 lg:py-14">
        <header className="landing-fade-in max-w-3xl">
          <p className={typography.label}>{label}</p>
          <h2 className={cn(typography.h1, "mt-2 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.875rem]")}>{title}</h2>
          {lead && <p className={cn(typography.body, "mt-3 max-w-2xl")}>{lead}</p>}
        </header>
        <div className="landing-fade-in-delayed mt-8 sm:mt-10">{children}</div>
      </Container>
    </section>
  );
}
