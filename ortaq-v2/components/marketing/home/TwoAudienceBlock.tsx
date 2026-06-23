import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";

export function TwoAudienceBlock() {
  return (
    <section className="border-b border-stone-200 bg-white py-20 md:py-24">
      <AppContainer>
        <div className="mb-12 max-w-2xl">
          <p className="type-eyebrow">İki taraf, tek dosya mantığı</p>
          <h2 className="type-section mt-3">
            Varlık bir tarafta, kapasite diğer tarafta
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
            <div className="absolute inset-y-0 left-0 w-1 bg-stone-900" aria-hidden />
            <div className="border-b border-stone-200 bg-white px-6 py-5 md:px-8">
              <p className="type-eyebrow">Fırsat sahibi</p>
              <h3 className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em] text-stone-950 md:text-2xl">
                Varlık var. Ortak eksik.
              </h3>
            </div>
            <div className="px-6 py-6 md:px-8 md:py-7">
              <p className="text-sm leading-relaxed text-stone-600">
                Ürün, lokasyon, müşteri tabanı veya üretim kapasitesi elinizde —
                ilerleme operatör, teknik veya büyüme ortağı eksikliğinde durdu.
                Dosyada varlık ve eksik parça net yazılır.
              </p>
              <Link href="/panel/dosya-olustur" className="mt-6 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Fırsat Dosyası Oluştur
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-stone-800 bg-stone-950 shadow-xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" aria-hidden />
            <div className="relative border-b border-white/10 bg-white/[0.04] px-6 py-5 md:px-8">
              <p className="type-eyebrow text-white/45">Ortak tarafı</p>
              <h3 className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
                Sıfırdan başlamadan bir fırsata ortak ol.
              </h3>
            </div>
            <div className="relative px-6 py-6 md:px-8 md:py-7">
              <p className="text-sm leading-relaxed text-white/60">
                Sermaye, operasyon, teknik, büyüme veya sektör gücünüzü yapılandırılmış
                bir dosyaya taşıyın. Varlık ve aranan ortak türü önceden tanımlıdır.
              </p>
              <Link href="/firsatlar" className="mt-6 inline-block">
                <Button
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Fırsatları İncele
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
