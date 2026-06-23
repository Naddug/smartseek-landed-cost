import { AppContainer } from "@/components/shared/AppContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FlowSteps } from "@/components/marketing/FlowSteps";
import { FileEdit, Layers, Search, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: FileEdit,
    title: "Fırsatını veya profilini oluştur",
    description: "Rolünü seç, temel bilgileri gir.",
  },
  {
    icon: Layers,
    title: "ORTAQ dosyanı yapılandırır",
    description: "Varlık, engel ve aranan ortak netleşir.",
  },
  {
    icon: Search,
    title: "Uygun eşleşmeler görünür",
    description: "Kategori ve katkı türüne göre filtrelenir.",
  },
  {
    icon: MessageCircle,
    title: "Platform içinde tanışırsınız",
    description: "Doğrudan iletişim, kontrollü ortamda.",
  },
];

export function HowItWorksPreview() {
  return (
    <section className="py-16 md:py-20">
      <AppContainer>
        <SectionHeader
          eyebrow="Süreç"
          title="Nasıl ilerler?"
          description="Dört adımda fırsat dosyasından eşleşmeye."
        />
        <FlowSteps steps={steps} />
      </AppContainer>
    </section>
  );
}
