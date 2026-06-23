import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";

export function HomeFinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-ortaq-line bg-white py-20 md:py-24">
      <AppContainer>
        <div className="mx-auto max-w-2xl border border-ortaq-line bg-[#FAFBFD] px-8 py-12 text-center md:px-12 md:py-14">
          <p className="type-eyebrow">Giriş</p>
          <h2 className="type-section mt-3 text-balance">
            Fırsat dosyası açın veya inceleyin
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ortaq-text-muted">
            Fırsat sahibiyseniz dosyanızı oluşturun. Ortak tarafındaysanız aktif
            dosyaları inceleyin.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/kayit/yol-secimi">
              <Button size="lg" className="h-11 px-6">
                Fırsat Dosyası Oluştur
              </Button>
            </Link>
            <Link href="/firsatlar">
              <Button variant="outline" size="lg" className="h-11 border-ortaq-navy/15 px-6">
                Fırsatları İncele
              </Button>
            </Link>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
