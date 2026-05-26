"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import type { CampaignDocument } from "@/lib/campaigns/types";
import { DossierSection } from "@/components/dossier/DossierSection";
import { Button } from "@/components/ui/Button";
import { isCompanySaved, toggleSavedCompany } from "@/lib/member/storage";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const docStatusStyles: Record<CampaignDocument["status"], string> = {
  available: "bg-ortaq-trust-soft text-ortaq-trust",
  review: "bg-ortaq-bg-warm text-ortaq-ink-muted",
  pending: "bg-ortaq-bg-alt text-ortaq-ink-soft",
};

type DossierDocumentsProps = {
  campaign: SimulatedCampaign;
};

export function DossierDocuments({ campaign: c }: DossierDocumentsProps) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isCompanySaved(c.slug));
  }, [c.slug]);

  const reviewed = c.documents.filter((d) => d.status === "available");
  const inReview = c.documents.filter((d) => d.status === "review");
  const pending = c.documents.filter((d) => d.status === "pending");

  return (
    <>
      <DossierSection
        id="documents"
        label={t("dossier.documents.label")}
        title={t("dossier.documents.title")}
        tier="secondary"
        collapsible
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <EvidenceSummary count={reviewed.length} label={t("dossier.documents.reviewed")} tone="trust" />
          <EvidenceSummary count={inReview.length} label={t("dossier.documents.inReview")} tone="warm" />
          <EvidenceSummary count={pending.length} label={t("dossier.documents.pending")} tone="muted" />
        </div>

        <div className="mt-4 overflow-hidden rounded-ortaq-md border border-ortaq-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ortaq-border bg-ortaq-bg-alt">
                <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.documents.item")}</th>
                <th className={cn(typography.caption, "px-3 py-2 font-medium")}>{t("dossier.documents.status")}</th>
                <th className={cn(typography.caption, "hidden px-3 py-2 font-medium sm:table-cell")}>
                  {t("dossier.documents.note")}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.documents.map((doc) => (
                <tr key={doc.id} className="border-b border-ortaq-border last:border-0">
                  <td className={cn(typography.bodySm, "px-3 py-2.5")}>{doc.title}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "inline-block rounded-ortaq-sm px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide",
                        docStatusStyles[doc.status],
                      )}
                    >
                      {t(`dossier.documents.statuses.${doc.status}`)}
                    </span>
                  </td>
                  <td className={cn(typography.caption, "hidden px-3 py-2.5 sm:table-cell")}>
                    {doc.note ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={cn(typography.caption, "mt-3")}>{t("dossier.documents.disclaimer")}</p>
      </DossierSection>

      <section className="border-b border-ortaq-border py-5 sm:py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <Button
            type="button"
            variant={saved ? "dark" : "secondary"}
            onClick={() => setSaved(toggleSavedCompany(c.slug, c.tradeName))}
          >
            {saved ? t("dossier.actions.saved") : t("dossier.actions.track")}
          </Button>
          <Link href="/degerlendirme">
            <Button variant="ghost">{t("dossier.actions.criteria")}</Button>
          </Link>
          <Link href="/sirketler">
            <Button variant="ghost">{t("dossier.actions.back")}</Button>
          </Link>
        </div>
        <p className={cn(typography.caption, "mx-auto mt-3 max-w-6xl px-4 sm:px-6 lg:px-8")}>
          {t("dossier.actions.footer")}
        </p>
      </section>
    </>
  );
}

function EvidenceSummary({
  count,
  label,
  tone,
}: {
  count: number;
  label: string;
  tone: "trust" | "warm" | "muted";
}) {
  const bg = {
    trust: "bg-ortaq-trust-soft/60",
    warm: "bg-ortaq-bg-warm",
    muted: "bg-ortaq-bg-alt",
  };
  return (
    <div className={cn("rounded-ortaq-md border border-ortaq-border px-3 py-2.5 text-center", bg[tone])}>
      <p className={typography.metric}>{count}</p>
      <p className={cn(typography.caption, "mt-0.5")}>{label}</p>
    </div>
  );
}
