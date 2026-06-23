import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { Button } from "@/components/ui/button";

const publishCriteria = [
  {
    label: "Yapılandırılmış dosya",
    detail: "Varlık, eksik parça ve aranan ortak türü ayrı ayrı tanımlı.",
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
  "Ortak ihtiyacı tanımsız",
  "İş ilanı veya emlak listelemesi",
  "Yatırım / fon talebi formatı",
];

export function StandardsBlock() {
  return (
    <section className="border-b border-stone-200 bg-[#F3F5F9] py-20 md:py-24">
      <AppContainer>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 border-b border-stone-300 pb-6">
            <p className="type-eyebrow">{ORTAQ_COPY.sections.standards} · ORTAQ-STD-01</p>
            <h2 className="type-section mt-2 text-balance">
              Her dosya yayına girmez.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-5 py-3">
                <p className="type-meta text-stone-900">{ORTAQ_COPY.labels.publishCriteria}</p>
              </div>
              <ul className="divide-y divide-stone-100">
                {publishCriteria.map((item) => (
                  <li key={item.label} className="px-5 py-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-stone-950">{item.label}</p>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-600">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-red-200/80 bg-white">
              <div className="border-b border-red-100 bg-red-50/80 px-5 py-3">
                <p className="type-meta text-red-800">Yayınlanmaz</p>
              </div>
              <ul className="divide-y divide-stone-100 px-5 py-2">
                {rejectedPatterns.map((item) => (
                  <li key={item} className="py-3 text-sm text-stone-600">
                    <span className="mr-2 text-red-500">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-stone-100 px-5 py-4">
                <Link href="/guven-kalite">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Tam standart metni
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
