"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Pencil, Archive, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  detailStatusLabel,
  detailStatusVariant,
} from "@/lib/dossier/detail-status";
import { DossierStructuredSummary } from "@/components/opportunity/DossierStructuredSummary";
import { DossierDetailHero } from "@/components/opportunity/DossierDetailHero";
import { DossierTrustPanel } from "@/components/opportunity/DossierTrustPanel";
import { ModerationNoteCard } from "@/components/panel/ModerationNoteCard";
import { InboundInterestList } from "@/components/panel/InboundInterestList";
import type { InboundInterest, PublicDossierDetail } from "@/types/dossier-detail";

interface DossierManagementPageProps {
  dossier: PublicDossierDetail;
  inbound: InboundInterest[];
  panelDossierId: string;
}

export function DossierManagementPage({
  dossier,
  inbound,
  panelDossierId,
}: DossierManagementPageProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const isDraft = dossier.status === "draft";
  const isPublished =
    dossier.status === "published" || dossier.status === "matched";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ortaq-text-muted">
                {dossier.refCode}
              </p>
              <h1 className="font-heading text-xl font-semibold text-ortaq-navy md:text-2xl">
                Dosya yönetimi
              </h1>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ortaq-line bg-ortaq-surface px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={previewMode}
                onChange={(e) => setPreviewMode(e.target.checked)}
                className="rounded border-ortaq-line"
              />
              <span className="text-ortaq-navy">Ortak gözüyle önizle</span>
            </label>
          </div>

          {previewMode ? (
            <div className="rounded-xl border border-ortaq-line bg-white p-6 md:p-8">
              <DossierDetailHero dossier={dossier} />
              <div className="mt-8">
                <DossierStructuredSummary dossier={dossier} />
              </div>
              <Link
                href={`/firsatlar/${dossier.slug}`}
                target="_blank"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ortaq-action hover:underline"
              >
                Canlı sayfayı aç
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-6">
              <h2 className="font-heading text-lg font-semibold text-ortaq-navy">
                {dossier.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ortaq-text-muted">
                {dossier.summary}
              </p>
              <div className="mt-6">
                <DossierStructuredSummary dossier={dossier} />
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge
                label={detailStatusLabel(dossier.status)}
                variant={detailStatusVariant(dossier.status)}
                className="text-sm"
              />
              <span className="font-mono text-[10px] text-ortaq-text-muted">
                {dossier.refCode}
              </span>
            </div>

            {isDraft && (
              <div className="mt-4 rounded-lg border border-ortaq-warning/30 bg-ortaq-warning/5 p-4">
                <p className="text-sm font-medium text-ortaq-navy">
                  Taslak — yayına hazır değil
                </p>
                <p className="mt-1 text-xs text-ortaq-text-muted">
                  Eksik alanları tamamlayıp incelemeye gönderin.
                </p>
                <Link
                  href={`/onboarding/firsat-sahibi?edit=${panelDossierId}`}
                  className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg bg-ortaq-action text-sm font-medium text-white hover:bg-ortaq-action/90"
                >
                  Taslağı tamamla
                </Link>
              </div>
            )}

            <ModerationNoteCard dossier={dossier} />

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/onboarding/firsat-sahibi?edit=${panelDossierId}`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-ortaq-action px-4 text-sm font-medium text-white hover:bg-ortaq-action/90"
              >
                <Pencil className="h-3.5 w-3.5" />
                Dosyayı Düzenle
              </Link>

              {isPublished && (
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-ortaq-line bg-ortaq-surface px-4 text-sm font-medium text-ortaq-navy hover:bg-ortaq-surface-alt"
                >
                  <Archive className="h-3.5 w-3.5" />
                  Yayından Kaldır
                </button>
              )}

              <Link
                href={`/firsatlar/${dossier.slug}`}
                target="_blank"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-ortaq-line bg-ortaq-surface px-4 text-sm font-medium text-ortaq-navy hover:bg-ortaq-surface-alt"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Herkese açık sayfa
              </Link>

              {isDraft && (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-dashed border-ortaq-line px-4 text-sm text-ortaq-text-muted"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
              )}
            </div>
          </div>

          <DossierTrustPanel dossier={dossier} />
        </aside>
      </div>

      <InboundInterestList items={inbound} />
    </div>
  );
}
