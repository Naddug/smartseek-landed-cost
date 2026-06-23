import { AppContainer } from "@/components/shared/AppContainer";
import { PageShell } from "@/components/marketing/PageShell";

export default function AdminModerasyonPage() {
  return (
    <div className="min-h-screen bg-ortaq-bg">
      <div className="border-b border-ortaq-line bg-ortaq-surface">
        <AppContainer>
          <div className="flex h-14 items-center justify-between">
            <span className="font-heading text-lg font-bold text-ortaq-navy">
              ORTAQ Admin
            </span>
            <span className="text-xs text-ortaq-text-muted">Moderasyon</span>
          </div>
        </AppContainer>
      </div>
      <AppContainer className="py-8">
        <PageShell
          eyebrow="Admin"
          title="Moderasyon"
          description="Fırsat dosyası inceleme ve onay akışı burada yönetilecek."
          emptyTitle="Moderasyon paneli henüz aktif değil"
          emptyDescription="Admin yetkilendirme ve moderasyon mantığı bir sonraki sprintte eklenecek."
        />
      </AppContainer>
    </div>
  );
}
