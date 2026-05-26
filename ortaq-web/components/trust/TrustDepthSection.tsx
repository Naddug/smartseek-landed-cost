"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ClaimRow } from "@/components/trust/ClaimRow";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const claims = [
  { titleKey: "trust.depth.claims.1.title", textKey: "trust.depth.claims.1.text", status: "pending" as const },
  { titleKey: "trust.depth.claims.2.title", textKey: "trust.depth.claims.2.text", status: "verified" as const, href: "/guven", linkKey: "trust.depth.learnMore" },
  { titleKey: "trust.depth.claims.3.title", textKey: "trust.depth.claims.3.text", status: "verified" as const, href: "/guven", linkKey: "trust.depth.learnMore" },
] as const;

export function TrustDepthSection() {
  const { t } = useTranslation();

  return (
    <Section spacing="quiet" tone="alt">
      <Container narrow>
        <SectionHeader
          label={t("trust.depth.label")}
          title={t("trust.depth.title")}
          description={t("trust.depth.intro")}
        />

        <div className="border-b border-ortaq-border">
          {claims.map((claim) => (
            <ClaimRow key={claim.titleKey} {...claim} />
          ))}
        </div>

        <div className="mt-8">
          <Link href="/guven" className={cn(typography.bodySm, typography.link)}>
            {t("trust.depth.cta")}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
