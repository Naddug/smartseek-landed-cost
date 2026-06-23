import Link from "next/link";
import { cn } from "@/lib/utils";
import type { OpportunityDraft } from "@/types";
import { DossierFilePanel } from "./DossierFilePanel";

interface DossierCardProps {
  opportunity: OpportunityDraft;
  href?: string;
  className?: string;
  variant?: "dossier" | "panel";
}

export function DossierCard({
  opportunity,
  href,
  className,
  variant = "dossier",
}: DossierCardProps) {
  const content =
    variant === "dossier" ? (
      <div
        className={cn(
          "group transition-transform duration-200 hover:-translate-y-0.5",
          href && "cursor-pointer",
          className
        )}
      >
        <DossierFilePanel
          opportunity={opportunity}
          theme="light"
          size="sm"
          showFooter
          className="group-hover:border-ortaq-navy/25 group-hover:shadow-md"
        />
      </div>
    ) : (
      <article className={cn("rounded-lg border border-ortaq-line bg-ortaq-surface p-5", className)}>
        <DossierFilePanel opportunity={opportunity} theme="light" size="sm" />
      </article>
    );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

/** @deprecated Use DossierCard */
export function OpportunityCard(
  props: Omit<DossierCardProps, "variant"> & {
    variant?: "default" | "public" | "dossier" | "panel";
  }
) {
  const { variant, ...rest } = props;
  const mapped: DossierCardProps["variant"] =
    variant === "default" || variant === "panel" ? "panel" : "dossier";
  return <DossierCard {...rest} variant={mapped} />;
}
