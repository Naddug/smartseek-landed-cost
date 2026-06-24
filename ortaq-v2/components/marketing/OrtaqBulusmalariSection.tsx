import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Mail,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { cn } from "@/lib/utils";

const GATHERING_IMAGE =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&q=88&auto=format&fit=crop";

interface OrtaqBulusmalariSectionProps {
  variant?: "compact" | "full";
  className?: string;
}

export function OrtaqBulusmalariSection({
  variant = "full",
  className,
}: OrtaqBulusmalariSectionProps) {
  const copy = ORTAQ_COPY.bulusmalar;
  const isCompact = variant === "compact";

  return (
    <div className={cn(className)}>
      {!isCompact && (
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-ortaq-line shadow-ortaq-md">
          <div className="relative aspect-[21/9] min-h-[200px] md:min-h-[280px]">
            <Image
              src={GATHERING_IMAGE}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ortaq-navy/90 via-ortaq-navy/70 to-ortaq-navy/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <p className="type-eyebrow-light">{copy.eyebrow}</p>
              <h2 className="mt-2 max-w-2xl font-heading text-2xl font-semibold text-white md:text-3xl">
                {copy.sectionTitle}
              </h2>
            </div>
          </div>
        </div>
      )}

      {isCompact && (
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
          {copy.sectionIntro}
        </p>
      )}

      {!isCompact && (
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
          {copy.sectionIntro}
        </p>
      )}

      <div
        className={cn(
          "rounded-xl border border-ortaq-line bg-ortaq-surface-alt px-5 py-4",
          isCompact ? "mb-6" : "mb-10"
        )}
      >
        <p className="text-sm leading-relaxed text-ortaq-text-secondary">
          <span className="font-semibold text-ortaq-navy">{copy.principle}</span>
        </p>
      </div>

      <div className={cn("grid gap-4", isCompact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4")}>
        {copy.formats.map((format) => (
          <div
            key={format.title}
            className="flex flex-col rounded-xl border border-ortaq-line bg-ortaq-surface p-5 shadow-ortaq-sm"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
              {format.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ortaq-text-secondary">
              {format.description}
            </p>
          </div>
        ))}
      </div>

      <div className={cn("mt-10 grid gap-6", isCompact ? "lg:grid-cols-1" : "lg:grid-cols-[1fr_340px]")}>
        <div>
          <p className="type-eyebrow">Nasıl işler?</p>
          <ol className="mt-4 space-y-4">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ortaq-navy text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ortaq-navy">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ortaq-text-secondary">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-ortaq-navy">Pilot program</p>
              <p className="mt-2 text-sm leading-relaxed text-ortaq-text-secondary">
                {copy.pilotNote}
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 border-t border-blue-100 pt-4">
            {[
              "Sahte katılım sayısı veya abartılı etkinlik iddiası yok",
              "Her buluşma dosya ve profil uyumuna göre kürasyonlu",
              "Platformdaki eşleşme sürecinin devamı niteliğinde",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-ortaq-text-secondary">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/firsatlar">
          <Button className="bg-blue-600 hover:bg-blue-700">
            {copy.ctaPrimary}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
        <Link href="mailto:destek@ortaq.biz?subject=ORTAQ%20Bulu%C5%9Fmalar%C4%B1%20davet%20program%C4%B1">
          <Button variant="outline">
            <Mail className="mr-1.5 h-4 w-4" />
            {copy.ctaSecondary}
          </Button>
        </Link>
        {isCompact && (
          <Link
            href="/bulusmalar"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            {copy.compactLink} →
          </Link>
        )}
      </div>
    </div>
  );
}
