import { AppContainer } from "@/components/shared/AppContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { FlowSteps } from "@/components/marketing/FlowSteps";
import { VisibilityExplainer } from "@/components/marketing/VisibilityExplainer";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import {
  ClipboardList,
  AlertCircle,
  FileCheck,
  Handshake,
  UserCircle,
  Target,
  Link2,
  Shield,
} from "lucide-react";

const ownerSteps = [
  {
    icon: ClipboardList,
    title: "Varlığı ve takılmayı yaz",
    description: "Ne elinizde var, nerede durdu — dosyanın ilk iki satırı.",
  },
  {
    icon: AlertCircle,
    title: "Aranan ortak türünü seç",
    description: "Eksik parça ve aranan ortak netleşince dosya yapılandırılır.",
  },
  {
    icon: FileCheck,
    title: "ORTAQ incelemesine gönder",
    description: "ORTAQ incelemesi tutarlılığı kontrol eder; eksik varsa revizyon istenir.",
  },
  {
    icon: Handshake,
    title: "Eşleşme ve görüşme",
    description: "Uygun profiller görünür; görüşme ORTAQ paneli üzerinden ilerler.",
  },
];

const partnerSteps = [
  {
    icon: UserCircle,
    title: "Katkını profiline işle",
    description: "Sermaye, teknik, operasyon veya sektör deneyimini net yaz.",
  },
  {
    icon: Target,
    title: "Dosyalara başvur",
    description: "Kategori, aşama ve aranan ortak türüne göre filtreleyip başvur.",
  },
  {
    icon: Link2,
    title: "Eşleşme oluşsun",
    description: "ORTAQ, profilinize uygun dosyaları öne çıkarır.",
  },
  {
    icon: Shield,
    title: "Kademeli bilgi paylaşımı",
    description: "Hassas detaylar eşleşme sonrası açılır; gizlilik dosya sahibinde.",
  },
];

export default function NasilCalisirPage() {
  return (
    <>
      <Section variant="surface">
        <AppContainer size="narrow">
          <PageHeader
            eyebrow="Süreç"
            title="Nasıl Çalışır"
            description="İki yol: fırsat dosyası oluşturan ve ortak olarak katılan. Her iki taraf yapılandırılmış profille ilerler."
          />
        </AppContainer>
      </Section>

      <Section>
        <AppContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 font-heading text-xl font-semibold text-ortaq-navy">
                Fırsat sahipleri için
              </h2>
              <FlowSteps steps={ownerSteps} numbered layout="stack" />
            </div>
            <div>
              <h2 className="mb-6 font-heading text-xl font-semibold text-ortaq-navy">
                Ortaklar için
              </h2>
              <FlowSteps steps={partnerSteps} numbered layout="stack" />
            </div>
          </div>
        </AppContainer>
      </Section>

      <Section variant="alt">
        <AppContainer size="narrow">
          <h2 className="font-heading text-2xl font-semibold text-ortaq-navy">
            ORTAQ&apos;ta herkes her şeyi görmez.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ortaq-text-muted">
            Gizlilik seviyesi dosya sahibi tarafından belirlenir. Bazı bilgiler
            yalnızca uygun eşleşme oluştuğunda paylaşılır.
          </p>
          <VisibilityExplainer className="mt-8" />
        </AppContainer>
      </Section>

      <Section>
        <AppContainer>
          <PageHeader
            eyebrow="Ticari model"
            title={ORTAQ_COPY.monetization.sectionTitle}
            description={ORTAQ_COPY.monetization.sectionDescription}
            className="border-none pb-6"
          />
          <MonetizationTiers />
        </AppContainer>
      </Section>
    </>
  );
}
