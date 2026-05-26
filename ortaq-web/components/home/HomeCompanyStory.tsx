"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ImmersiveImage } from "@/components/media/ImmersiveImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/ui/Section";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { karatParcaKonya } from "@/lib/campaigns/karat-parca-konya";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/** Step 4 — deep company narrative immersion */
export function HomeCompanyStory() {
  const { t } = useTranslation();
  const c = karatParcaKonya;

  return (
    <section id="sirketler" className="bg-ortaq-bg">
      <ImmersiveImage
        src={media.factoryDetail.src}
        alt={t("media.factoryDetail.alt")}
        credit={t("media.credit", { source: media.factoryDetail.credit })}
        caption={t("homeStory.imageCaption")}
        focalPoint={media.factoryDetail.focalPoint}
        variant="tall"
      />

      <Container wide className="py-14 sm:py-20 lg:py-24">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="illustrative" />
            <VerificationLabel label={c.verificationLabel} />
          </div>
          <p className={cn(typography.kicker, "mt-6")}>{t("homeStory.label")}</p>
          <h2 className={cn(typography.editorial, "mt-3 max-w-[16ch] sm:max-w-none")}>
            {c.tradeName}
          </h2>
          <p className={cn(typography.caption, "mt-2")}>
            {c.city} · {c.sector}
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <FadeIn className="lg:col-span-7 space-y-7">
            <p className={cn(typography.prose, "editorial-rhythm")}>{c.story.origin}</p>
            <p className={cn(typography.prose, "editorial-rhythm")}>{c.story.today}</p>
            <p className={cn(typography.body, "text-ortaq-ink-soft")}>{c.story.production}</p>
          </FadeIn>

          <FadeIn delay={100} className="lg:col-span-5">
            <dl className="space-y-6 border-t border-ortaq-border pt-6">
              <div>
                <dt className={typography.caption}>{t("homeStory.founded")}</dt>
                <dd className={cn(typography.body, "mt-1 text-ortaq-ink")}>{c.founded}</dd>
              </div>
              <div>
                <dt className={typography.caption}>{t("homeStory.employees")}</dt>
                <dd className={cn(typography.body, "mt-1 text-ortaq-ink")}>{c.employees}</dd>
              </div>
              <div>
                <dt className={typography.caption}>{t("homeStory.exports")}</dt>
                <dd className={cn(typography.body, "mt-1 text-ortaq-ink")}>
                  {c.exportMarkets.slice(0, 4).join(" · ")}
                </dd>
              </div>
              <div>
                <dt className={typography.caption}>{t("homeStory.funding")}</dt>
                <dd className={cn(typography.body, "mt-1 text-ortaq-ink")}>{c.funding.purpose}</dd>
              </div>
            </dl>

            <blockquote className={cn(typography.bodySm, "mt-10 border-l border-ortaq-border-strong pl-4 text-ortaq-ink-muted")}>
              &ldquo;{c.founder.note}&rdquo;
              <footer className={cn(typography.caption, "mt-3")}>
                {c.founder.name} — {c.founder.role}
              </footer>
            </blockquote>
          </FadeIn>
        </div>

        <FadeIn delay={160} className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/sirket/${c.slug}`}
            className={cn(
              typography.bodySm,
              "inline-flex min-h-11 items-center border border-ortaq-ink px-5 text-ortaq-ink transition-colors hover:bg-ortaq-ink hover:text-ortaq-cream",
            )}
          >
            {t("homeStory.cta")}
          </Link>
          <Link href="/sirketler" className={cn(typography.bodySm, typography.link, "min-h-11 inline-flex items-center")}>
            {t("homeStory.allCompanies")}
          </Link>
        </FadeIn>
      </Container>

      <ImmersiveImage
        src={media.packagingFloor.src}
        alt={t("media.packagingFloor.alt")}
        focalPoint={media.packagingFloor.focalPoint}
        variant="full"
        parallax
      />
    </section>
  );
}
