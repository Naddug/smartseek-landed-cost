import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-stone-950 py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" aria-hidden />

      <AppContainer className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Fırsatınız dosyaya dönüşmeyi bekliyor.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-white/55">
            Varlığı olan fırsatlar ve onları tamamlayacak ortaklar aynı yapılandırılmış
            dosya mantığında buluşur.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/kayit/yol-secimi">
              <Button size="lg" className="h-11 bg-blue-600 px-6 hover:bg-blue-700">
                Fırsat Dosyası Oluştur
              </Button>
            </Link>
            <Link href="/firsatlar">
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                Fırsatları İncele
              </Button>
            </Link>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
            {ORTAQ_COPY.trust.trustFooter}
          </p>
          <p className="mt-3 text-xs text-white/40">
            Premium dosya desteği · Doğrulanmış ortak · Hızlı inceleme
          </p>
        </div>
      </AppContainer>
    </section>
  );
}
