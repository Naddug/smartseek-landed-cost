import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface AppliedSuccessBannerProps {
  dossierSlug: string;
}

export function AppliedSuccessBanner({ dossierSlug }: AppliedSuccessBannerProps) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emerald-900">
          İlginiz kaydedildi
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          Başvurunuz alındı. Dosya sahibi incelediğinde burada güncellenir.
        </p>
        <Link
          href={`/firsatlar/${dossierSlug}`}
          className="mt-2 inline-block text-sm font-medium text-emerald-900 underline-offset-2 hover:underline"
        >
          Fırsat dosyasına dön →
        </Link>
      </div>
    </div>
  );
}
