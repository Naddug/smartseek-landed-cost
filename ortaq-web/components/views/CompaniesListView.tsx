"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { listCampaigns } from "@/lib/campaigns";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const statusTr: Record<string, string> = {
  preliminary_review: "Ön inceleme",
  document_review: "Belge incelemesi",
  field_verification: "Saha doğrulaması",
  committee: "Komite",
};

export function CompaniesListView() {
  const campaigns = listCampaigns();

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <p className={typography.kicker}>Değerlendirme dosyaları</p>
          <h1 className={cn(typography.h1, "mt-3")}>Şirketler</h1>
          <p className={cn(typography.lead, "mt-4")}>
            İnceleme sürecindeki şirketler. Yatırım teklifi değil — operasyonel dosyalar.
          </p>
        </Container>
      </Section>

      <Section spacing="compact">
        <Container narrow>
          <ul className="divide-y divide-ortaq-border border-y border-ortaq-border">
            {campaigns.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/sirket/${c.slug}`}
                  className="flex flex-col gap-3 py-6 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status="illustrative" />
                      <VerificationLabel label={c.verificationLabel} />
                    </div>
                    <h2 className={cn(typography.h3, "mt-3")}>{c.tradeName}</h2>
                    <p className={cn(typography.bodySm, "mt-1")}>{c.sector}</p>
                    <p className={cn(typography.caption, "mt-2")}>
                      {c.city} · {c.founded} · {c.employees} çalışan
                    </p>
                  </div>
                  <span className={cn(typography.caption, "shrink-0")}>
                    {statusTr[c.reviewStatus]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/degerlendirme" className={cn(typography.bodySm, typography.link, "mt-6 inline-block")}>
            Seçim sürecini okuyun →
          </Link>
        </Container>
      </Section>
    </PublicShell>
  );
}
