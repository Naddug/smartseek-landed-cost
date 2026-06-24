import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

export default function HakkimizdaPage() {
  const copy = ORTAQ_COPY.pages.hakkimizda;

  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          eyebrow="ORTAQ"
          title="Hakkımızda"
          description={copy.description}
        >
          <div className="mt-8 max-w-none space-y-6 text-sm leading-relaxed text-ortaq-text-secondary">
            <p>{copy.paragraph1}</p>
            <p>{copy.paragraph2}</p>
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
