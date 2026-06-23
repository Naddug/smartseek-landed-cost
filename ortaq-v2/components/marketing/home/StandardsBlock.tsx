import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { Button } from "@/components/ui/button";

const publishCriteria = [
  {
    label: "Yapılandırılmış dosya",
    detail: "Varlık, eksik parça ve aranan ortak — üç satır ayrı ve net.",
    tag: "Zorunlu",
  },
  {
    label: "Somut varlık",
    detail: "Lokasyon, ekip, ürün, altyapı veya müşteri tabanından en az biri mevcut.",
    tag: "Zorunlu",
  },
  {
    label: "Net ortak ihtiyacı",
    detail: ORTAQ_COPY.standards.partnerNeedRejected,
    tag: "Zorunlu",
  },
  {
    label: ORTAQ_COPY.standards.reviewCriterion,
    detail: ORTAQ_COPY.standards.reviewCriterionDetail,
    tag: "Her dosya",
  },
];

const rejectedPatterns = [
  "Sadece fikir — sıfır varlık",
  "Aranan ortak türü tanımsız",
  "İş ilanı veya emlak listelemesi",
  "Yatırım / fon talebi formatı",
];

export function StandardsBlock() {
  return (
    <section className="section-editorial py-20 md:py-24">
      <AppContainer>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 border-b border-ortaq-line-strong pb-6">
            <p className="type-eyebrow">{ORTAQ_COPY.sections.standards} · ORTAQ-STD-01</p>
            <h2 className="type-section mt-2 text-balance">
              Her dosya yayına girmez.
            </h2>
            <p className="mt-3 text-sm text-ortaq-text-secondary">
              Seçici yayın. Belirsiz dosyalar elenir; varlığı net olanlar arşive girer.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-editorial overflow-hidden">
              <div className="border-b border-ortaq-line bg-ortaq-surface-alt px-5 py-3">
                <p className="type-meta text-ortaq-navy">{ORTAQ_COPY.labels.publishCriteria}</p>
              </div>
              <ul className="divide-y divide-ortaq-line">
                {publishCriteria.map((item) => (
                  <li key={item.label} className="px-5 py-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-ortaq-navy">{item.label}</p>
                      <span className="type-meta text-ortaq-text-muted">{item.tag}</span>
                    </div>
                    <p className="mt-1 text-sm text-ortaq-text-secondary">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-red-200/90 bg-ortaq-surface shadow-ortaq-sm">
              <div className="border-b border-red-100 bg-red-50 px-5 py-3">
                <p className="type-meta text-red-800">Yayınlanmaz</p>
              </div>
              <ul className="divide-y divide-ortaq-line px-5 py-2">
                {rejectedPatterns.map((item) => (
                  <li key={item} className="py-3 text-sm text-ortaq-text-secondary">
                    <span className="mr-2 font-medium text-ortaq-danger">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-ortaq-line px-5 py-4">
                <Link href="/guven-kalite">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    ORTAQ standardının tamamı
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
