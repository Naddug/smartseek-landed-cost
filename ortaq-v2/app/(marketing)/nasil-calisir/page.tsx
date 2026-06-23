import { AppContainer } from "@/components/shared/AppContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { FlowSteps } from "@/components/marketing/FlowSteps";
import { VisibilityExplainer } from "@/components/marketing/VisibilityExplainer";
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
    title: "Fırsatını tanımla",
    description: "Ne var, nerede takıldın, hangi varlıklar mevcut — net bir çerçeve çiz.",
  },
  {
    icon: AlertCircle,
    title: "Nerede takıldığını ve ne aradığını seç",
    description: "Engel ve aranan ortak türünü belirle; dosya yapılandırılsın.",
  },
  {
    icon: FileCheck,
    title: "Dosyan incelemeye girsin",
    description: "ORTAQ inceleme ekibi dosyayı gözden geçirir; eksikler varsa geri bildirim gelir.",
  },
  {
    icon: Handshake,
    title: "Uygun ortaklarla tanış",
    description: "Eşleşmeler oluşunca platform içinde kontrollü iletişim başlar.",
  },
];

const partnerSteps = [
  {
    icon: UserCircle,
    title: "Ne katabileceğini anlat",
    description: "Sermaye, teknik, operasyon veya sektör deneyimini profiline işle.",
  },
  {
    icon: Target,
    title: "Uygun dosyalara başvur",
    description: "Kategori, aşama ve ortak ihtiyacına göre dosyaları filtreleyip başvuru oluştur.",
  },
  {
    icon: Link2,
    title: "Uyumlu dosyalarla eşleş",
    description: "ORTAQ, profiline ve tercihlerine uygun fırsat dosyalarını öne çıkarır.",
  },
  {
    icon: Shield,
    title: "Güvenli şekilde bağlantı kur",
    description: "İletişim platform üzerinden; hassas bilgiler kademeli açılır.",
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
            description="ORTAQ'ta iki ayrı yol var: fırsat dosyası oluşturanlar ve ortak olarak katılanlar. Her iki taraf da yapılandırılmış bir profille ilerler."
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
    </>
  );
}
