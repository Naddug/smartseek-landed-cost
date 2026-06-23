import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const faqs = [
  {
    q: "ORTAQ bir yatırım platformu mu?",
    a: "Hayır. ORTAQ, varlığı olan fırsatları doğru ortak türüyle eşleştiren bir fırsat dosyası platformudur. Fon talebi veya crowdfunding formatındaki başvurular yayınlanmaz.",
  },
  {
    q: "Fırsat dosyası nedir?",
    a: "Varlık, eksik parça ve aranan ortak türünün ayrı ayrı tanımlandığı yapılandırılmış bir kayıttır. Her dosya inceleme sonrası yayına alınır veya geri bildirimle döner.",
  },
  {
    q: "Dosyam ne zaman yayına girer?",
    a: "Taslak dosyanızı tamamlayıp incelemeye gönderdikten sonra ORTAQ ekibi tutarlılık ve eşleşme uygunluğunu kontrol eder. Uygun bulunan dosyalar yayına alınır.",
  },
  {
    q: "Ortak olarak nasıl başvururum?",
    a: "Yayında olan dosyaları inceleyin, profilinizi tamamlayın ve uygun gördüğünüz fırsatlara başvuru oluşturun. Başvurular dosya sahibine iletilir.",
  },
  {
    q: "Hangi bilgiler herkese açık?",
    a: "Dosya sahibi gizlilik seviyesini belirler. Bazı detaylar yalnızca eşleşme sonrası açılır. Tam standart metni Güven & Kalite sayfasında bulabilirsiniz.",
  },
];

export default function SssPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          eyebrow="SSS"
          title="Sık Sorulan Sorular"
          description="Fırsat dosyası, inceleme süreci ve eşleşme hakkında sık sorulan sorular."
        >
          <dl className="mt-8 divide-y divide-stone-200">
            {faqs.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="font-heading text-base font-semibold text-stone-950">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-stone-600">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-stone-600">
            Daha fazla bilgi için{" "}
            <Link href="/guven-kalite" className="font-medium text-blue-600 hover:underline">
              {ORTAQ_COPY.sections.standards}
            </Link>{" "}
            ve{" "}
            <Link href="/nasil-calisir" className="font-medium text-blue-600 hover:underline">
              Nasıl Çalışır
            </Link>{" "}
            sayfalarına bakın.
          </p>
        </PageShell>
      </AppContainer>
    </Section>
  );
}
