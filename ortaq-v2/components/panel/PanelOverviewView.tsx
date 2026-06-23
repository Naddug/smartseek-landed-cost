import Link from "next/link";
import { Compass, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PanelOverviewPayload } from "@/types/panel";
import { PanelOverviewStats } from "@/components/panel/PanelOverviewStats";
import { PanelSectionHeader } from "@/components/panel/PanelEmptyState";
import { PanelDossierSummaryRow } from "@/components/panel/PanelDossierSummaryRow";
import { PanelMatchCard } from "@/components/panel/PanelMatchCard";
import { PanelActivityFeed } from "@/components/panel/PanelActivityFeed";
import { PanelNextActions } from "@/components/panel/PanelNextActions";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

interface PanelOverviewViewProps {
  overview: PanelOverviewPayload;
}

function OwnerZeroState() {
  return (
    <PanelEmptyState
      icon={<FileText className="h-6 w-6" />}
      title="Henüz bir fırsat dosyanız yok."
      description={ORTAQ_COPY.panel.ownerEmptyDescription}
      primaryAction={
        <Link href="/panel/dosya-olustur">
          <Button className="bg-blue-600 hover:bg-blue-700">{ORTAQ_COPY.ctas.createFirstDossier}</Button>
        </Link>
      }
      secondaryAction={
        <Link href="/firsatlar" className="text-sm font-medium text-blue-600 hover:underline">
          Önce fırsatları incele →
        </Link>
      }
    />
  );
}

function PartnerZeroState() {
  return (
    <PanelEmptyState
      icon={<Compass className="h-6 w-6" />}
      title="Henüz eşleşme veya kaydedilmiş fırsat görünmüyor."
      description={ORTAQ_COPY.panel.browseDescription}
      primaryAction={
        <Link href="/panel/kesfet">
          <Button className="bg-blue-600 hover:bg-blue-700">{ORTAQ_COPY.ctas.browseDossiers}</Button>
        </Link>
      }
      secondaryAction={
        <Link href="/panel/profilim" className="text-sm font-medium text-blue-600 hover:underline">
          {ORTAQ_COPY.ctas.completeProfile} →
        </Link>
      }
    />
  );
}

function DashboardContent({ overview }: PanelOverviewViewProps) {
  const recentDossiers = overview.dossiers.slice(0, 3);
  const pendingMatches = overview.matches
    .filter((m) => m.status === "pending")
    .slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
      <div className="space-y-6">
        <PanelOverviewStats stats={overview.stats} />

        {(overview.role === "owner" || overview.role === "hybrid") &&
          recentDossiers.length > 0 && (
            <section className="rounded-xl border border-stone-200 bg-white">
              <div className="border-b border-stone-100 px-4 py-3">
                <PanelSectionHeader
                  title="Fırsatlarım"
                  href="/panel/firsatlarim"
                />
              </div>
              {recentDossiers.map((dossier) => (
                <PanelDossierSummaryRow key={dossier.id} dossier={dossier} />
              ))}
            </section>
          )}

        {pendingMatches.length > 0 && (
          <section>
            <PanelSectionHeader title="Bekleyen Eşleşmeler" href="/panel/eslesmelerim" />
            <div className="space-y-3">
              {pendingMatches.map((match) => (
                <PanelMatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6">
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="mb-4 font-heading text-base font-semibold text-stone-950">
            Yapılacaklar
          </h2>
          <PanelNextActions overview={overview} />
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="mb-4 font-heading text-base font-semibold text-stone-950">
            Son Aktivite
          </h2>
          <PanelActivityFeed events={overview.recentActivity} />
        </section>
      </aside>
    </div>
  );
}

export function PanelOverviewView({ overview }: PanelOverviewViewProps) {
  const isOwnerRole = overview.role === "owner" || overview.role === "hybrid";
  const hasDossiers = overview.dossiers.length > 0;
  const hasMatches = overview.matches.length > 0;
  const hasActivity =
    hasDossiers || hasMatches || overview.stats.unreadMessages > 0;

  const showOwnerZero = isOwnerRole && !hasDossiers && !hasMatches;
  const showPartnerZero = overview.role === "partner" && !hasMatches;

  return (
    <div>
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">
          Panel
        </p>
        <h1 className="font-heading text-2xl font-semibold text-stone-950">
          Genel Bakış
        </h1>
      </header>

      {showOwnerZero && <OwnerZeroState />}
      {showPartnerZero && !showOwnerZero && <PartnerZeroState />}
      {!showOwnerZero && !showPartnerZero && hasActivity && (
        <DashboardContent overview={overview} />
      )}
      {!showOwnerZero && !showPartnerZero && !hasActivity && overview.role === "hybrid" && (
        <DashboardContent overview={overview} />
      )}
    </div>
  );
}
