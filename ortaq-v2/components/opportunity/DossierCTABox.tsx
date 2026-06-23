"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isDossierClosed,
  isDossierOpenForInterest,
} from "@/lib/dossier/viewer-context";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import type {
  DossierViewerContext,
  PublicDossierDetail,
} from "@/types/dossier-detail";

interface DossierCTABoxProps {
  dossier: PublicDossierDetail;
  viewer: DossierViewerContext;
}

export function DossierCTABox({ dossier, viewer }: DossierCTABoxProps) {
  const router = useRouter();
  const [localApplied, setLocalApplied] = useState(false);
  const closed = isDossierClosed(dossier);
  const open = isDossierOpenForInterest(dossier);
  const interestState = viewer.interestState ?? "none";
  const hasApplied = interestState === "applied" || localApplied;

  const returnUrl = `/firsatlar/${dossier.slug}`;

  function handleApply() {
    setLocalApplied(true);
    router.push(`/panel/eslesmelerim?applied=${dossier.id}`);
  }

  function handleLoginInterest() {
    router.push(`/giris?next=${encodeURIComponent(returnUrl)}`);
  }

  if (viewer.isOwner) {
    return (
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
        <p className="text-sm font-medium text-stone-800">Bu sizin dosyanız</p>
        <p className="mt-1 text-xs leading-relaxed text-stone-500">
          Ortaklar bu sayfadan ilgi gösterir. Durum, başvurular ve düzenleme
          panelden yönetilir.
        </p>
        <Link
          href={`/panel/firsatlarim/${dossier.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800"
        >
          <Settings className="h-4 w-4" />
          Dosyayı Yönet
        </Link>
      </div>
    );
  }

  if (closed) {
    return (
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
        <p className="text-sm font-medium text-stone-800">
          Bu fırsat artık açık değil
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Dosya arşivlendi, eşleşti veya kapatıldı. Benzer fırsatlar için arşive
          göz atın.
        </p>
        <Link
          href="/firsatlar"
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 hover:bg-stone-50"
        >
          {ORTAQ_COPY.ctas.backToArchive}
        </Link>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div
        className={cn(
          "rounded-lg border border-emerald-200 bg-emerald-50 p-5"
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-medium text-emerald-900">
              {ORTAQ_COPY.dossier.applicationSent}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">
              {ORTAQ_COPY.dossier.applicationSentHint}
            </p>
          </div>
        </div>
        <Link
          href="/panel/eslesmelerim"
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {ORTAQ_COPY.ctas.viewMatches}
        </Link>
      </div>
    );
  }

  if (!viewer.isAuthenticated) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-5">
        <p className="text-sm font-medium text-stone-900">
          {ORTAQ_COPY.dossier.applyPrompt}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-stone-600">
          {ORTAQ_COPY.dossier.applyLoginHint}
        </p>
        <button
          type="button"
          onClick={handleLoginInterest}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
        >
          {ORTAQ_COPY.ctas.apply}
        </button>
      </div>
    );
  }

  if (open && viewer.isAuthenticated && !viewer.isOwner) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-5">
        <p className="text-sm font-medium text-stone-900">
          Ortak profilinizle başvurun
        </p>
        <p className="mt-1 text-xs leading-relaxed text-stone-600">
          {ORTAQ_COPY.dossier.applyAuthenticatedHint}
        </p>
        <button
          type="button"
          onClick={handleApply}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
        >
          {ORTAQ_COPY.ctas.apply}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
      <p className="text-sm text-stone-600">
        Bu dosya için başvuru seçeneği şu an kullanılamıyor.
      </p>
      <Link
        href="/firsatlar"
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 hover:bg-stone-50"
      >
        {ORTAQ_COPY.ctas.browseOtherDossiers}
      </Link>
    </div>
  );
}
