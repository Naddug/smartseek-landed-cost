import { Check, Minus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import type { DossierVerification, PublicDossierDetail } from "@/types/dossier-detail";

function TrustItem({
  label,
  state,
}: {
  label: string;
  state: boolean | undefined;
}) {
  const verified = state === true;
  const pending = state === undefined;

  return (
    <li className="flex items-start gap-3 py-2.5">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          verified && "bg-emerald-100 text-emerald-700",
          !verified && !pending && "bg-stone-100 text-stone-400",
          pending && "bg-amber-50 text-amber-600"
        )}
      >
        {verified ? (
          <Check className="h-3 w-3" strokeWidth={2.5} />
        ) : pending ? (
          <Minus className="h-3 w-3" />
        ) : (
          <Minus className="h-3 w-3" />
        )}
      </span>
      <div>
        <p className="text-sm font-medium text-stone-800">{label}</p>
        <p className="text-xs text-ortaq-text-muted">
          {verified
            ? "Doğrulandı"
            : pending
              ? "İnceleme bekliyor"
              : "Henüz doğrulanmadı"}
        </p>
      </div>
    </li>
  );
}

function buildTrustItems(verification?: DossierVerification) {
  return [
    {
      label: ORTAQ_COPY.dossier.dossierReview,
      state: verification?.dossierReviewed,
    },
    {
      label: "Şirket doğrulaması",
      state: verification?.companyVerified,
    },
    {
      label: "Kimlik doğrulaması",
      state: verification?.identityVerified,
    },
    {
      label: "Lokasyon doğrulaması",
      state: verification?.locationVerified,
    },
  ];
}

interface DossierTrustPanelProps {
  dossier: PublicDossierDetail;
  className?: string;
}

export function DossierTrustPanel({ dossier, className }: DossierTrustPanelProps) {
  const items = buildTrustItems(dossier.verification);
  const updated = new Date(dossier.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <aside
      className={cn(
        "rounded-lg border border-stone-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
        <Shield className="h-4 w-4 text-stone-500" />
        <h2 className="font-heading text-sm font-semibold text-stone-900">
          {ORTAQ_COPY.dossier.reviewPanelTitle}
        </h2>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ortaq-text-secondary">
        {ORTAQ_COPY.dossier.reviewPanelDescription}
      </p>

      <ul className="mt-2 divide-y divide-stone-100">
        {items.map((item) => (
          <TrustItem key={item.label} label={item.label} state={item.state} />
        ))}
      </ul>

      <div className="mt-4 rounded-md bg-stone-50 px-3 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
          {ORTAQ_COPY.labels.lastUpdate}
        </p>
        <p className="mt-0.5 text-sm text-stone-700">{updated}</p>
      </div>
    </aside>
  );
}
