import { AppContainer } from "@/components/shared/AppContainer";
import { PageShell } from "@/components/marketing/PageShell";
import { EmptyState } from "@/components/shared/EmptyState";

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
          description="Fırsat dosyası inceleme ve onay akışı burada yönetilir."
        >
          <EmptyState
            title="İnceleme kuyruğu boş"
            description="Yayın bekleyen dosyalar onaylandığında veya reddedildiğinde bu ekranda listelenir."
          />
        </PageShell>
      </AppContainer>
    </div>
  );
}
