import Link from "next/link";
import { FileText, AlertCircle, Handshake, Gift } from "lucide-react";
import type { PublicDossierDetail } from "@/types/dossier-detail";
import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { cn } from "@/lib/utils";

function DealSection({
  icon: Icon,
  title,
  children,
  accent,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-white p-5 md:p-6",
        accent
          ? "border-blue-200 bg-gradient-to-br from-blue-50/80 to-white shadow-ortaq-sm"
          : "border-ortaq-line shadow-ortaq-sm",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accent ? "bg-blue-600 text-white" : "bg-ortaq-surface-alt text-ortaq-navy"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="font-heading text-sm font-semibold text-ortaq-navy">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-ortaq-text-secondary md:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function SchemaGrid({ dossier }: { dossier: PublicDossierDetail }) {
  const rows = [
    { label: "Varlık", value: dossier.assetWhatExists },
    { label: "Eksik", value: dossier.missingPiece },
    {
      label: "Aranan ortak",
      value: dossier.desiredPartner,
      accent: true,
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-ortaq-line bg-ortaq-surface shadow-ortaq-md">
      <div className="border-b border-ortaq-line bg-ortaq-surface-alt px-5 py-3">
        <h2 className="font-heading text-sm font-semibold text-ortaq-navy">
          {ORTAQ_COPY.labels.dossierSummary}
        </h2>
      </div>
      <dl className="divide-y divide-ortaq-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "grid gap-1 px-5 py-4 md:grid-cols-[120px_1fr]",
              row.accent && "bg-blue-600/[0.05]"
            )}
          >
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ortaq-text-muted">
              {row.label}
            </dt>
            <dd
              className={cn(
                "text-base leading-snug",
                row.accent
                  ? "font-semibold text-blue-800"
                  : "text-ortaq-navy"
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

interface DossierStructuredSummaryProps {
  dossier: PublicDossierDetail;
}

export function DossierStructuredSummary({
  dossier,
}: DossierStructuredSummaryProps) {
  return (
    <div className="space-y-5">
      <SchemaGrid dossier={dossier} />

      <div className="grid gap-5 md:grid-cols-2">
        {dossier.longDescription && (
          <DealSection icon={FileText} title="Fırsat özeti">
            <p>{dossier.longDescription}</p>
          </DealSection>
        )}
        {dossier.whyNow && (
          <DealSection icon={AlertCircle} title="Neden şu an tıkandı?">
            <p>{dossier.whyNow}</p>
          </DealSection>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {dossier.idealContribution && (
          <DealSection icon={Handshake} title="Ortaktan beklenen katkı">
            <p>{dossier.idealContribution}</p>
          </DealSection>
        )}
        {dossier.partnerOffer && (
          <DealSection icon={Gift} title="Ortağa sunulan yapı / karşılık" accent>
            <p className="text-ortaq-navy">{dossier.partnerOffer}</p>
          </DealSection>
        )}
      </div>

      {typeof dossier.readinessScore === "number" && (
        <section className="flex flex-wrap items-center gap-5 rounded-xl border border-ortaq-line bg-ortaq-surface-alt/50 p-5 md:p-6">
          <ReadinessRing score={dossier.readinessScore} size={56} />
          <div>
            <h2 className="font-heading text-sm font-semibold text-ortaq-navy">
              Hazırlık skoru
            </h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-ortaq-text-secondary">
              Netlik göstergesi — otomatik onay değildir.{" "}
              <Link href="/guven-kalite" className="font-medium text-blue-600 hover:underline">
                {ORTAQ_COPY.labels.verification}
              </Link>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
