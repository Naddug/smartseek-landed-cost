import { Shield, Lock, FileCheck, Zap } from "lucide-react";

/** Trust badges placed near CTAs - increases conversion 15-42% (Hashmeta research) */
export function TrustBadges({ variant = "default" }: { variant?: "default" | "compact" }) {
  const badges = [
    { icon: Shield, label: "SOC 2 Certified", sub: "Enterprise security" },
    { icon: Lock, label: "256-bit Encryption", sub: "Your data protected" },
    { icon: FileCheck, label: "GDPR Compliant", sub: "Privacy first" },
    { icon: Zap, label: "99.9% Uptime", sub: "Always available" },
  ];

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap justify-center gap-6 text-slate-500">
        {badges.map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <b.icon className="w-4 h-4 text-slate-400" />
            <span>{b.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-3 text-slate-600">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <b.icon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900">{b.label}</div>
            <div className="text-xs text-slate-500">{b.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
