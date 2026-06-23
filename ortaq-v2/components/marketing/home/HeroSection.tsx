import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { RotatingDossierCard } from "@/components/opportunity/RotatingDossierCard";
import { HeroCTAs } from "@/components/marketing/home/HeroCTAs";
import { heroRotatingDossiers } from "@/data/marketing/home-dossiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const trustSignals = [
  { icon: ShieldCheck, label: ORTAQ_COPY.trust.reviewedPublish },
  { icon: Lock, label: ORTAQ_COPY.trust.privacyProtected },
  { icon: CheckCircle2, label: ORTAQ_COPY.trust.verifiedProfiles },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-[#FAFBFD]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,33,61,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,33,61,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-stone-900" aria-hidden />

      <AppContainer className="relative py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="type-eyebrow mb-5">{ORTAQ_COPY.trust.heroEyebrow}</p>
            <h1 className="type-display max-w-[15ch] text-balance">
              Takılı kalan fırsatlar, doğru ortakla yeniden açılır.
            </h1>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone-600 md:text-[1.0625rem]">
              Varlığı olan ama ilerleyemeyen fırsatlar dosyaya dönüşür — eksik
              parça netleşir, aranan ortak türü tanımlanır, eşleşme başlar.
            </p>
            <HeroCTAs />
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-stone-200 pt-6">
              {trustSignals.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-stone-600"
                >
                  <Icon className="h-3.5 w-3.5 text-stone-500" strokeWidth={1.75} />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <RotatingDossierCard
            dossiers={heroRotatingDossiers}
            intervalMs={8000}
            theme="paper"
            size="lg"
          />
        </div>
      </AppContainer>
    </section>
  );
}
