import Link from "next/link";
import { Briefcase, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanelOverviewPayload } from "@/types/panel";

interface PanelOverviewStatsProps {
  stats: PanelOverviewPayload["stats"];
}

const statCards = [
  {
    key: "activeDossiers" as const,
    label: "Aktif Dosya",
    href: "/panel/firsatlarim",
    icon: Briefcase,
  },
  {
    key: "pendingMatches" as const,
    label: "Bekleyen Eşleşme",
    href: "/panel/eslesmeler",
    icon: Users,
  },
  {
    key: "unreadMessages" as const,
    label: "Okunmamış Mesaj",
    href: "/panel/mesajlar",
    icon: MessageSquare,
  },
];

export function PanelOverviewStats({ stats }: PanelOverviewStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statCards.map(({ key, label, href, icon: Icon }) => (
        <Link
          key={key}
          href={href}
          className={cn(
            "rounded-xl border border-stone-200 bg-white p-4 transition-colors",
            "hover:border-stone-300 hover:bg-stone-50/80"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-2xl font-semibold tabular-nums text-stone-950">
                {stats[key]}
              </p>
              <p className="mt-0.5 text-sm text-stone-600">{label}</p>
            </div>
            <Icon className="h-4 w-4 text-stone-400" strokeWidth={1.75} />
          </div>
        </Link>
      ))}
    </div>
  );
}
