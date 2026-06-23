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
          description="ORTAQ, varlığı olan ama ilerleyemeyen fırsatları yapılandırılmış dosyalara dönüştüren ve doğru ortak türüyle eşleştiren bir platformdur."
        >
          <div className="prose prose-stone mt-8 max-w-none space-y-6 text-sm leading-relaxed text-stone-600">
            <p>
              Duvar ilanı panosu değiliz. Her fırsat dosyasında varlık, eksik parça
              ve aranan ortak türü ayrı ayrı tanımlanır. Yayına alınmadan önce
              dosyalar ORTAQ yayın standardına göre incelenir.
            </p>
            <p>
              Fırsat sahipleri mevcut varlıklarını netleştirir; ortaklar sıfırdan
              başlamadan yapılandırılmış bir fırsata katkı sunabilir. Eşleşme ve
              görüşme süreci platform içinde kontrollü ilerler.
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
