import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@ortaq/components/ui/Button";
import { Container } from "@ortaq/components/ui/Section";
import { TrustStrip } from "@ortaq/components/layout/TrustStrip";
import { LicenseBadge } from "@ortaq/components/trust/LicenseBadge";
import { DocumentaryImage } from "@ortaq/components/media/DocumentaryImage";
import { media } from "@ortaq/lib/media";
import { typography } from "@ortaq/design/typography";
import { cn } from "@ortaq/lib/cn";

export function HeroSection() {
  const { t } = useTranslation();
  const m = media.industrialLine;

  return (
    <>
      <section className="bg-ortaq-bg pt-8 pb-4 sm:pt-10 sm:pb-6 lg:pt-12 lg:pb-8">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <div className="lg:col-span-5 lg:pt-2">
              <LicenseBadge className="mb-6" compact />

              <h1 className={typography.h1}>{t("hero.title")}</h1>
              <p className={cn(typography.lead, "mt-5")}>{t("hero.subtitle")}</p>
              <p className={cn(typography.bodySm, "mt-4 text-ortaq-ink-soft")}>{t("hero.body")}</p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Link href="/#nasil-calisir">
                  <Button size="lg" fullWidth className="sm:w-auto sm:min-w-[11rem]">
                    {t("hero.primaryCta")}
                  </Button>
                </Link>
                <Link href="/guven">
                  <Button variant="secondary" size="lg" fullWidth className="sm:w-auto sm:min-w-[11rem]">
                    {t("hero.secondaryCta")}
                  </Button>
                </Link>
              </div>

              <p className={cn(typography.caption, "mt-6 max-w-sm")}>{t("hero.note")}</p>
            </div>

            <div className="mt-10 lg:col-span-7 lg:mt-0 lg:pt-1">
              <DocumentaryImage
                src={m.src}
                alt={t("media.industrialLine.alt")}
                credit={t("media.credit", { source: m.credit })}
                focalPoint={m.focalPoint}
                aspect={m.aspect}
                bleedMobile
                stockLabel={t("trust.status.illustrative")}
              />
            </div>
          </div>
        </Container>
      </section>
      <TrustStrip />
    </>
  );
}
