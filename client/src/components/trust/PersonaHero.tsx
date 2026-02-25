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
  procurer: <Briefcase className="w-5 h-5" />,
  entrepreneur: <Rocket className="w-5 h-5" />,
  supplier: <Building2 className="w-5 h-5" />,
  producer: <Factory className="w-5 h-5" />,
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
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PERSONA_KEYS) as Persona[]).map((id) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{t(keys.headlineKey)}</h3>
        <p className="text-slate-600 max-w-xl">{t(keys.sublineKey)}</p>
      </div>
    </div>
  );
}
