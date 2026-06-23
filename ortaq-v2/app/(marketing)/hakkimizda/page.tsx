import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export default function HakkimizdaPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          eyebrow="ORTAQ"
          title="Hakkımızda"
          description="Varlığı olan, takılı kalan fırsatlar için yapılandırılmış dosya arşivi. Seçici yayın, net eşleşme."
        >
          <div className="mt-8 max-w-none space-y-6 text-sm leading-relaxed text-ortaq-text-secondary">
            <p>
              ORTAQ duvar ilanı değil. Her dosyada varlık, eksik parça ve aranan ortak
              türü ayrı satırlarda yazar. Yayına alınmadan önce ORTAQ incelemesinden geçer.
            </p>
            <p>
              Fırsat sahipleri mevcut varlıklarını netleştirir; ortaklar sıfırdan
              değil, yapılandırılmış bir dosyaya katkı sunar. Görüşme ORTAQ paneli
              üzerinden, kademeli gizlilikle ilerler.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/kayit/yol-secimi">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {ORTAQ_COPY.ctas.createDossier}
                </Button>
              </Link>
              <Link href="/firsatlar">
                <Button variant="outline">{ORTAQ_COPY.ctas.browseDossiers}</Button>
              </Link>
            </div>
          </div>
        </PageShell>
      </AppContainer>
    </Section>
  );
}
