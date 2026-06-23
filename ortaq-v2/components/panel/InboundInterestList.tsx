import Link from "next/link";
import { MessageSquare, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { InboundInterest } from "@/types/dossier-detail";

const STATUS_LABELS: Record<InboundInterest["status"], string> = {
  pending: "Yeni ilgi",
  in_review: "İnceleniyor",
  matched: "Eşleşti",
  declined: "Reddedildi",
};

const STATUS_VARIANTS: Record<
  InboundInterest["status"],
  "default" | "warning" | "success" | "danger"
> = {
  pending: "warning",
  in_review: "default",
  matched: "success",
  declined: "danger",
};

interface InboundInterestListProps {
  items: InboundInterest[];
}

export function InboundInterestList({ items }: InboundInterestListProps) {
  if (!items.length) {
    return (
      <section className="rounded-xl border border-ortaq-line bg-ortaq-surface p-6">
        <h2 className="font-heading text-base font-semibold text-ortaq-navy">
          Gelen ilgi
        </h2>
        <p className="mt-2 text-sm text-ortaq-text-muted">
          Henüz bu dosyaya ilgi gösteren ortak yok. Dosya yayında kaldıkça
          başvurular burada listelenir.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-ortaq-line bg-ortaq-surface p-6">
      <h2 className="font-heading text-base font-semibold text-ortaq-navy">
        Gelen ilgi
      </h2>
      <p className="mt-1 text-sm text-ortaq-text-muted">
        Bu dosyaya ilgi gösteren ortaklar
      </p>

      <ul className="mt-5 divide-y divide-ortaq-line">
        {items.map((item) => {
          const date = new Date(item.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <li
              key={item.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ortaq-navy">
                    {item.counterpartName}
                  </p>
                  <StatusBadge
                    label={STATUS_LABELS[item.status]}
                    variant={STATUS_VARIANTS[item.status]}
                  />
                </div>
                <p className="mt-0.5 text-sm text-ortaq-text-muted">
                  {item.counterpartType} · {date}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/panel/eslesmelerim"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ortaq-line bg-ortaq-surface px-3 text-sm font-medium text-ortaq-navy hover:bg-ortaq-surface-alt"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Görüntüle
                </Link>
                <Link
                  href="/panel/mesajlar"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ortaq-action px-3 text-sm font-medium text-white hover:bg-ortaq-action/90"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Mesaj Başlat
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
