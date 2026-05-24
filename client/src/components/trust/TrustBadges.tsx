import { useTranslation } from "react-i18next";
import { ShieldCheck, FileText, BadgeCheck, Lock } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, labelKey: "trustBadge.soc2", subKey: "trustBadge.soc2.sub" },
  { icon: FileText, labelKey: "trustBadge.encryption", subKey: "trustBadge.encryption.sub" },
  { icon: BadgeCheck, labelKey: "trustBadge.gdpr", subKey: "trustBadge.gdpr.sub" },
  { icon: Lock, labelKey: "trustBadge.uptime", subKey: "trustBadge.uptime.sub" },
];

/** Sourcing-native trust signals — registry verification and operator routing, not fabricated compliance badges. */
export function TrustBadges({ variant = "default" }: { variant?: "default" | "compact" }) {
  const { t } = useTranslation();

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap justify-center gap-6 text-slate-500">
        {BADGES.map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <b.icon className="w-4 h-4 text-slate-400" />
            <span>{t(b.labelKey)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {BADGES.map((b, i) => (
        <div key={i} className="flex items-center gap-3 text-slate-600">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <b.icon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900">{t(b.labelKey)}</div>
            <div className="text-xs text-slate-500">{t(b.subKey)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
