"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { DocumentaryImage } from "@/components/media/DocumentaryImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function InstitutionalHero() {
  const { t } = useTranslation();
  const m = media.heroExportPartnership;

  return (
    <section className="border-b border-ortaq-border bg-ortaq-bg">
      <Container wide className="py-10 sm:py-14">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          <div className="lg:col-span-5">
            <p className={cn(typography.label, "text-ortaq-ink-soft")}>{t("home.institutional.eyebrow")}</p>
            <h1 className="mt-3 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ortaq-ink sm:text-[2.25rem]">
              {t("home.institutional.headline")}
            </h1>
            <p className={cn(typography.body, "mt-4 max-w-lg")}>
              {t("home.institutional.lead")}
            </p>
            <p className={cn(typography.bodySm, "mt-4 max-w-lg text-ortaq-ink")}>{t("home.institutional.body")}</p>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link href="/kesfet">
                <Button size="lg" fullWidth className="sm:w-auto sm:min-w-[11rem]">
                  {t("home.institutional.ctaPrimary")}
                </Button>
              </Link>
              <Link href="/nasil-calisir">
                <Button variant="secondary" size="lg" fullWidth className="sm:w-auto sm:min-w-[11rem]">
                  {t("home.institutional.ctaSecondary")}
                </Button>
              </Link>
            </div>

            <p className={cn(typography.caption, "mt-6 max-w-md leading-relaxed text-ortaq-ink-soft")}>
              {t("home.institutional.disclaimer")}
            </p>
          </div>

          <div className="mt-10 lg:col-span-7 lg:mt-2">
            <DocumentaryImage
              src={m.src}
              alt={t("media.heroExportPartnership.alt")}
              credit={t("media.credit", { source: m.credit })}
              focalPoint={m.focalPoint}
              aspect={m.aspect}
              bleedMobile
              stockLabel={t("trust.status.illustrative")}
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
