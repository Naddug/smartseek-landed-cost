"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ImmersiveImage } from "@/components/media/ImmersiveImage";
import { OperationalFeed } from "@/components/operations/FieldJournal";
import { TraceField } from "@/components/operations/TraceField";
import { FadeIn } from "@/components/ui/FadeIn";
import { LayerReveal } from "@/components/ui/LayerReveal";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { karatParcaKonya } from "@/lib/campaigns/karat-parca-konya";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomeCompanyAccess() {
  const { t } = useTranslation();
  const c = karatParcaKonya;

  return (
    <section id="sirketler" className="bg-ortaq-bg">
      <LayerReveal depth="03" label={t("homeAccessCo.layerLabel")} className="pt-12 sm:pt-16">
        <FadeIn className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="signal-pulse h-1.5 w-1.5 rounded-full bg-ortaq-gold" aria-hidden />
              <span className={cn(typography.caption, "text-ortaq-gold")}>
                {t(`homeAccessCo.status.${c.access.status}`)}
              </span>
            </span>
            <VerificationLabel label={c.verificationLabel} />
          </div>
          <h2 className={cn(typography.editorial, "mt-5")}>{c.tradeName}</h2>
          <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-soft")}>
            {c.city} · {c.sector}
          </p>
        </FadeIn>
        <TraceField layer="company" variant="stamp" className="mt-5" />
      </LayerReveal>

      <div className="relative mt-6">
        <ImmersiveImage
          src={media.factoryDetail.src}
          alt={t("media.factoryDetail.alt")}
          focalPoint="48% 52%"
          variant="tall"
          cropIntensity="raw"
          density="heavy"
        />

        <FadeIn className="layer-overlap relative z-10 mx-2 sm:mx-6 lg:mx-auto lg:max-w-6xl">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="bg-ortaq-cream/96 px-5 py-7 shadow-[3px_4px_0_rgb(15_14_12_/0.04)] backdrop-blur-sm sm:px-8 sm:py-9 lg:col-span-6 lg:-mr-20 lg:mt-20 xl:col-span-5">
              <p className={cn("desire-whisper text-ortaq-ink")}>{t("homeAccessCo.hook")}</p>

              <ul className="mt-6 space-y-2 border-t border-ortaq-border pt-5">
                {c.bottlenecks.slice(0, 2).map((b) => (
                  <li key={b.label} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                    <span className="text-ortaq-ink">{b.label}:</span> {b.note}
                  </li>
                ))}
              </ul>

              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ortaq-border pt-5">
                {c.operations.signals.slice(0, 4).map((s) => (
                  <div key={s.label}>
                    <dt className={typography.caption}>{s.label}</dt>
                    <dd className={cn(typography.bodySm, "mt-0.5 text-ortaq-ink")}>{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 border-t border-ortaq-border pt-4">
                <OperationalFeed updates={c.operationalUpdates.slice(0, 2)} />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn className="px-4 pb-12 pt-8 sm:px-6 sm:pb-16 lg:px-8">
        <blockquote className={cn(typography.bodySm, "max-w-prose border-l-2 border-ortaq-gold/40 pl-4 text-ortaq-ink-muted")}>
          {c.fieldJournal.find((e) => e.type === "founder")?.text}
          <footer className={cn(typography.caption, "mt-2")}>{c.founder.name}</footer>
        </blockquote>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/sirket/${c.slug}`}
            className={cn(
              typography.bodySm,
              "inline-flex min-h-11 items-center bg-ortaq-ink px-6 text-ortaq-cream",
            )}
          >
            {t("homeAccessCo.cta")}
          </Link>
          <Link href="/sirketler" className={cn(typography.bodySm, typography.link, "min-h-11 inline-flex items-center")}>
            {t("homeAccessCo.all")} →
          </Link>
        </div>
      </FadeIn>

      <ImmersiveImage
        src={media.packagingFloor.src}
        alt={t("media.packagingFloor.alt")}
        focalPoint="50% 45%"
        variant="texture"
        cropIntensity="raw"
        density="heavy"
        parallax
      />
    </section>
  );
}
