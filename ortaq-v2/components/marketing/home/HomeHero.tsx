import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="border-b border-ortaq-line bg-ortaq-surface pt-16 pb-14 md:pt-24 md:pb-20">
      <AppContainer size="narrow">
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-ortaq-action">
          Küratörlü ortak eşleştirme
        </p>
        <h1 className="max-w-3xl font-heading text-3xl font-semibold leading-tight tracking-tight text-ortaq-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Elinizde gerçek bir fırsat var ama tek başınıza ilerleyemiyor musunuz?
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ortaq-text-muted">
          ORTAQ, tamamlanamayan, takılıp kalan veya doğru yapıya kavuşamadığı için
          ilerleyemeyen iş fırsatlarıyla; o fırsatı büyütebilecek doğru ortakları
          buluşturan küratörlü bir platformdur.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/kayit/yol-secimi">
            <Button size="lg">Fırsat Dosyası Oluştur</Button>
          </Link>
          <Link href="/firsatlar">
            <Button variant="outline" size="lg">
              Fırsatları Keşfet
            </Button>
          </Link>
        </div>
      </AppContainer>
    </section>
  );
}
