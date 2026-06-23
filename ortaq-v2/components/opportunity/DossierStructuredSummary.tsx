import Link from "next/link";
import type { PublicDossierDetail } from "@/types/dossier-detail";
import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

function CoreRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="grid gap-1 border-b border-stone-200 py-4 last:border-b-0 md:grid-cols-[140px_1fr] md:gap-6">
      <dt className="font-mono text-[10px] font-medium uppercase tracking-widest text-stone-400">
        {label}
      </dt>
      <dd
        className={
          accent
            ? "text-base font-medium text-blue-600"
            : "text-base text-stone-800"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function SupportingBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 md:p-6">
      <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-stone-400">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">
        {children}
      </div>
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
    <div className="space-y-6">
      <section className="rounded-lg border border-stone-300 bg-stone-50/80 px-5 py-2 md:px-6">
        <h2 className="sr-only">Dosya özeti</h2>
        <dl>
          <CoreRow label="Varlık" value={dossier.assetWhatExists} />
          <CoreRow label="Eksik" value={dossier.missingPiece} />
          <CoreRow
            label="Aranan ortak"
            value={dossier.desiredPartner}
            accent
          />
        </dl>
      </section>

      {dossier.longDescription && (
        <SupportingBlock title="Fırsat özeti">
          <p>{dossier.longDescription}</p>
        </SupportingBlock>
      )}

      {dossier.whyNow && (
        <SupportingBlock title="Neden şu an tıkandı?">
          <p>{dossier.whyNow}</p>
        </SupportingBlock>
      )}

      {dossier.idealContribution && (
        <SupportingBlock title="Ortaktan beklenen katkı">
          <p>{dossier.idealContribution}</p>
        </SupportingBlock>
      )}

      {dossier.partnerOffer && (
        <SupportingBlock title="Ortağa sunulan yapı / karşılık">
          <p>{dossier.partnerOffer}</p>
        </SupportingBlock>
      )}

      {typeof dossier.readinessScore === "number" && (
        <section className="rounded-lg border border-stone-200 bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <ReadinessRing score={dossier.readinessScore} size={52} />
            <div>
              <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-stone-400">
                Hazırlık skoru
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-700">
                Skor, dosyanın ne kadar net ve eşleşmeye hazır olduğunu gösterir —
                otomatik onay değildir. Detaylı açıklama{" "}
                <Link href="/guven-kalite" className="font-medium text-blue-600 hover:underline">
                  {ORTAQ_COPY.labels.verification}
                </Link>{" "}
                sayfasında.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
