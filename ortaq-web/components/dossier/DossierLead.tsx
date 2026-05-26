"use client";

import { useTranslation } from "react-i18next";
import type { SimulatedCampaign, InspectionLayer } from "@/lib/campaigns/types";
import { Container } from "@/components/ui/Section";
import { getOperationalSignal } from "@/lib/product/company-summary";
import { getCampaignTensionLine } from "@/lib/intelligence/tension";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * The 30-60 second comprehension block.
 *
 * Single dense section below DossierHeader containing every "above-the-fold"
 * signal in one composed view:
 *
 *   - Operational signals (6-cell grid)
 *   - Critical bottlenecks (promoted from soft callout in old DossierSnapshot)
 *   - Top 3 structural risks (compressed, full list lives in DossierRisks)
 *   - Verification layer strip (was duplicated across DossierReview + Documents)
 *
 * No description prose. No section chrome (sits between Header and the
 * collapsible tier-1 sections that follow).
 */

const layerStatusStyles: Record<InspectionLayer["status"], string> = {
  pending: "border-ortaq-border bg-ortaq-bg-alt text-ortaq-ink-soft",
  partial: "border-ortaq-accent/30 bg-ortaq-bg-warm text-ortaq-ink-muted",
  done: "border-ortaq-trust/30 bg-ortaq-trust-soft text-ortaq-trust",
};

const layerStatusDot: Record<InspectionLayer["status"], string> = {
  pending: "bg-ortaq-border-strong",
  partial: "bg-ortaq-accent",
  done: "bg-ortaq-trust",
};

type DossierLeadProps = {
  campaign: SimulatedCampaign;
};

export function DossierLead({ campaign: c }: DossierLeadProps) {
  const { t } = useTranslation();
  const capacity = getOperationalSignal(c, "kapasite", "capacity");
  const exportShare = getOperationalSignal(c, "ihracat", "export");
  const tension = getCampaignTensionLine(c);

  return (
    <section
      id="snapshot"
      aria-label={t("dossier.lead.aria")}
      className="border-b border-ortaq-border bg-ortaq-surface scroll-mt-[7.5rem] sm:scroll-mt-24"
    >
      <Container wide>
        <div className="intel-tension-banner mt-5 sm:mt-6">
          <p className={typography.label}>{t("dossier.lead.primaryTension")}</p>
          <p className={cn(typography.body, "mt-1 font-medium text-ortaq-ink")}>{tension}</p>
        </div>

        <div className="grid gap-5 pb-5 pt-4 sm:pb-6 sm:pt-5 lg:grid-cols-[1.2fr_1fr_0.9fr] lg:gap-6">
          {/* Column 1 — operational signals */}
          <div className="min-w-0">
            <p className={typography.label}>{t("dossier.lead.signalsLabel")}</p>
            <h2 className={cn(typography.h2, "mt-1")}>
              {t("dossier.lead.signalsTitle")}
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {c.operations.signals.map((s) => (
                <div
                  key={s.label}
                  className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt/40 px-2.5 py-2"
                >
                  <dt className={typography.caption}>{s.label}</dt>
                  <dd className={cn(typography.bodySm, "mt-0.5 font-medium text-ortaq-ink tabular-nums")}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className={cn(typography.caption, "mt-3")}>
              {capacity?.value && exportShare?.value
                ? t("dossier.snapshot.footnote", { capacity: capacity.value, export: exportShare.value })
                : t("dossier.snapshot.footnoteGeneric")}
            </p>
          </div>

          {/* Column 2 — bottlenecks + top 3 risks */}
          <div className="min-w-0 lg:border-l lg:border-ortaq-border lg:pl-6">
            <p className={typography.label}>{t("dossier.lead.tensionLabel")}</p>
            <h2 className={cn(typography.h2, "mt-1")}>{t("dossier.lead.tensionTitle")}</h2>

            {c.bottlenecks.length > 0 && (
              <div className="mt-3">
                <p className={cn(typography.caption, "font-medium text-ortaq-accent")}>
                  {t("dossier.lead.bottlenecks")}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {c.bottlenecks.slice(0, 3).map((b) => (
                    <li
                      key={b.label}
                      className="rounded-ortaq-sm border border-ortaq-accent/20 bg-ortaq-bg-warm/40 px-2.5 py-2"
                    >
                      <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{b.label}</p>
                      <p className={cn(typography.caption, "mt-0.5 line-clamp-2 text-ortaq-ink-muted")}>
                        {b.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.risks.length > 0 && (
              <div className="mt-3">
                <p className={cn(typography.caption, "font-medium text-ortaq-ink-muted")}>
                  {t("dossier.lead.topRisks")}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {c.risks.slice(0, 3).map((r) => (
                    <li
                      key={r.title}
                      className="rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-2.5 py-2"
                    >
                      <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{r.title}</p>
                      <p className={cn(typography.caption, "mt-0.5 line-clamp-2 text-ortaq-ink-muted")}>
                        {r.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href="#risks"
              className={cn(typography.caption, "mt-2 inline-block text-ortaq-ink hover:underline")}
            >
              {t("dossier.lead.allRisks")} →
            </a>
          </div>

          {/* Column 3 — verification strip */}
          <div className="min-w-0 lg:border-l lg:border-ortaq-border lg:pl-6">
            <p className={typography.label}>{t("dossier.lead.verifyLabel")}</p>
            <h2 className={cn(typography.h2, "mt-1")}>{t("dossier.lead.verifyTitle")}</h2>

            <ul className="mt-3 space-y-1.5">
              {c.inspectionLayers.map((layer) => (
                <li
                  key={layer.layer}
                  className={cn(
                    "rounded-ortaq-sm border px-2.5 py-1.5",
                    layerStatusStyles[layer.status],
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", layerStatusDot[layer.status])}
                    />
                    <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{layer.layer}</p>
                    <span className="ml-auto text-[0.625rem] font-medium uppercase tracking-wide">
                      {t(`dossier.review.layerStatus.${layer.status}`)}
                    </span>
                  </div>
                  <p className={cn(typography.caption, "mt-0.5 line-clamp-2 text-ortaq-ink-muted")}>
                    {layer.note}
                  </p>
                </li>
              ))}
            </ul>

            <a
              href="#review"
              className={cn(typography.caption, "mt-2 inline-block text-ortaq-ink hover:underline")}
            >
              {t("dossier.lead.fullTimeline")} →
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
