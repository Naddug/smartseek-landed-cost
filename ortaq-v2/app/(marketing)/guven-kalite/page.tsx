import { AppContainer } from "@/components/shared/AppContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ReadinessScoreExplainer } from "@/components/marketing/ReadinessScoreExplainer";
import { VisibilityExplainer } from "@/components/marketing/VisibilityExplainer";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { ShieldCheck, XCircle, Eye } from "lucide-react";

const rejectedExamples = [
  "Sadece fikir var ama somut varlık yok",
  "Ortak aradığı belirsiz veya tanımsız",
  "Hiçbir kanıt veya yapı sunulmuyor",
  "Aslında iş ilanı, gayrimenkul ilanı veya franchise başvurusu",
];

export default function GuvenKalitePage() {
  return (
    <>
      <Section variant="surface">
        <AppContainer size="narrow">
          <PageHeader
            eyebrow="Güven"
            title="Güven & Kalite"
            description="ORTAQ duvar ilanı panosu değil. Her iki taraf da burada ciddi ve yapılandırılmış bir ortamda buluşur."
          />
        </AppContainer>
      </Section>

      <Section>
        <AppContainer size="narrow">
          <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-6 md:p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-ortaq-action/10">
              <ShieldCheck className="h-5 w-5 text-ortaq-action" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-ortaq-navy">
              Neden inceleme var?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ortaq-text-muted md:text-base">
              Platforma giren her fırsat dosyası, yayına alınmadan önce incelenir.
              Amaç kaliteyi korumak: belirsiz başvuruları elemek, gerçek varlığı
              olan fırsatları öne çıkarmak ve her iki tarafa da güven vermek.
              Moderasyon baskı aracı değil; dosyanın netleşmesine yardımcı olan
              bir filtre.
            </p>
          </div>
        </AppContainer>
      </Section>

      <Section variant="alt">
        <AppContainer size="narrow">
          <SectionHeader title="Hangi fırsatlar yayınlanmaz?" />
          <ul className="space-y-3">
            {rejectedExamples.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-ortaq-line bg-ortaq-surface px-4 py-3"
              >
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-danger" />
                <span className="text-sm leading-relaxed text-ortaq-text-muted">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </AppContainer>
      </Section>

      <Section>
        <AppContainer>
          <SectionHeader
            title="Hazırlık skoru nasıl çalışır?"
            description="Skor, dosyanın ne kadar net ve eşleşmeye hazır olduğunu gösteren bir göstergedir — otomatik onay değildir."
          />
          <ReadinessScoreExplainer />
        </AppContainer>
      </Section>

      <Section variant="alt">
        <AppContainer size="narrow">
          <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-ortaq-action/10">
            <Eye className="h-5 w-5 text-ortaq-action" />
          </div>
          <SectionHeader title="Gizlilik nasıl korunur?" />
          <p className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-ortaq-text-muted md:text-base">
            Fırsat dosyası sahibi, hangi bilgilerin ne zaman görüneceğini
            kontrol eder. Bazı belgeler yalnızca eşleşme sonrası açılır;
            ORTAQ gerektiğinde kullanıcıyı anonim tutabilir.
          </p>
          <VisibilityExplainer />
        </AppContainer>
      </Section>

      <Section id="premium">
        <AppContainer>
          <SectionHeader
            title="Premium katmanlar"
            description="ORTAQ, dosya hazırlığından doğrulanmış ortak erişimine kadar net ticari katmanlar sunar. Ödeme entegrasyonu tamamlanana kadar talepler manuel yönetilir."
          />
          <MonetizationTiers showCtas />
        </AppContainer>
      </Section>
    </>
  );
}
