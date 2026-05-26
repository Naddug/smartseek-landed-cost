"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import {
  EDUCATION_PAGES,
  getMemberState,
  type MemberState,
} from "@/lib/member/storage";
import { formatPulseDate, operationalPulse } from "@/lib/operations/pulse";
import { useEffect, useState, type ReactNode } from "react";

const PROCESS_ITEMS = ["platform", "transactions", "campaign"] as const;

export function TrustDashboardView() {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState<MemberState | null>(null);
  const locale = i18n.language === "en" ? "en-GB" : "tr-TR";

  useEffect(() => {
    setState(getMemberState());
  }, []);

  const onboardingDone = Boolean(state?.onboardingCompletedAt);
  const readCount = EDUCATION_PAGES.filter((p) =>
    state?.pagesRead.includes(p.path),
  ).length;
  const allRead = readCount === EDUCATION_PAGES.length;

  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <p className={typography.kicker}>{t("memberArea.label")}</p>
          <h1 className={cn(typography.h1, "mt-3")}>{t("memberArea.title")}</h1>
          <p className={cn(typography.lead, "mt-4 max-w-prose")}>
            {t("memberArea.subtitle")}
          </p>
          {state?.visitedAt && (
            <p className={cn(typography.caption, "mt-4")}>
              {t("memberArea.lastVisit", {
                date: formatPulseDate(state.visitedAt.slice(0, 10), locale),
              })}
            </p>
          )}
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container narrow className="space-y-4">
          <DashboardCard title={t("memberArea.overview.title")}>
            <div className="space-y-4">
              <Row
                label={t("memberArea.onboarding.title")}
                value={
                  onboardingDone
                    ? t("memberArea.status.complete")
                    : t("memberArea.status.inProgress")
                }
                done={onboardingDone}
              />
              <Row
                label={t("memberArea.education.title")}
                value={t("memberArea.education.progress", {
                  done: readCount,
                  total: EDUCATION_PAGES.length,
                })}
                done={allRead}
              />
              {!onboardingDone && (
                <Link href="/basla" className="mt-2 inline-block">
                  <Button size="sm" variant="secondary">
                    {t("memberArea.onboarding.cta")}
                  </Button>
                </Link>
              )}
              {!allRead && (
                <ul className="mt-3 space-y-1 border-t border-ortaq-border pt-3">
                  {EDUCATION_PAGES.filter((p) => !state?.pagesRead.includes(p.path)).map(
                    ({ path, key }) => (
                      <li key={path}>
                        <Link href={path} className={cn(typography.bodySm, typography.link)}>
                          {t(`memberArea.education.items.${key}`)}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}
              <p className={cn(typography.caption, "border-t border-ortaq-border pt-4")}>
                {t("memberArea.reminders.items.1")}
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title={t("memberArea.process.title")}>
            <ul className="divide-y divide-ortaq-border border-y border-ortaq-border">
              {PROCESS_ITEMS.map((key) => (
                <li
                  key={key}
                  className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <span className={typography.bodySm}>
                    {t(`memberArea.process.items.${key}.label`)}
                  </span>
                  <span className={cn(typography.caption, "shrink-0 text-right")}>
                    {t(`memberArea.process.items.${key}.status`)}
                  </span>
                </li>
              ))}
            </ul>
          </DashboardCard>

          {(state?.savedCompanies.length ?? 0) > 0 && (
            <DashboardCard title={t("memberArea.saved.title")}>
              <ul className="divide-y divide-ortaq-border border-y border-ortaq-border">
                {state!.savedCompanies.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/sirket/${c.slug}`}
                      className="flex min-h-11 items-center py-2"
                    >
                      <span className={typography.bodySm}>{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          )}

          <DashboardCard title={t("memberArea.updates.title")}>
            <ul className="divide-y divide-ortaq-border border-y border-ortaq-border">
              {operationalPulse.notes.map((note) => (
                <li key={note.id} className="py-3.5 first:pt-0 last:pb-0">
                  <time dateTime={note.date} className={typography.caption}>
                    {formatPulseDate(note.date, locale)}
                  </time>
                  <p className={cn(typography.bodySm, "mt-1")}>
                    {t(`pulse.notes.${note.key}`)}
                  </p>
                </li>
              ))}
            </ul>
            <p className={cn(typography.caption, "mt-4")}>
              {t("pulse.lastUpdated", {
                date: formatPulseDate(operationalPulse.siteLastUpdated, locale),
              })}
            </p>
          </DashboardCard>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            {!allRead && (
              <Link href="/nasil-calisir">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                  {t("memberArea.continueReading")}
                </Button>
              </Link>
            )}
            <Link href="/sirket/karat-parca-konya">
              <span className={cn(typography.bodySm, typography.link, "inline-flex min-h-11 items-center")}>
                {t("memberArea.saved.browse")}
              </span>
            </Link>
          </div>

          <p className={cn(typography.caption, "pb-4")}>{t("memberArea.footer")}</p>
        </Container>
      </Section>
    </PublicShell>
  );
}

function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-ortaq-sm border border-ortaq-border bg-white p-5 sm:p-6">
      <h2 className={typography.h3}>{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  done,
}: {
  label: string;
  value: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={typography.bodySm}>{label}</span>
      <span
        className={cn(
          "text-xs tabular-nums",
          done ? "text-ortaq-trust" : "text-ortaq-ink-soft",
        )}
      >
        {value}
      </span>
    </div>
  );
}
