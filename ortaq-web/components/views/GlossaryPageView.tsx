"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { GLOSSARY_TERMS } from "@/lib/seo/glossary";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function GlossaryPageView() {
  return (
    <PublicShell stickyCta={false}>
      <Section spacing="compact">
        <Container narrow>
          <SectionHeader
            title="Sözlük"
            description="Paya dayalı ortaklıkta sık geçen terimler — sade açıklamalar."
          />

          <dl className="space-y-0 border-y border-ortaq-border">
            {GLOSSARY_TERMS.map((term) => (
              <div key={term.id} id={term.id} className="border-b border-ortaq-border py-5 last:border-b-0">
                <dt className={typography.h3}>{term.term}</dt>
                <dd className={cn(typography.body, "mt-2")}>{term.definition}</dd>
                {term.related && term.related.length > 0 && (
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {term.related.map((id) => {
                      const related = GLOSSARY_TERMS.find((t) => t.id === id);
                      if (!related) return null;
                      return (
                        <Link
                          key={id}
                          href={`/sozluk#${id}`}
                          className={cn(typography.caption, typography.link)}
                        >
                          {related.term}
                        </Link>
                      );
                    })}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <RelatedLinks route="sozluk" />
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
