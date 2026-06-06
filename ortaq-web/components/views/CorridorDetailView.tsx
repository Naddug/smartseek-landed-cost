"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { TradeWorkflowTimeline } from "@/components/trade/TradeWorkflowTimeline";

type CorridorKey = "asean" | "gulf" | "europe";

type Props = {
  corridor: CorridorKey;
};

const CORRIDOR_FLAGS: Record<CorridorKey, string> = {
  asean: "🇹🇷 ↔ 🌏",
  gulf: "🇹🇷 ↔ 🌍",
  europe: "🇹🇷 ↔ 🇪🇺",
};

const CORRIDOR_FRICTION: Record<CorridorKey, string[]> = {
  asean: [
    "EUR.1 menşe belgesi Ticaret Odası'nda leğalize edilmeli",
    "Gıda ürünleri için fitosaniter sertifikası temin süresi uzun olabilir",
    "Helal sertifikası gerektiren ürünler için önceden planlama gerekir",
    "Bazı ASEAN pazarlarında ithal kotaları uygulanabilir",
  ],
  gulf: [
    "BAE'ye helal sertifikası zorunlu (gıda ürünleri)",
    "Suudi Arabistan'a ihracatta SABER sistemi kaydı gerekebilir",
    "Akreditif (LC) açılması 5–10 iş günü sürebilir",
    "UAE limanlarında konşimento hatası varsa demurrage uygulanır",
  ],
  europe: [
    "A.TR belgesi için gümrük müşaviri gerekir",
    "CE belgesi gerektiren ürünler için notified body süreci uzun",
    "CMR belgesi taşıyıcı firma tarafından düzenlenir",
    "Almanya'ya özel ambalaj direktifleri (VerpackG) uygulanabilir",
  ],
};

const CORRIDOR_DOCS: Record<CorridorKey, { doc: string; note: string }[]> = {
  asean: [
    { doc: "EUR.1 Menşe Şahadetnamesi", note: "Gümrük indirimi için zorunlu" },
    { doc: "Fitosaniter Sertifikası", note: "Bitkisel ürünler için" },
    { doc: "Helal Sertifikası", note: "Malezya, Endonezya için" },
    { doc: "Konşimento (B/L)", note: "Deniz taşımacılığı" },
    { doc: "Ticari Fatura", note: "Gümrük beyanı için" },
    { doc: "Çeki Listesi", note: "Ürün ağırlık/adet detayı" },
  ],
  gulf: [
    { doc: "Menşe Şahadetnamesi", note: "Ticaret Odası onaylı" },
    { doc: "Helal Sertifikası", note: "BAE, Suudi Arabistan için zorunlu" },
    { doc: "Akreditif (LC)", note: "Ödeme güvencesi" },
    { doc: "Konşimento (B/L)", note: "Deniz taşımacılığı" },
    { doc: "Ticari Fatura", note: "Arapça çeviri gerekebilir" },
    { doc: "SGS/Intertek Raporu", note: "Yüksek değerli ürünler için" },
  ],
  europe: [
    { doc: "EUR.1 Menşe Şahadetnamesi", note: "AB gümrük indirimi" },
    { doc: "A.TR Dolaşım Belgesi", note: "Gümrük birliği ürünleri" },
    { doc: "CE Belgesi", note: "Teknik ürünler için zorunlu" },
    { doc: "CMR Taşıma Belgesi", note: "Kara taşımacılığı" },
    { doc: "Ticari Fatura", note: "AB standardı format" },
    { doc: "Çeki Listesi", note: "Ürün ağırlık/adet detayı" },
  ],
};

export function CorridorDetailView({ corridor }: Props) {
  const { t } = useTranslation();

  const frictionPoints = CORRIDOR_FRICTION[corridor];
  const docs = CORRIDOR_DOCS[corridor];

  return (
    <PublicShell>
      {/* Breadcrumb */}
      <div className="border-b border-ortaq-border bg-ortaq-surface">
        <Container wide>
          <div className="flex items-center gap-2 py-3 text-[0.8125rem] text-ortaq-ink-soft">
            <Link href="/corridors" className="hover:text-ortaq-ink hover:underline">
              {t("trade.corridors.label")}
            </Link>
            <span>›</span>
            <span className="text-ortaq-ink">{t(`trade.corridors.${corridor}.name`)}</span>
          </div>
        </Container>
      </div>

      {/* Header */}
      <section className="bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="py-12 sm:py-16">
            <p className="mb-3 text-3xl">{CORRIDOR_FLAGS[corridor]}</p>
            <h1 className={cn(typography.display, "mb-2")}>
              {t(`trade.corridors.${corridor}.name`)}
            </h1>
            <p className={cn(typography.body, "mb-6 max-w-xl")}>
              {t(`trade.corridors.${corridor}.markets`)}
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-3">
              <StatChip label="Tipik ürünler" value={t(`trade.corridors.${corridor}.goods`)} />
              <StatChip label="Süre" value={t(`trade.corridors.${corridor}.timeline`)} />
            </div>
          </div>
        </Container>
      </section>

      {/* Workflow timeline */}
      <section className="border-b border-ortaq-border bg-ortaq-bg-alt">
        <Container wide>
          <div className="py-10">
            <p className={cn(typography.label, "mb-5 text-ortaq-ink-soft")}>
              Bu koridor için tipik iş akışı
            </p>
            <TradeWorkflowTimeline activeStep="inspection" />
          </div>
        </Container>
      </section>

      {/* Documents + Friction */}
      <section className="bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="grid gap-8 py-12 sm:py-14 lg:grid-cols-2">
            {/* Documents */}
            <div>
              <h2 className={cn(typography.h2, "mb-5")}>Belge Gereksinimleri</h2>
              <div className="space-y-2">
                {docs.map(({ doc, note }) => (
                  <div
                    key={doc}
                    className="flex items-start gap-3 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg p-3.5"
                  >
                    <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-ortaq-trust/15 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
                    </div>
                    <div>
                      <p className="text-[0.8125rem] font-semibold text-ortaq-ink">{doc}</p>
                      <p className={cn(typography.caption, "mt-0.5")}>{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friction */}
            <div>
              <h2 className={cn(typography.h2, "mb-5")}>Yaygın Sorunlar</h2>
              <div className="space-y-2">
                {frictionPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg p-3.5"
                  >
                    <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-ortaq-accent/10 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-ortaq-accent" />
                    </div>
                    <p className="text-[0.8125rem] text-ortaq-ink-muted leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ortaq-dark">
        <Container wide>
          <div className="py-12 text-center">
            <h2 className={cn("font-body text-[1.5rem] font-semibold text-ortaq-cream mb-3")}>
              {t("trade.corridors.openRoom")}
            </h2>
            <Link
              href="/demo"
              className="inline-flex min-h-12 items-center justify-center rounded-ortaq-sm bg-ortaq-cream px-6 text-[0.9375rem] font-semibold text-ortaq-ink transition-colors hover:bg-white"
            >
              {t("trade.cta.primary")}
            </Link>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-bg px-4 py-2.5">
      <p className={cn("text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft mb-0.5")}>{label}</p>
      <p className="text-[0.8125rem] font-medium text-ortaq-ink">{value}</p>
    </div>
  );
}
