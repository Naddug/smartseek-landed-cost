"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Settings, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isDossierClosed,
  isDossierOpenForInterest,
} from "@/lib/dossier/viewer-context";
import { partnerApplyLoginHref } from "@/lib/auth/routes";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import type {
  DossierViewerContext,
  PublicDossierDetail,
} from "@/types/dossier-detail";

const boxBase =
  "overflow-hidden rounded-xl border shadow-ortaq-md";

interface DossierCTABoxProps {
  dossier: PublicDossierDetail;
  viewer: DossierViewerContext;
  applyIntent?: boolean;
}

export function DossierCTABox({
  dossier,
  viewer,
  applyIntent = false,
}: DossierCTABoxProps) {
  const router = useRouter();
  const ctaRef = useRef<HTMLDivElement>(null);
  const [localApplied, setLocalApplied] = useState(false);
  const closed = isDossierClosed(dossier);
  const open = isDossierOpenForInterest(dossier);
  const interestState = viewer.interestState ?? "none";
  const hasApplied = interestState === "applied" || localApplied;

  function handleApply() {
    setLocalApplied(true);
    router.push(`/panel/eslesmelerim?applied=${dossier.id}`);
  }

  function handleLoginInterest() {
    router.push(partnerApplyLoginHref(dossier.slug));
  }

  useEffect(() => {
    if (!applyIntent || !viewer.isAuthenticated || hasApplied || closed) return;
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [applyIntent, viewer.isAuthenticated, hasApplied, closed]);

  if (viewer.isOwner) {
    return (
      <div className={cn(boxBase, "border-ortaq-line bg-ortaq-surface")}>
        <div className="border-b border-ortaq-line bg-ortaq-surface-alt px-5 py-3">
          <p className="type-meta text-ortaq-navy">{ORTAQ_COPY.dossier.ownerPanelTitle}</p>
        </div>
        <div className="p-5">
          <p className="text-sm font-semibold text-ortaq-navy">
            {ORTAQ_COPY.dossier.ownerPanelHeadline}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ortaq-text-secondary">
            {ORTAQ_COPY.dossier.ownerPanelDescription}
          </p>
          <Link
            href={`/panel/firsatlarim/${dossier.id}`}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ortaq-navy px-4 text-sm font-semibold text-white hover:bg-ortaq-navy/90"
          >
            <Settings className="h-4 w-4" />
            {ORTAQ_COPY.ctas.manageDossier}
          </Link>
        </div>
      </div>
    );
  }

  if (closed) {
    return (
      <div className={cn(boxBase, "border-ortaq-line bg-ortaq-surface-alt")}>
        <div className="p-5">
          <p className="text-sm font-semibold text-ortaq-navy">
            {ORTAQ_COPY.dossier.closedHeadline}
          </p>
          <p className="mt-1 text-xs text-ortaq-text-secondary">
            {ORTAQ_COPY.dossier.closedDescription}
          </p>
          <Link
            href="/firsatlar"
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg border border-ortaq-line bg-white text-sm font-semibold text-ortaq-navy hover:bg-ortaq-surface-alt"
          >
            {ORTAQ_COPY.ctas.backToArchive}
          </Link>
        </div>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className={cn(boxBase, "border-emerald-200 bg-emerald-50")}>
        <div className="p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                {ORTAQ_COPY.dossier.applicationSent}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                {ORTAQ_COPY.dossier.applicationSentHint}
              </p>
            </div>
          </div>
          <Link
            href="/panel/eslesmelerim"
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            {ORTAQ_COPY.ctas.viewMatches}
          </Link>
        </div>
      </div>
    );
  }

  if (!viewer.isAuthenticated) {
    return (
      <div ref={ctaRef} className={cn(boxBase, "border-blue-200 bg-white")}>
        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
          <p className="font-heading text-base font-semibold text-white">
            {ORTAQ_COPY.ctas.apply}
          </p>
          <p className="mt-1 text-xs text-blue-100">
            {dossier.desiredPartner}
          </p>
        </div>
        <div className="p-5">
          <p className="text-sm text-ortaq-text-secondary">
            {ORTAQ_COPY.dossier.applyLoginHint}
          </p>
          <button
            type="button"
            onClick={handleLoginInterest}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-ortaq-sm hover:bg-blue-700"
          >
            {ORTAQ_COPY.dossier.applyLoginCta}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (open && viewer.isAuthenticated && !viewer.isOwner) {
    return (
      <div ref={ctaRef} className={cn(boxBase, "border-blue-200 bg-white")}>
        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
          <p className="font-heading text-base font-semibold text-white">
            {ORTAQ_COPY.dossier.applyAuthenticatedTitle}
          </p>
        </div>
        <div className="p-5">
          <p className="text-sm text-ortaq-text-secondary">
            {ORTAQ_COPY.dossier.applyAuthenticatedHint}
          </p>
          <button
            type="button"
            onClick={handleApply}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-ortaq-sm hover:bg-blue-700"
          >
            {ORTAQ_COPY.ctas.apply}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(boxBase, "border-ortaq-line bg-ortaq-surface-alt")}>
      <div className="p-5">
        <p className="text-sm text-ortaq-text-secondary">
          {ORTAQ_COPY.dossier.unavailableDescription}
        </p>
        <Link
          href="/firsatlar"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg border border-ortaq-line bg-white text-sm font-semibold text-ortaq-navy"
        >
          {ORTAQ_COPY.ctas.browseOtherDossiers}
        </Link>
      </div>
    </div>
  );
}
