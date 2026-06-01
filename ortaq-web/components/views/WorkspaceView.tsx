"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { CompanyCard } from "@/components/product/CompanyCard";
import { getCampaign } from "@/lib/campaigns";
import { useInterest } from "@/lib/interest/store";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function WorkspaceView() {
  return (
    <PublicShell stickyCta={false}>
      <WorkspaceContent />
    </PublicShell>
  );
}

function WorkspaceContent() {
  const { t } = useTranslation();
  const { watch, intros } = useInterest();
  const watched = watch.map((slug) => getCampaign(slug)).filter(Boolean);

  return (
    <>
      <Section spacing="compact">
        <Container narrow>
          <SectionHeader titleAs="h1" title={t("discovery.workspace.title")} description={t("discovery.workspace.subtitle")} />
          <p className={cn(typography.caption, "mt-4 text-ortaq-ink-soft")}>{t("discovery.workspace.legal")}</p>
        </Container>
      </Section>

      <section className="border-t border-ortaq-border bg-ortaq-bg-alt pb-12">
        <Container wide className="pt-8">
          <h2 className={cn(typography.label, "text-ortaq-ink-soft")}>{t("discovery.workspace.watchTitle")}</h2>
          {watched.length === 0 ? (
            <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink-muted")}>{t("discovery.workspace.watchEmpty")}</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {watched.map((c) => c && <CompanyCard key={c.slug} campaign={c} />)}
            </div>
          )}

          <h2 className={cn(typography.label, "mt-10 text-ortaq-ink-soft")}>{t("discovery.workspace.interestTitle")}</h2>
          {intros.length === 0 ? (
            <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink-muted")}>{t("discovery.workspace.interestEmpty")}</p>
          ) : (
            <ul className="mt-4 divide-y divide-ortaq-border border border-ortaq-border bg-ortaq-surface">
              {intros.map((intro) => {
                const c = getCampaign(intro.profileSlug);
                return (
                  <li key={intro.id} className="px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link href={c ? `/sirket/${c.slug}` : "/kesfet"} className="font-semibold text-ortaq-ink hover:underline">
                        {c?.tradeName ?? intro.profileSlug}
                      </Link>
                      <span className={cn(typography.caption, "text-ortaq-ink-soft")}>{t(`discovery.workspace.introStatus.${intro.status}`)}</span>
                    </div>
                    <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-muted")}>{intro.note}</p>
                  </li>
                );
              })}
            </ul>
          )}

          <Link href="/kesfet" className="mt-8 inline-flex min-h-10 items-center rounded-ortaq-md bg-ortaq-ink px-4 text-[0.8125rem] font-semibold text-ortaq-cream">
            {t("discovery.home.ctaPrimary")}
          </Link>
        </Container>
      </section>
    </>
  );
}
