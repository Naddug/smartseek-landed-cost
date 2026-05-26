"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SimulatedCampaign } from "@/lib/campaigns/types";
import { PublicShell } from "@/components/layout/PublicShell";
import { OperationalTicker } from "@/components/home/OperationalTicker";
import { Container } from "@/components/ui/Section";
import { ImmersiveImage } from "@/components/media/ImmersiveImage";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  FieldJournal,
  InspectionStack,
  OperationalFeed,
} from "@/components/operations/FieldJournal";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { VerificationLabel } from "@/components/trust/VerificationLabel";
import { Button } from "@/components/ui/Button";
import { media } from "@/lib/media";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { isCompanySaved, toggleSavedCompany } from "@/lib/member/storage";
import { formatPulseDate } from "@/lib/operations/pulse";

const accessLabels: Record<SimulatedCampaign["access"]["status"], string> = {
  preliminary: "Ön inceleme aşamasında",
  document_review: "Belge incelemesi devam ediyor",
  field_verification: "Saha doğrulaması devam ediyor",
  committee: "Komite kuyruğunda",
  partial_open: "Kısmi dosya erişimi",
};

const docStatusLabels = {
  available: "Mevcut",
  review: "İnceleniyor",
  pending: "Bekliyor",
} as const;

function formatTry(n: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

type CampaignDetailViewProps = {
  campaign: SimulatedCampaign;
};

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const [saved, setSaved] = useState(false);
  const c = campaign;

  useEffect(() => {
    setSaved(isCompanySaved(c.slug));
  }, [c.slug]);

  return (
    <PublicShell stickyCta={false}>
      <ImmersiveImage
        src={media.cncWorkshop.src}
        alt={`${c.tradeName} — temsilî üretim görseli`}
        focalPoint="40% 44%"
        variant="tall"
        cropIntensity="raw"
        density="heavy"
        priority
      />

      <OperationalTicker variant="dark" />

      <div className="border-b border-ortaq-border bg-ortaq-cream/95">
        <Container wide className="py-3.5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="signal-pulse h-1.5 w-1.5 rounded-full bg-ortaq-gold" aria-hidden />
              <span className={cn(typography.caption, "text-ortaq-gold")}>
                {accessLabels[c.access.status]}
              </span>
            </span>
            <StatusBadge status="illustrative" />
            <VerificationLabel label={c.verificationLabel} />
          </div>
        </Container>
      </div>

      <Container wide className="py-8 sm:py-12">
        <FadeIn>
          <p className={typography.kicker}>{c.sector}</p>
          <h1 className={cn(typography.h1, "mt-2 max-w-3xl")}>{c.tradeName}</h1>
          <p className={cn(typography.bodySm, "mt-2 text-ortaq-ink-soft")}>{c.legalName}</p>
          <p className={cn(typography.body, "mt-3")}>
            {c.city}, {c.region} · {c.operations.shifts}
          </p>
          <OperationalFeed updates={c.operationalUpdates.slice(0, 1)} />
        </FadeIn>
      </Container>

      <div className="border-y border-ortaq-border bg-ortaq-bg-alt">
        <Container wide className="py-7 sm:py-9">
          <p className={typography.kicker}>Canlı sinyaller</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            {c.operations.signals.map((s) => (
              <div key={s.label}>
                <dt className={typography.caption}>{s.label}</dt>
                <dd className={cn(typography.bodySm, "mt-0.5 font-medium text-ortaq-ink")}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      <ImmersiveImage
        src={media.factoryDetail.src}
        alt="Üretim detayı"
        focalPoint="52% 48%"
        variant="texture"
        cropIntensity="raw"
        density="heavy"
      />

      {/* Production + facility */}
      <Container wide className="py-12 sm:py-16">
        <FadeIn>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-5">
              <h2 className={cn("desire-whisper text-ortaq-ink")}>Üretim organizması</h2>
              <p className={cn(typography.body, "mt-4 text-ortaq-ink-muted")}>{c.story.production}</p>
              <p className={cn(typography.bodySm, "mt-5 text-ortaq-ink-soft")}>
                {c.operations.processes.join(" → ")}
              </p>
              <ul className="mt-8 space-y-3 border-t border-ortaq-border pt-6">
                {c.facilityNotes.map((zone) => (
                  <li key={zone.zone} className={cn(typography.bodySm, "text-ortaq-ink-muted")}>
                    <span className="text-ortaq-ink">{zone.zone}</span> — {zone.note}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:col-span-7 lg:mt-0">
              <p className={cn(typography.prose, "editorial-rhythm")}>{c.story.origin}</p>
              <p className={cn(typography.body, "mt-5 text-ortaq-ink-muted")}>{c.story.today}</p>
              <div className="mt-8">
                <p className={typography.kicker}>Darboğazlar</p>
                <ul className="mt-4 space-y-3">
                  {c.bottlenecks.map((b) => (
                    <li key={b.label} className={cn(typography.bodySm, "border-l border-ortaq-gold/50 pl-3 text-ortaq-ink-muted")}>
                      <span className="text-ortaq-ink">{b.label}:</span> {b.note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>

      {/* Machine park */}
      <div className="border-y border-ortaq-border bg-ortaq-bg-warm">
        <Container wide className="py-12 sm:py-16">
          <p className={typography.kicker}>Makine parkı</p>
          <ul className="mt-6 divide-y divide-ortaq-border">
            {c.machines.map((machine) => (
              <li key={machine.id} className="grid gap-2 py-5 sm:grid-cols-[1fr_2fr] sm:gap-8">
                <div>
                  <p className={cn(typography.bodySm, "font-medium text-ortaq-ink")}>{machine.name}</p>
                  <p className={cn(typography.caption, "mt-0.5")}>
                    {machine.role} · {machine.year}
                  </p>
                </div>
                <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{machine.note}</p>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Field journal */}
      <Container wide className="py-12 sm:py-16">
        <FieldJournal entries={c.fieldJournal} />
      </Container>

      <ImmersiveImage
        src={media.logisticsDock.src}
        alt="Lojistik"
        focalPoint="58% 55%"
        variant="full"
        cropIntensity="raw"
        density="heavy"
        parallax={false}
      />

      {/* Export evolution */}
      <div className="bg-ortaq-dark px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Container wide>
          <p className={typography.kickerLight}>İhracat evrimi</p>
          <ol className="mt-8 space-y-0">
            {c.exportEvolution.map((ev, i) => (
              <li
                key={`${ev.year}-${ev.market}`}
                className={cn(
                  "grid grid-cols-[3.5rem_1fr] gap-x-5 border-t border-white/10 py-5 sm:grid-cols-[4.5rem_1fr]",
                  i === c.exportEvolution.length - 1 && "border-b border-white/10",
                )}
              >
                <span className={cn(typography.caption, "tabular-nums text-ortaq-gold")}>{ev.year}</span>
                <div>
                  <p className={cn(typography.bodySm, "text-ortaq-cream")}>{ev.market}</p>
                  <p className={cn(typography.caption, "mt-1 text-ortaq-cream/50")}>{ev.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <ol className="mt-12 space-y-0">
            {c.timeline.map((ev) => (
              <li
                key={ev.year}
                className="grid grid-cols-[3.5rem_1fr] gap-x-5 border-t border-white/10 py-4 sm:grid-cols-[4.5rem_1fr]"
              >
                <span className={cn(typography.caption, "tabular-nums text-ortaq-cream/40")}>{ev.year}</span>
                <p className={cn(typography.bodySm, "text-ortaq-cream/65")}>{ev.event}</p>
              </li>
            ))}
          </ol>
        </Container>
      </div>

      {/* Capital */}
      <Container wide className="py-12 sm:py-16">
        <FadeIn>
          <h2 className={typography.h2}>Sermaye ihtiyacı</h2>
          <p className={cn(typography.body, "mt-4 max-w-2xl text-ortaq-ink-muted")}>{c.funding.purpose}</p>
          <p className={cn(typography.bodySm, "mt-3 tabular-nums")}>
            {formatTry(c.funding.targetTry)}
            <span className={cn(typography.caption, "ml-2")}>(simülasyon)</span>
          </p>
          <ul className="mt-6 divide-y divide-ortaq-border border-y border-ortaq-border">
            {c.funding.lines.map((line) => (
              <li key={line.label} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:justify-between">
                <span className={typography.bodySm}>{line.label}</span>
                <span className={cn(typography.bodySm, "tabular-nums text-ortaq-ink-soft")}>
                  {formatTry(line.amountTry)} · %{line.percent}
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </Container>

      <ImmersiveImage
        src={media.packagingFloor.src}
        alt="Sevkiyat"
        focalPoint="46% 50%"
        variant="texture"
        cropIntensity="raw"
        density="heavy"
      />

      {/* Inspection + process */}
      <Container wide className="py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
          <div>
            <p className={typography.kicker}>İnceleme katmanları</p>
            <div className="mt-5">
              <InspectionStack layers={c.inspectionLayers} />
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <p className={typography.kicker}>Erişim süreci</p>
            <ol className="mt-5 space-y-0">
              {c.process.map((step) => (
                <li
                  key={step.label}
                  className={cn(
                    "border-t border-ortaq-border py-3.5",
                    step.status === "active" && "border-l-2 border-l-ortaq-gold pl-3",
                  )}
                >
                  <p className={typography.bodySm}>{step.label}</p>
                  <p className={cn(typography.caption, "mt-0.5")}>
                    {step.status === "done" && step.date && formatPulseDate(step.date)}
                    {step.status === "active" && "Devam ediyor"}
                    {step.status === "pending" && "Bekliyor"}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-10 border-t border-ortaq-border pt-6">
          <OperationalFeed updates={c.operationalUpdates} />
        </div>
      </Container>

      {/* Risks + documents */}
      <Container narrow className="border-t border-ortaq-border py-12">
        <h2 className={typography.h2}>Risk profili</h2>
        <ul className="mt-6 divide-y divide-ortaq-border">
          {c.risks.map((r) => (
            <li key={r.title} className="py-4">
              <h3 className={typography.h3}>{r.title}</h3>
              <p className={cn(typography.bodySm, "mt-1.5 text-ortaq-ink-muted")}>{r.text}</p>
            </li>
          ))}
        </ul>
        <Link href="/riskler" className={cn(typography.bodySm, typography.link, "mt-4 inline-block")}>
          Genel riskler →
        </Link>

        <h2 className={cn(typography.h2, "mt-12")}>Belge katmanı</h2>
        <ul className="mt-5 divide-y divide-ortaq-border">
          {c.documents.map((doc) => (
            <li key={doc.id} className="flex flex-col gap-0.5 py-3.5 sm:flex-row sm:justify-between">
              <span className={typography.bodySm}>{doc.title}</span>
              <span className={cn(typography.caption, "shrink-0")}>
                {docStatusLabels[doc.status]}
                {doc.note ? ` · ${doc.note}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </Container>

      <Container narrow className="border-t border-ortaq-border py-12">
        <p className={typography.kicker}>Kurucu</p>
        <blockquote className={cn(typography.body, "mt-3 border-l-2 border-ortaq-gold/50 pl-4 text-ortaq-ink-muted")}>
          {c.founder.note}
        </blockquote>
        <p className={cn(typography.caption, "mt-3")}>{c.founder.name} · {c.founder.role}</p>
      </Container>

      <Container narrow className="pb-14">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant={saved ? "dark" : "secondary"}
            onClick={() => setSaved(toggleSavedCompany(c.slug, c.tradeName))}
          >
            {saved ? "Dosya kaydedildi" : "Dosyayı takip et"}
          </Button>
          <Link href="/degerlendirme">
            <Button variant="ghost">Değerlendirme kriterleri</Button>
          </Link>
        </div>
        <p className={cn(typography.caption, "mt-5")}>
          Simüle dosya · Kampanya lisanslı platform üzerinden açılır · Getiri garantisi yoktur.
        </p>
      </Container>
    </PublicShell>
  );
}
