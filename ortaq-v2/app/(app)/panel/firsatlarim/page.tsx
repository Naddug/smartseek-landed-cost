import Link from "next/link";
import { Plus } from "lucide-react";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReadinessRing } from "@/components/shared/ReadinessRing";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { listOpportunityDossiers } from "@/lib/actions/opportunity-dossier";
import {
  labelFor,
  CATEGORY_OPTIONS,
} from "@/data/onboarding/owner-options";

export default async function FirsatlarimPage() {
  const dossiers = await listOpportunityDossiers();

  return (
    <PageShell
      title="Fırsatlarım"
      description="Oluşturduğunuz fırsat dosyalarını yönetin."
      action={
        <Link href="/onboarding/firsat-sahibi">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Yeni Fırsat
          </Button>
        </Link>
      }
    >
      {dossiers.length === 0 ? (
        <EmptyState
          title="Henüz fırsat dosyanız yok"
          description="İlk fırsat dosyanızı oluşturarak başlayın. ORTAQ, dağınık bilgilerinizi yapılandırılmış bir dosyaya dönüştürmenize yardımcı olur."
          action={
            <Link href="/onboarding/firsat-sahibi">
              <Button>Fırsat Dosyası Oluştur</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {dossiers.map((dossier) => (
            <Link
              key={dossier.id}
              href={`/panel/firsatlarim/${dossier.id}`}
              className="group flex flex-col rounded-xl border border-ortaq-line bg-ortaq-surface p-5 transition-shadow hover:shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <StatusBadge
                    label={labelFor(CATEGORY_OPTIONS, dossier.category)}
                    className="bg-ortaq-action/10 text-ortaq-action"
                  />
                  <h3 className="mt-2 font-heading text-lg font-semibold text-ortaq-navy group-hover:text-ortaq-action">
                    {dossier.title}
                  </h3>
                </div>
                <ReadinessRing score={dossier.readinessScore} size={40} />
              </div>
              {dossier.summary && (
                <p className="line-clamp-2 text-sm text-ortaq-text-muted">
                  {dossier.summary}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-ortaq-line pt-3">
                <StatusBadge label="Taslak" variant="draft" />
                <span className="text-xs text-ortaq-text-muted">
                  {new Date(dossier.updatedAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
