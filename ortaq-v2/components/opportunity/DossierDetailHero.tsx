import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { DossierVisualCover } from "@/components/opportunity/DossierVisualCover";
import {
  detailStatusLabel,
  detailStatusVariant,
} from "@/lib/dossier/detail-status";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import type { PublicDossierDetail } from "@/types/dossier-detail";

interface DossierDetailHeroProps {
  dossier: PublicDossierDetail;
  showStatus?: boolean;
}

export function DossierDetailHero({
  dossier,
  showStatus = true,
}: DossierDetailHeroProps) {
  const updated = new Date(dossier.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="overflow-hidden rounded-2xl border border-ortaq-line bg-ortaq-surface shadow-ortaq-lg">
      <DossierVisualCover
        slug={dossier.slug}
        categoryKey={dossier.categoryKey}
        refCode={dossier.refCode}
        atmosphere={dossier.category}
        size="banner"
        priority
        overlay="editorial"
        className="!aspect-[21/8] min-h-[180px] md:min-h-[240px]"
      />

      <div className="border-t border-ortaq-line p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            label={dossier.category}
            className="bg-ortaq-surface-alt text-ortaq-navy"
          />
          <StatusBadge label={dossier.stage} variant="default" />
          {showStatus && dossier.status !== "published" && (
            <StatusBadge
              label={detailStatusLabel(dossier.status)}
              variant={detailStatusVariant(dossier.status)}
            />
          )}
          {dossier.isCurated && (
            <StatusBadge
              label={ORTAQ_COPY.badges.featured}
              className="border border-amber-200 bg-amber-50 text-amber-900"
            />
          )}
          {dossier.verification?.dossierReviewed && (
            <StatusBadge
              label="ORTAQ incelemeli"
              className="border border-emerald-200 bg-emerald-50 text-emerald-800"
            />
          )}
        </div>

        <h1 className="type-section mt-4 max-w-3xl text-ortaq-navy">
          {dossier.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ortaq-text-secondary">
          {dossier.summary}
        </p>

        {/* Deal room stats bar */}
        <div className="mt-6 grid gap-4 border-t border-ortaq-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-text-muted" />
            <div>
              <p className="type-meta text-ortaq-text-muted">Konum</p>
              <p className="text-sm font-medium text-ortaq-navy">{dossier.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-text-muted" />
            <div>
              <p className="type-meta text-ortaq-text-muted">ORTAQ incelemesi</p>
              <p className="text-sm font-medium text-ortaq-navy">
                {dossier.verification?.dossierReviewed ? "Tamamlandı" : "Devam ediyor"}
              </p>
            </div>
          </div>
          {typeof dossier.readinessScore === "number" && (
            <div className="flex items-center gap-3">
              <ReadinessRing score={dossier.readinessScore} size={44} />
              <div>
                <p className="type-meta text-ortaq-text-muted">Hazırlık</p>
                <p className="text-sm font-medium text-ortaq-navy">
                  %{dossier.readinessScore}
                </p>
              </div>
            </div>
          )}
          <div>
            <p className="type-meta text-ortaq-text-muted">{ORTAQ_COPY.labels.lastUpdate}</p>
            <p className="text-sm font-medium text-ortaq-navy">{updated}</p>
          </div>
        </div>

        {/* Partner emphasis — above fold */}
        <div className="mt-6 rounded-xl border-2 border-blue-600/20 bg-gradient-to-r from-blue-600/[0.08] to-transparent p-4 md:p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
            Aranan ortak
          </p>
          <p className="mt-1 font-heading text-xl font-semibold text-blue-900 md:text-2xl">
            {dossier.desiredPartner}
          </p>
          {dossier.partnerOffer && (
            <p className="mt-2 text-sm text-ortaq-text-secondary">
              <span className="font-medium text-ortaq-navy">Karşılık: </span>
              {dossier.partnerOffer}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

export function DossierDetailBackLink() {
  return (
    <Link
      href="/firsatlar"
      className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ortaq-text-secondary hover:text-ortaq-navy"
    >
      ← Fırsat arşivine dön
    </Link>
  );
}
