"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { TeamGrid } from "@/components/team/TeamGrid";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Ana sayfada kurucu ekibi görünür; tam profil `/ekip`. */
export function HomepageTeam() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg-alt" aria-label={t("teamPage.home.aria")}>
      <Container wide className="py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("teamPage.home.label")}</p>
            <h2 className="mt-2 text-[1.5rem] font-semibold leading-[1.12] tracking-[-0.02em] text-ortaq-ink sm:text-[1.75rem]">
              {t("teamPage.home.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink-muted")}>{t("teamPage.home.lead")}</p>
          </div>
          <Link href="/ekip" className={cn(typography.bodySm, typography.link, "shrink-0 font-semibold")}>
            {t("teamPage.home.link")} →
          </Link>
        </div>

        <div className="mt-8">
          <TeamGrid compact showIntro={false} />
        </div>

        <p className={cn(typography.caption, "mt-6 text-ortaq-ink-soft")}>{t("homeLanding.founder.status")}</p>
      </Container>
    </section>
  );
}
