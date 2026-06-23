import { cn } from "@/lib/utils";
import type { VisibilityLevel } from "@/types";
import { Eye, EyeOff, Lock } from "lucide-react";

const levels: {
  level: VisibilityLevel | "restricted";
  key: string;
  label: string;
  description: string;
  icon: typeof Eye;
}[] = [
  {
    level: "public",
    key: "public",
    label: "Herkese açık",
    description:
      "Temel bilgiler platformda görünür; detaylar yine kontrollü paylaşılır.",
    icon: Eye,
  },
  {
    level: "matched_only",
    key: "restricted",
    label: "Kısıtlı",
    description:
      "Dosya listelenir ama hassas bilgiler yalnızca uygun eşleşmelere açılır.",
    icon: Lock,
  },
  {
    level: "private",
    key: "private",
    label: "Sadece ORTAQ aracılığıyla önerilen",
    description:
      "Genel listede görünmez; moderasyon ekibi uygun ortaklara yönlendirir.",
    icon: EyeOff,
  },
];

interface VisibilityExplainerProps {
  className?: string;
}

export function VisibilityExplainer({ className }: VisibilityExplainerProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {levels.map(({ key, label, description, icon: Icon }) => (
        <div
          key={key}
          className="rounded-xl border border-ortaq-line bg-ortaq-surface p-5"
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-ortaq-surface-alt text-ortaq-action">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
            {label}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ortaq-text-muted">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}
