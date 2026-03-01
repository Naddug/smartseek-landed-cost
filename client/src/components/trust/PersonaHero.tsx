import React from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Rocket, Building2, Factory } from "lucide-react";

export type Persona = "procurer" | "entrepreneur" | "supplier" | "producer";

const PERSONA_KEYS: Record<Persona, { labelKey: string; headlineKey: string; sublineKey: string }> = {
  procurer: { labelKey: "persona.procurers", headlineKey: "persona.procurers.headline", sublineKey: "persona.procurers.subline" },
  entrepreneur: { labelKey: "persona.entrepreneurs", headlineKey: "persona.entrepreneurs.headline", sublineKey: "persona.entrepreneurs.subline" },
  supplier: { labelKey: "persona.suppliers", headlineKey: "persona.suppliers.headline", sublineKey: "persona.suppliers.subline" },
  producer: { labelKey: "persona.producers", headlineKey: "persona.producers.headline", sublineKey: "persona.producers.subline" },
};

const PERSONA_ICONS: Record<Persona, React.ReactNode> = {
  procurer: <Briefcase className="w-3.5 h-3.5 sm:w-5 sm:h-5" />,
  entrepreneur: <Rocket className="w-3.5 h-3.5 sm:w-5 sm:h-5" />,
  supplier: <Building2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />,
  producer: <Factory className="w-3.5 h-3.5 sm:w-5 sm:h-5" />,
};

interface PersonaHeroProps {
  active: Persona;
  onSelect: (p: Persona) => void;
}

/** Multi-persona messaging - speaks directly to each audience (neuromarketing: relevance) */
export function PersonaHero({ active, onSelect }: PersonaHeroProps) {
  const { t } = useTranslation();
  const keys = PERSONA_KEYS[active];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {(Object.keys(PERSONA_KEYS) as Persona[]).map((id) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              active === id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            {PERSONA_ICONS[id]}
            {t(PERSONA_KEYS[id].labelKey)}
          </button>
        ))}
      </div>
      <div className="space-y-2 min-w-0">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 break-words">{t(keys.headlineKey)}</h3>
        <p className="text-slate-600 max-w-xl break-words">{t(keys.sublineKey)}</p>
      </div>
    </div>
  );
}
