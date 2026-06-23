import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";
import { DossierFilePanel } from "@/components/opportunity/DossierFilePanel";
import { mockOpportunities } from "@/data/mock-opportunities";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const heroPreviewOpportunity = mockOpportunities[0];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-ortaq-line bg-[#FAFBFD]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,33,61,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,33,61,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-ortaq-action/80" aria-hidden />

      <AppContainer className="relative py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 xl:gap-16">
          <div className="max-w-xl">
            <p className="type-eyebrow mb-5">{ORTAQ_COPY.trust.heroEyebrow}</p>
            <h1 className="type-display max-w-[15ch] text-balance">
              Takılı kalan fırsatlar, doğru ortakla yeniden açılır.
            </h1>
            <p className="mt-5 text-[1rem] leading-relaxed text-ortaq-text-muted md:text-[1.0625rem]">
              ORTAQ; yarım kalmış, tıkanmış veya doğru yapıya kavuşamadığı için
              ilerleyemeyen iş fırsatlarını yapılandırılmış dosyalara dönüştürür
              ve uygun ortak türüyle eşleştirir.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/kayit/yol-secimi">
                <Button size="lg" className="h-11 px-6">
                  Fırsat Dosyası Oluştur
                </Button>
              </Link>
              <Link href="/firsatlar">
                <Button variant="outline" size="lg" className="h-11 border-ortaq-navy/15 bg-white px-6">
                  Fırsatları İncele
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:-mr-2 xl:-mr-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ortaq-text-muted">
              Canlı dosya önizlemesi
            </p>
            <DossierFilePanel
              opportunity={heroPreviewOpportunity}
              theme="paper"
              size="lg"
              className="shadow-[0_12px_48px_-16px_rgba(20,33,61,0.22)]"
            />
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
