import Link from "next/link";
import { MapPin, Eye } from "lucide-react";
import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  labelFor,
  CATEGORY_OPTIONS,
  STAGE_OPTIONS,
  ASSET_OPTIONS,
  BLOCKER_OPTIONS,
  PARTNER_TYPE_OPTIONS,
  TIME_COMMITMENT_OPTIONS,
  CONTRIBUTION_OPTIONS,
  RETURN_MODEL_OPTIONS,
  VISIBILITY_OPTIONS,
  EVIDENCE_TAGS,
} from "@/data/onboarding/owner-options";
import type { OpportunityDossier } from "@/types/opportunity-dossier";

function DossierSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ortaq-line bg-ortaq-surface p-5 md:p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ortaq-text-muted">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-ortaq-text-muted">Belirtilmedi</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-ortaq-line bg-ortaq-surface-alt px-3 py-1 text-sm text-ortaq-navy"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

interface DossierDetailViewProps {
  dossier: OpportunityDossier;
}

export function DossierDetailView({ dossier }: DossierDetailViewProps) {
  const location =
    dossier.hideDistrict || !dossier.locationDistrict
      ? dossier.locationCity
      : `${dossier.locationCity}, ${dossier.locationDistrict}`;

  const assetLabels = dossier.selectedAssets.map((a) =>
    labelFor(ASSET_OPTIONS, a)
  );
  const blockerLabels = dossier.selectedBlockers.map((b) =>
    labelFor(BLOCKER_OPTIONS, b)
  );
  const partnerLabels = dossier.partnerPriorities.map(
    (p, i) => `${i + 1}. ${labelFor(PARTNER_TYPE_OPTIONS, p)}`
  );
  const contributionLabels = dossier.expectedContributions.map((c) =>
    labelFor(CONTRIBUTION_OPTIONS, c)
  );

  return (
    <div className="space-y-6">
      <header>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusBadge
            label={labelFor(CATEGORY_OPTIONS, dossier.category)}
            className="bg-ortaq-action/10 text-ortaq-action"
          />
          <StatusBadge label={labelFor(STAGE_OPTIONS, dossier.stage)} />
          <StatusBadge
            label={labelFor(VISIBILITY_OPTIONS, dossier.visibilityLevel)}
            variant="default"
          />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-ortaq-navy md:text-3xl">
          {dossier.title}
        </h1>
        {dossier.summary && (
          <p className="mt-2 text-base leading-relaxed text-ortaq-text-muted">
            {dossier.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-ortaq-text-muted">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-ortaq-text-muted">
            <Eye className="h-4 w-4" />
            {labelFor(VISIBILITY_OPTIONS, dossier.visibilityLevel)}
          </span>
          <ReadinessRing score={dossier.readinessScore} size={40} />
        </div>
      </header>

      <DossierSection title="Elinizde Olanlar">
        <TagList items={assetLabels} />
      </DossierSection>

      <DossierSection title="Nerede Takıldı">
        <TagList items={blockerLabels} />
      </DossierSection>

      <DossierSection title="Aradığınız Ortak">
        <TagList items={partnerLabels} />
      </DossierSection>

      <DossierSection title="Ortaktan Beklentiniz">
        <p className="mb-2 text-sm text-ortaq-navy">
          <span className="text-ortaq-text-muted">Zaman: </span>
          {dossier.expectedTimeCommitment
            ? labelFor(TIME_COMMITMENT_OPTIONS, dossier.expectedTimeCommitment)
            : "—"}
        </p>
        <TagList items={contributionLabels} />
      </DossierSection>

      <DossierSection title="Sunduğunuz Karşılık">
        <p className="text-sm font-medium text-ortaq-navy">
          {labelFor(RETURN_MODEL_OPTIONS, dossier.returnModel)}
        </p>
        {dossier.returnModelNotes && (
          <p className="mt-1 text-sm text-ortaq-text-muted">
            {dossier.returnModelNotes}
          </p>
        )}
      </DossierSection>

      <DossierSection title="Kanıtlar">
        {dossier.evidenceFiles.length === 0 ? (
          <p className="text-sm text-ortaq-text-muted">Henüz kanıt eklenmedi</p>
        ) : (
          <ul className="space-y-2">
            {dossier.evidenceFiles.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-ortaq-line px-3 py-2 text-sm"
              >
                <span className="font-medium text-ortaq-navy">{file.name}</span>
                <span className="text-xs text-ortaq-text-muted">
                  {labelFor(EVIDENCE_TAGS, file.tag)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </DossierSection>

      {dossier.narrative && (
        <DossierSection title="Ek Notunuz">
          <p className="text-sm leading-relaxed text-ortaq-text-muted">
            {dossier.narrative}
          </p>
        </DossierSection>
      )}

      <p className="text-xs text-ortaq-text-muted">
        Oluşturulma: {new Date(dossier.createdAt).toLocaleDateString("tr-TR")} ·
        Son güncelleme: {new Date(dossier.updatedAt).toLocaleDateString("tr-TR")}
      </p>
    </div>
  );
}

export function DossierDetailSidebar({
  dossier,
  checklist,
}: {
  dossier: OpportunityDossier;
  checklist: { id: string; label: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="sticky top-24 rounded-xl border border-ortaq-line bg-ortaq-surface p-5">
        <div className="flex items-center justify-between">
          <StatusBadge label="Taslak" variant="draft" />
          <ReadinessRing score={dossier.readinessScore} size={48} />
        </div>
        <div className="mt-4 rounded-lg bg-ortaq-surface-alt p-4">
          <p className="text-sm font-medium text-ortaq-navy">
            Bu dosya henüz yayında değil.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ortaq-text-muted">
            Yayına hazır hale getirmek için eksik alanları tamamlayın.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/onboarding/firsat-sahibi?edit=${dossier.id}`}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-ortaq-action px-4 text-sm font-medium text-white hover:bg-ortaq-action/90"
          >
            Dosyayı Düzenle
          </Link>
          <Link
            href="/firsatlar"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-ortaq-line bg-ortaq-surface px-4 text-sm font-medium text-ortaq-navy hover:bg-ortaq-surface-alt"
          >
            Herkese Açık Önizleme
          </Link>
          <Link
            href="/onboarding/ortak"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-ortaq-line bg-ortaq-surface px-4 text-sm font-medium text-ortaq-navy hover:bg-ortaq-surface-alt"
          >
            Ortak Profilini Tamamla
          </Link>
        </div>
      </div>

      {checklist.length > 0 && (
        <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-5">
          <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
            Skoru güçlendirin
          </h3>
          <ul className="mt-3 space-y-2">
            {checklist.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-xs text-ortaq-text-muted"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-warning" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
