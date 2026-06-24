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
          Başvurunuz alındı. Dosya sahibi incelediğinde durum burada güncellenir —
          genelde 3–5 iş günü içinde ilk geri bildirim.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-medium">
          <Link
            href="/firsatlar"
            className="text-emerald-900 underline-offset-2 hover:underline"
          >
            Başka fırsatlara göz at →
          </Link>
          <Link
            href={`/firsatlar/${dossierSlug}`}
            className="text-emerald-800/80 underline-offset-2 hover:underline"
          >
            Dosyayı görüntüle
          </Link>
        </div>
      </div>
    </div>
  );
}
