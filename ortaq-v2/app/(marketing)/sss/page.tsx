import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const faqs = [
  {
    q: "ORTAQ bir yatırım platformu mu?",
    a: "Hayır. ORTAQ, zemini hazır fırsatları aranan ortak türüyle buluşturan bir ortamdır. Fon talebi veya crowdfunding formatı yayınlanmaz.",
  },
  {
    q: "Fırsat dosyası nedir?",
    a: "Neyin hazır olduğu, neden tıkandığı ve hangi ortağın arandığı — açıkça yazılır. Dosya ORTAQ incelemesinden geçer; uygunsa yayına alınır.",
  },
  {
    q: "Dosyam ne zaman yayına girer?",
    a: "Taslak tamamlanıp incelemeye gönderildikten sonra ORTAQ dosyanın zemini, netliği ve eşleşme uygunluğunu kontrol eder. Uygun dosyalar yayına girer; eksik varsa geri bildirimle toparlanır.",
  },
  {
    q: "Ortak olarak nasıl başvururum?",
    a: "Yayındaki fırsatları inceleyin, ortak profilinizi tamamlayın ve size uygun dosyalara başvurun. Başvurunuzda profilinizdeki katkı bilgileri dosya sahibine iletilir.",
  },
  {
    q: "Hangi bilgiler herkese açık?",
    a: "Gizlilik seviyesini dosya sahibi belirler. Bazı detaylar yalnızca eşleşme sonrası açılır. Tam açıklama Güven & Kalite sayfasında.",
  },
  {
    q: "ORTAQ Premium nedir?",
    a: "Fırsat sahipleri fırsatlarını daha güçlü sunmak, eksik noktaları toparlamak ve yayına daha ciddi hazırlanmak için destek alabilir. Ortaklar profillerini güçlendirerek daha ciddi başvuru sinyali verebilir. Zamanlamanın kritik olduğu durumlarda hızlandırılmış değerlendirme seçenekleri de vardır. Detaylar Güven & Kalite sayfasında.",
  },
];

export default function SssPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          eyebrow="SSS"
          title="Sık Sorulan Sorular"
          description={ORTAQ_COPY.pages.sss.description}
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
            <Link
              href="/guven-kalite?paket=owner#premium-detail"
              className="font-medium text-blue-600 hover:underline"
            >
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
