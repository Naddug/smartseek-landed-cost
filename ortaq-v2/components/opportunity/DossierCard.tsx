import Link from "next/link";
import { cn } from "@/lib/utils";
import type { OpportunityDraft } from "@/types";
import type { MarketingDossier } from "@/types/marketing-dossier";
import type { DossierTier } from "@/types/archive";
import { DossierFilePanel } from "./DossierFilePanel";
import { DossierMarketCard } from "./DossierMarketCard";

interface DossierCardProps {
  opportunity?: OpportunityDraft;
  dossier?: MarketingDossier;
  href?: string;
  className?: string;
  variant?: "dossier" | "panel";
  emphasis?: DossierTier;
  layout?: "card" | "compact";
}

export function DossierCard({
  opportunity,
  dossier,
  href,
  className,
  variant = "dossier",
  emphasis,
  layout = "card",
}: DossierCardProps) {
  if (dossier) {
    return (
      <DossierMarketCard
        dossier={dossier}
        href={href}
        className={className}
        emphasis={emphasis}
        layout={layout}
      />
    );
  }

  const content = opportunity ? (
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
          className="card-editorial-hover"
        />
      </div>
    ) : (
      <article className={cn("card-editorial p-5", className)}>
        <DossierFilePanel opportunity={opportunity} theme="light" size="sm" />
      </article>
    )
  ) : null;

  if (!content) return null;
  if (href) return <Link href={href}>{content}</Link>;
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
