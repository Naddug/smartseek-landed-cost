"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { FAQ_ITEMS } from "@/lib/seo/faq";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function FaqPageView() {
  return (
    <PublicShell stickyCta={false}>
      <Section spacing="compact">
        <Container narrow>
          <SectionHeader
            title="Sık sorulan sorular"
            description="Ortaklık, güven ve risk hakkında kısa yanıtlar. Tavsiye değildir."
          />

          <dl className="space-y-0 border-y border-ortaq-border">
            {FAQ_ITEMS.map((item) => (
              <div key={item.id} id={item.id} className="border-b border-ortaq-border py-5 last:border-b-0">
                <dt className={typography.h3}>{item.question}</dt>
                <dd className={cn(typography.body, "mt-2")}>{item.answer}</dd>
                {item.links && item.links.length > 0 && (
                  <dd className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {item.links.map((l) => (
                      <Link key={l.href} href={l.href} className={cn(typography.bodySm, typography.link)}>
                        {l.label}
                      </Link>
                    ))}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <RelatedLinks route="sss" />
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
