import { Briefcase, Rocket, Building2, Factory } from "lucide-react";

export type Persona = "procurer" | "entrepreneur" | "supplier" | "producer";

const personas: { id: Persona; label: string; icon: React.ReactNode; headline: string; subline: string }[] = [
  {
    id: "procurer",
    label: "Procurers",
    icon: <Briefcase className="w-5 h-5" />,
    headline: "Reduce risk. Improve margins. Stay compliant.",
    subline: "AI-powered supplier verification, landed cost accuracy, and compliance monitoring for procurement teams.",
  },
  {
    id: "entrepreneur",
    label: "Entrepreneurs",
    icon: <Rocket className="w-5 h-5" />,
    headline: "Source fast. Scale smart. Launch sooner.",
    subline: "Find verified suppliers in minutes, not weeks. Startup-friendly pricing with enterprise-grade tools.",
  },
  {
    id: "supplier",
    label: "Suppliers",
    icon: <Building2 className="w-5 h-5" />,
    headline: "Get discovered. Win more RFQs.",
    subline: "Join 100,000+ verified suppliers. Receive qualified buyer inquiries and grow your export business.",
  },
  {
    id: "producer",
    label: "Producers",
    icon: <Factory className="w-5 h-5" />,
    headline: "Control costs. Assure quality. Diversify sources.",
    subline: "Raw material sourcing, cost benchmarking, and supplier diversification for manufacturing leaders.",
  },
];

interface PersonaHeroProps {
  active: Persona;
  onSelect: (p: Persona) => void;
}

/** Multi-persona messaging - speaks directly to each audience (neuromarketing: relevance) */
export function PersonaHero({ active, onSelect }: PersonaHeroProps) {
  const current = personas.find((p) => p.id === active) ?? personas[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              active === p.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{current.headline}</h3>
        <p className="text-slate-600 max-w-xl">{current.subline}</p>
      </div>
    </div>
  );
}
