import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export default function DosyaOlusturPage() {
  return (
    <>
      <PageHeader
        eyebrow="Yeni dosya"
        title="Fırsat Dosyası Oluştur"
        description="Varlığınızı, eksik parçayı ve aranan ortak türünü yapılandırılmış dosyaya dönüştürün."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-stone-950">
            Dosya sihirbazını başlat
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Fırsat sahibi onboarding akışı; varlık, aşama, eksik parça ve ortak
            ihtiyacını adım adım dosyaya işler. Tamamlanan dosya incelemeye girer.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding/firsat-sahibi">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sihirbazı Başlat
              </Button>
            </Link>
            <Link href="/kayit/yol-secimi">
              <Button variant="outline">Yol seçimi</Button>
            </Link>
          </div>
        </div>

        <aside className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-blue-700/70">
            Premium destek
          </p>
          <h2 className="mt-2 font-heading text-base font-semibold text-stone-950">
            {ORTAQ_COPY.monetization.ownerPremiumTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {ORTAQ_COPY.monetization.ownerPremiumDescription}
          </p>
          <p className="mt-4 text-xs text-stone-500">
            Hızlandırılmış inceleme ve arşivde öne çıkarma seçenekleri{" "}
            <Link href="/guven-kalite" className="font-medium text-blue-600 hover:underline">
              Güven & Kalite
            </Link>{" "}
            sayfasında.
          </p>
        </aside>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-heading text-lg font-semibold text-stone-950">
          ORTAQ ticari katmanları
        </h2>
        <MonetizationTiers showCtas={false} />
      </div>
    </>
  );
}
