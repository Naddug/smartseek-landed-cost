"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getManufacturer, matchFit, CURRENT_PARTNER, companyPitch, capitalAsk, openQuestion, introGateLine } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";
import { Mono, Tag, Panel, PanelHead, StageBadge, FitTag, OpportunityHook, trustFromSignals } from "@/components/demo/DemoKit";
import { NextStep } from "@/components/demo/Journey";
import { cn } from "@/lib/cn";

export default function CapitalProfilePage() {
  const params = useParams();
  const id = String(params.id);
  const m = getManufacturer(id);
  const { watch, toggleWatch, addIntro, intros, roomForManufacturer } = useDemo();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (!m) {
    return (
      <div className="py-16 text-center">
        <p className="text-ortaq-ink-muted">Profil bulunamadı.</p>
        <Link href="/demo/sermaye" className="mt-3 inline-block text-[0.8125rem] text-ortaq-trust-muted hover:underline">Keşfe dön</Link>
      </div>
    );
  }

  const { fit, reasons, whyNow } = matchFit(m, CURRENT_PARTNER);
  const myIntro = intros.find((i) => i.manufacturerId === m.id && i.partnerName === CURRENT_PARTNER.name);
  const room = roomForManufacturer(m.id);
  const watched = watch.includes(m.id);
  const trust = trustFromSignals(m.signals);
  const canRequestIntro = !room && !myIntro && !sent && fit !== "weak" && m.stage === "ready";

  const handleSend = () => {
    addIntro(m.id, CURRENT_PARTNER.name, CURRENT_PARTNER.type, note || "Kapasite yatırımı tezimize uyuyor; görüşmek isteriz.");
    setOpen(false);
    setSent(true);
  };

  const nextAction = room
    ? `${m.name} ile görüşmeye devam edin. ${openQuestion(m)}`
    : myIntro?.status === "pending" || sent
      ? `${m.name} yanıt verince görüşme açılır. Belgeler profilde incelendi.`
      : myIntro?.status === "declined"
        ? "Keşfe dönün veya profili izlemeye alın."
        : fit === "weak"
          ? "Tez dışı profil; geçin veya izlemeye alın."
          : m.stage !== "ready"
            ? introGateLine(m)
            : `${m.name} ile görüşme talebi gönderin. ${openQuestion(m)}`;

  return (
    <div className="space-y-8">
      <Link href="/demo/sermaye" className="text-[0.75rem] text-ortaq-ink-soft hover:text-ortaq-ink">← Keşif</Link>

      <OpportunityHook
        name={m.name}
        capitalLine={capitalAsk(m)}
        summary={m.summary}
        urgency={whyNow}
        trust={trust}
        next={nextAction}
      />

      <Panel>
        <PanelHead>İncelenen belgeler</PanelHead>
        <div className="px-5 py-5">
          <div className="flex flex-wrap gap-1.5">
            {m.signals.map((s) => <Tag key={s.label} tone={s.verified ? "trust" : "muted"}>{s.verified ? "✓ " : "○ "}{s.label}</Tag>)}
          </div>
          <p className="mt-4 text-[0.8125rem] leading-[1.55] text-ortaq-ink-muted">{trust}</p>
          {m.gaps.length > 0 && (
            <p className="mt-2 text-[0.75rem] leading-[1.5] text-ortaq-ink">{openQuestion(m)}</p>
          )}
          <p className="mt-3 text-[0.75rem] font-medium text-ortaq-trust-muted">{introGateLine(m)}</p>
        </div>
      </Panel>

      <div id="talep" className="scroll-mt-24">
      <Panel className={cn(canRequestIntro ? "border-ortaq-trust/40 bg-ortaq-trust-soft/30" : "border-ortaq-ink/20 bg-ortaq-bg-alt")}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
          <div>
            <p className="text-[0.9375rem] font-semibold text-ortaq-ink">
              {room ? `${m.name} ile görüşme devam ediyor` : myIntro?.status === "pending" || sent ? "Görüşme talebi iletildi" : myIntro?.status === "declined" ? "Görüşme talebi reddedildi" : canRequestIntro ? "Karşılıklı tanıştırma" : "Görüşme talebi"}
            </p>
            <p className="mt-1 text-[0.8125rem] text-ortaq-ink-muted">
              {room
                ? `${capitalAsk(m)} konusunda doğrudan görüşün. Karşılıklı kabul sonrası açıldı.`
                : canRequestIntro
                  ? "Belgeler dosyalandı. İlginizi yazın; üretici kabul ederse görüşme açılır."
                  : myIntro?.status === "pending" || sent
                    ? "Talep üreticiye iletildi; karşılıklı onay bekleniyor."
                    : introGateLine(m)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => toggleWatch(m.id)} className={cn("rounded-ortaq-md border px-3 py-2 text-[0.8125rem] font-medium", watched ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust-muted" : "border-ortaq-border text-ortaq-ink-muted hover:border-ortaq-border-strong")}>
              {watched ? "İzlemede" : "Sonra bak"}
            </button>
            {room ? (
              <Link href={`/demo/oda/${room.id}`} className="rounded-ortaq-md bg-ortaq-ink px-5 py-2.5 text-[0.8125rem] font-semibold text-ortaq-cream hover:opacity-90">{m.name} ile görüş →</Link>
            ) : myIntro?.status === "pending" || sent ? (
              <Tag tone="warn">Karşılıklı onay bekleniyor</Tag>
            ) : myIntro?.status === "declined" ? (
              <Tag tone="muted">Reddedildi</Tag>
            ) : fit !== "weak" && m.stage === "ready" ? (
              <button onClick={() => setOpen(true)} className="rounded-ortaq-md bg-ortaq-trust px-5 py-2.5 text-[0.8125rem] font-semibold text-ortaq-cream hover:opacity-90">{m.name} ile görüşme talep et</button>
            ) : null}
          </div>
        </div>
      </Panel>
      </div>

      {canRequestIntro && (
        <NextStep prefix="Ne yapmalısınız?" label={whyNow} cta="Görüşme talebi gönder" href="#talep" />
      )}
      {(myIntro?.status === "pending" || sent) && !room && (
        <NextStep prefix="Ne yapmalısınız?" label={`${m.name} yanıt bekliyor.`} cta="Profili aç" href={`/demo/sirket/${m.id}`} />
      )}
      {room && (
        <NextStep prefix="Ne yapmalısınız?" label={`${m.name} ile görüşme devam ediyor.`} cta="Odaya git" href={`/demo/oda/${room.id}`} />
      )}

      <div className="flex flex-wrap items-center gap-2 text-[0.75rem] text-ortaq-ink-muted">
        <FitTag fit={fit} />
        <StageBadge stage={m.stage} />
        <span>{companyPitch(m)} · {m.markets.join(", ")}</span>
      </div>

      <Panel>
        <PanelHead>İş özeti</PanelHead>
        <div className="grid grid-cols-2 gap-3 px-5 py-5 sm:grid-cols-4">
          {[["Ciro (tahmini)", m.revenue], ["Büyüme", m.growth], ["Sermaye ihtiyacı", m.need], ["Kullanım", m.use]].map(([k, v]) => (
            <div key={k} className="border-t border-ortaq-border pt-2"><Mono>{k}</Mono><p className="mt-0.5 text-[0.8125rem] font-medium text-ortaq-ink">{v}</p></div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHead>Tezinize neden uyuyor</PanelHead>
        <ul className="space-y-2 px-5 py-5">
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[0.8125rem] text-ortaq-ink">
              <span aria-hidden className="mt-0.5 text-ortaq-trust">✓</span>{r}
            </li>
          ))}
        </ul>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ortaq-dark/50 px-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-6" onClick={(e) => e.stopPropagation()}>
            <Mono>Karşılıklı tanıştırma</Mono>
            <p className="mt-2 text-[1.0625rem] font-semibold text-ortaq-ink">{m.name}</p>
            <p className="mt-1 text-[0.8125rem] font-medium text-ortaq-trust-muted">{capitalAsk(m)}</p>
            <p className="mt-2 text-[0.8125rem] text-ortaq-ink-muted">Belgeler incelendi. İlginizin gerekçesini kısaca yazın.</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Kapasite yatırımı tezimize uyuyor; görüşmek isteriz."
              className="mt-3 w-full rounded-ortaq-md border border-ortaq-border bg-ortaq-bg px-3 py-2 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-border-strong" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-ortaq-md border border-ortaq-border px-4 py-2 text-[0.8125rem] text-ortaq-ink-muted">Vazgeç</button>
              <button onClick={handleSend} className="rounded-ortaq-md bg-ortaq-trust px-4 py-2 text-[0.8125rem] font-semibold text-ortaq-cream hover:opacity-90">Talebi gönder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
