"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { FAQ_ITEMS } from "@/lib/seo/faq";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function FaqPageView() {
  const { t } = useTranslation();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="compact">
        <Container narrow>
          <SectionHeader
            titleAs="h1"
            title={t("homeProduct.invest.faq.title")}
            description={t("homeProduct.invest.faq.lead")}
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
