import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OpportunityDraft } from "@/types";
import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OpportunityMetaRow } from "@/components/opportunity/OpportunityMetaRow";

const statusLabels: Record<OpportunityDraft["readinessStatus"], string> = {
  draft: "Taslak",
  incomplete: "Eksik",
  review_pending: "İncelemede",
  published: "Yayında",
  paused: "Duraklatıldı",
};

interface OpportunityCardProps {
  opportunity: OpportunityDraft;
  href?: string;
  className?: string;
  variant?: "default" | "public";
}

export function OpportunityCard({
  opportunity,
  href,
  className,
  variant = "default",
}: OpportunityCardProps) {
  const content = (
    <article
      className={cn(
        "group flex flex-col rounded-xl border border-ortaq-line bg-ortaq-surface p-5 transition-shadow hover:shadow-sm",
        href && "cursor-pointer",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-ortaq-action/10 px-2.5 py-0.5 text-xs font-medium text-ortaq-action">
            {opportunity.categoryLabel}
          </span>
          <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-ortaq-navy group-hover:text-ortaq-action">
            {opportunity.title}
          </h3>
        </div>
        <ReadinessRing score={opportunity.readinessScore} size={44} />
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ortaq-text-muted">
        {opportunity.summary}
      </p>

      <OpportunityMetaRow
        items={[
          { icon: <MapPin className="h-3.5 w-3.5" />, label: opportunity.location },
        ]}
      />

      {variant === "public" ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-ortaq-line pt-4">
          <StatusBadge
            label={opportunity.primaryBlockerLabel}
            variant="warning"
          />
          <StatusBadge
            label={opportunity.neededPartnerLabel}
            variant="default"
            className="bg-ortaq-action/10 text-ortaq-action"
          />
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between border-t border-ortaq-line pt-4">
          <StatusBadge
            label={statusLabels[opportunity.readinessStatus]}
            variant={opportunity.readinessStatus}
          />
          <span className="text-xs text-ortaq-text-muted">
            Güncelleme: {opportunity.updatedAt}
          </span>
        </div>
      )}
    </article>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
