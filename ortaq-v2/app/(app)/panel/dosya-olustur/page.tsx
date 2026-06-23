import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function DosyaOlusturPage() {
  return (
    <>
      <PageHeader
        eyebrow="Yeni dosya"
        title="Fırsat Dosyası Oluştur"
        description="Varlığınızı, eksik parçayı ve aranan ortak türünü yapılandırılmış dosyaya dönüştürün."
      />
      <div className="mt-8 max-w-lg rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-heading text-lg font-semibold text-stone-950">
          Dosya sihirbazını başlat
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Fırsat sahibi onboarding akışı; varlık, aşama, eksik parça ve ortak
          ihtiyacını adım adım dosyaya işler.
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
    </>
  );
}
