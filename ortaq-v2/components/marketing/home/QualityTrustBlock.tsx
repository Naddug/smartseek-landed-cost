import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const points = [
  "Her fırsat dosyası yayınlanmadan önce incelenir.",
  "Belirsiz, boş veya somut varlığı olmayan başvurular yayına alınmaz.",
  "Bazı bilgiler, gerçek bir eşleşme oluşana kadar gizli kalabilir.",
  "ORTAQ duvar ilanı panosu değildir; her dosya bir amaca hizmet eder.",
];

export function QualityTrustBlock() {
  return (
    <section className="py-16 md:py-20">
      <AppContainer>
        <div className="rounded-2xl border border-ortaq-line bg-ortaq-surface p-8 md:p-12">
          <div className="flex items-start gap-4">
            <div className="hidden shrink-0 rounded-xl bg-ortaq-action/10 p-3 sm:block">
              <ShieldCheck className="h-6 w-6 text-ortaq-action" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-2xl font-semibold text-ortaq-navy md:text-3xl">
                Buradaki her şey aynı kalitede yayınlanmaz.
              </h2>
              <ul className="mt-6 space-y-3">
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-ortaq-text-muted md:text-base"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ortaq-navy" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/guven-kalite" className="mt-8 inline-block">
                <Button variant="outline" size="sm">
                  Güven & Kalite detayları
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
