import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const faqs = [
  {
    q: "ORTAQ bir yatırım platformu mu?",
    a: "Hayır. ORTAQ, varlığı olan fırsatları aranan ortak türüyle eşleştiren bir dosya arşividir. Fon talebi veya crowdfunding formatı yayınlanmaz.",
  },
  {
    q: "Fırsat dosyası nedir?",
    a: "Varlık, eksik parça ve aranan ortak — üç satır ayrı yazılır. ORTAQ incelemesi sonrası yayına alınır veya revizyon istenir.",
  },
  {
    q: "Dosyam ne zaman yayına girer?",
    a: "Taslak tamamlanıp incelemeye gönderildikten sonra ORTAQ tutarlılık ve eşleşme uygunluğunu kontrol eder. Uygun dosyalar arşive girer.",
  },
  {
    q: "Ortak olarak nasıl başvururum?",
    a: "Yayındaki dosyaları inceleyin, profilinizi tamamlayın, uygun dosyalara başvurun. Başvuru dosya sahibine iletilir.",
  },
  {
    q: "Hangi bilgiler herkese açık?",
    a: "Gizlilik seviyesini dosya sahibi belirler. Bazı detaylar yalnızca eşleşme sonrası açılır. Tam metin Güven & Kalite sayfasında.",
  },
  {
    q: "ORTAQ Premium veya doğrulanmış ortak nedir?",
    a: "Fırsat sahipleri yapılandırılmış yazım ve hızlandırılmış ORTAQ incelemesi alabilir. Ortaklar ORTAQ doğrulaması ile öncelikli başvuru katmanına geçer. Detaylar Güven & Kalite sayfasında.",
  },
];

export default function SssPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          eyebrow="SSS"
          title="Sık Sorulan Sorular"
          description="Dosya, ORTAQ incelemesi ve eşleşme süreci."
        >
          <dl className="mt-8 divide-y divide-ortaq-line">
            {faqs.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="font-heading text-base font-semibold text-ortaq-navy">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ortaq-text-secondary">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-ortaq-text-secondary">
            Daha fazla bilgi:{" "}
            <Link href="/guven-kalite" className="font-medium text-blue-600 hover:underline">
              {ORTAQ_COPY.sections.standards}
            </Link>{" "}
            ·{" "}
            <Link href="/nasil-calisir" className="font-medium text-blue-600 hover:underline">
              Nasıl Çalışır
            </Link>
          </p>
        </PageShell>
      </AppContainer>
    </Section>
  );
}
