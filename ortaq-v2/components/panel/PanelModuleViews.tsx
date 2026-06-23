import Link from "next/link";
import { Compass, User } from "lucide-react";
import type { PanelMatch } from "@/types/panel";
import type { UserRoleMode } from "@/types/nav";
import { PanelMatchCard } from "@/components/panel/PanelMatchCard";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

interface EslesmelerimViewProps {
  matches: PanelMatch[];
  role: UserRoleMode;
}

export function EslesmelerimView({ matches, role }: EslesmelerimViewProps) {
  if (matches.length === 0) {
    const isPartner = role === "partner";

    return (
      <PanelEmptyState
        icon={<Compass className="h-6 w-6" />}
        title="Henüz eşleşmeniz yok."
        description={
          isPartner
            ? ORTAQ_COPY.panel.matchesEmptyPartner
            : "Dosyalarınız yayına girdikten sonra uygun eşleşmeler burada görünür. Profilinizi güncel tutun."
        }
        primaryAction={
          <Link href={isPartner ? "/panel/kesfet" : "/panel/firsatlarim"}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              {isPartner ? ORTAQ_COPY.ctas.browseDossiers : "Fırsatlarımı Gör"}
            </Button>
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

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <PanelMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

interface MesajlarViewProps {
  role: UserRoleMode;
  hasMatches: boolean;
}

export function MesajlarView({ role, hasMatches }: MesajlarViewProps) {
  return (
    <PanelEmptyState
      icon={<User className="h-6 w-6" />}
      title="Henüz aktif bir görüşmeniz yok."
      description="Eşleşme onaylandığında görüşmeler ORTAQ panelinde listelenir. Önce eşleşme oluşturun."
      primaryAction={
        <Link href={hasMatches ? "/panel/eslesmelerim" : role === "partner" ? "/panel/kesfet" : "/panel/firsatlarim"}>
          <Button variant="outline">
            {hasMatches ? "Eşleşmelerime Git" : role === "partner" ? ORTAQ_COPY.ctas.browseDossiers : "Fırsatlarım"}
          </Button>
        </Link>
      }
      secondaryAction={
        role === "partner" ? (
          <Link href="/panel/kesfet" className="text-sm font-medium text-blue-600 hover:underline">
            {ORTAQ_COPY.panel.browseLink}
          </Link>
        ) : undefined
      }
    />
  );
}
