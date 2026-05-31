"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MANUFACTURERS, CURRENT_PARTNER, matchFit, fitSortKey, getManufacturer, capitalAsk, openQuestion, introGateLine } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";
import { Mono, Tag, Panel, PanelHead, FitTag, OpportunityHook, trustFromSignals, StageBadge } from "@/components/demo/DemoKit";
import { NextStep } from "@/components/demo/Journey";
import { cn } from "@/lib/cn";

const p = CURRENT_PARTNER;

export default function CapitalDashboard() {
  const { watch, toggleWatch, intros, rooms } = useDemo();
  const [sector, setSector] = useState<string | null>(null);
  const [onlyReady, setOnlyReady] = useState(false);

  const feed = useMemo(() => MANUFACTURERS
    .map((m) => ({ m, ...matchFit(m, p) }))
    .filter(({ m }) => (sector ? m.sector === sector : true))
    .filter(({ m }) => (onlyReady ? m.stage === "ready" : true))
    .sort((a, b) => fitSortKey(a.fit) - fitSortKey(b.fit)), [sector, onlyReady]);

  const myIntros = intros.filter((i) => i.partnerName === p.name);
  const myRooms = rooms.filter((r) => r.partnerName === p.name);
  const pendingIntro = myIntros.find((i) => i.status === "pending");
  const acceptedRoom = myRooms[0];
  const top = feed.find(({ m, fit }) => fit !== "weak" && !myIntros.some((i) => i.manufacturerId === m.id && i.status !== "declined"));

  const topMan = top?.m;
  const topTrust = topMan ? trustFromSignals(topMan.signals) : "";

  const verifying = MANUFACTURERS.filter((m) => m.stage === "verifying");
  const focusMan = acceptedRoom
    ? getManufacturer(acceptedRoom.manufacturerId)
    : pendingIntro
      ? getManufacturer(pendingIntro.manufacturerId)
      : top?.m;

  return (
    <div className="space-y-8">
      <div>
        <Mono>Keşif · {p.name}</Mono>
        <h1 className="mt-2 text-[1.625rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[2rem]">
          {focusMan?.name ?? "Kapasite darboğazı olan ihracatçılar"}
        </h1>
        {focusMan ? (
          <p className="mt-2 text-[0.9375rem] font-semibold text-ortaq-trust-muted">{capitalAsk(focusMan)}</p>
        ) : (
          <p className="mt-2 max-w-2xl text-[0.875rem] leading-[1.55] text-ortaq-ink-muted">{p.thesis.note}</p>
        )}
      </div>

      {acceptedRoom && focusMan ? (
        <OpportunityHook
          capitalLine={capitalAsk(focusMan)}
          summary={focusMan.summary}
          urgency={focusMan.attentionNow}
          trust={trustFromSignals(focusMan.signals)}
          next="Görüşme odasında kapasite planı, marj yapısı ve açık belge sorularını sorun."
        />
      ) : pendingIntro && focusMan ? (
        <OpportunityHook
          capitalLine={capitalAsk(focusMan)}
          summary={focusMan.summary}
          urgency={focusMan.attentionNow}
          trust={trustFromSignals(focusMan.signals)}
          next={`${focusMan.name} yanıt verince görüşme açılır. Belgeler profilde incelendi.`}
        />
      ) : top ? (
        <OpportunityHook
          capitalLine={capitalAsk(top.m)}
          summary={top.m.summary}
          urgency={top.whyNow}
          trust={topTrust}
          next={`${openQuestion(top.m)} Görüşme talebi için profili açın.`}
        />
      ) : (
        <div className="rounded-ortaq-md border border-ortaq-border bg-ortaq-surface px-4 py-4 text-[0.8125rem] text-ortaq-ink-muted">
          Filtrelere uyan yeni fırsat kalmadı. Filtreleri genişletin veya izleme listesini kontrol edin.
        </div>
      )}

      {acceptedRoom ? (
        <NextStep prefix="Ne yapmalısınız?" label={focusMan?.attentionNow ?? "Görüşme devam ediyor."} cta="Görüşmeye git" href={`/demo/oda/${acceptedRoom.id}`} />
      ) : pendingIntro ? (
        <NextStep prefix="Ne yapmalısınız?" label={`${focusMan?.name} yanıt bekliyor.`} cta="Profili aç" href={`/demo/sirket/${pendingIntro.manufacturerId}`} />
      ) : top ? (
        <NextStep prefix="Ne yapmalısınız?" label={top.whyNow} cta={`${top.m.name} ile görüşme talep et`} href={`/demo/sirket/${top.m.id}#talep`} />
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {p.thesis.sectors.map((s) => <Tag key={s}>{s}</Tag>)}
        {p.thesis.markets.map((s) => <Tag key={s}>{s}</Tag>)}
        <Tag>{p.thesis.ticket}</Tag>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Mono>Fırsatlar</Mono>
            <span className="text-ortaq-ink-soft">·</span>
            <button onClick={() => setSector(null)} className={cn("rounded-ortaq-sm border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em]", !sector ? "border-ortaq-ink bg-ortaq-ink text-ortaq-cream" : "border-ortaq-border text-ortaq-ink-soft")}>Tümü</button>
            {Array.from(new Set(MANUFACTURERS.map((m) => m.sector))).map((s) => (
              <button key={s} onClick={() => setSector(s === sector ? null : s)} className={cn("rounded-ortaq-sm border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em]", s === sector ? "border-ortaq-ink bg-ortaq-ink text-ortaq-cream" : "border-ortaq-border text-ortaq-ink-soft")}>{s}</button>
            ))}
            <button onClick={() => setOnlyReady((v) => !v)} className={cn("rounded-ortaq-sm border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em]", onlyReady ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust-muted" : "border-ortaq-border text-ortaq-ink-soft")}>Belgeler incelendi</button>
          </div>

          <div className="space-y-4">
            {feed.map(({ m, fit, whyNow }) => {
              const intro = myIntros.find((i) => i.manufacturerId === m.id && i.status !== "declined");
              const trust = trustFromSignals(m.signals);
              return (
                <article key={m.id} className="rounded-ortaq-md border border-ortaq-border bg-ortaq-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/demo/sirket/${m.id}`} className="text-[1.125rem] font-semibold text-ortaq-ink hover:underline sm:text-[1.1875rem]">{m.name}</Link>
                      <p className="mt-1 text-[0.75rem] font-medium text-ortaq-trust-muted">{capitalAsk(m)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <FitTag fit={fit} />
                      {m.stage === "verifying" ? <StageBadge stage={m.stage} /> : null}
                    </div>
                  </div>
                  <p className="mt-2 border-l-2 border-ortaq-trust pl-3 text-[0.8125rem] leading-[1.5] font-semibold text-ortaq-trust-muted">{whyNow}</p>
                  <p className="mt-3 text-[0.875rem] leading-[1.5] text-ortaq-ink">{m.summary}</p>
                  <p className="mt-2 text-[0.75rem] leading-[1.5] text-ortaq-ink-muted">{trust}</p>
                  <p className="mt-2 text-[0.75rem] leading-[1.5] text-ortaq-ink">{openQuestion(m)}</p>
                  <p className="mt-2 text-[0.6875rem] leading-[1.5] text-ortaq-ink-muted">{introGateLine(m)}</p>
                  {intro && <p className="mt-2 text-[0.75rem] font-medium text-ortaq-ink-soft">{intro.status === "pending" ? "→ Talebiniz iletildi · karşılıklı onay bekleniyor" : "→ Karşılıklı kabul · görüşme açık"}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ortaq-border pt-3">
                    {intro ? (
                      <Link href={intro.status === "accepted" && myRooms.find((r) => r.manufacturerId === m.id) ? `/demo/oda/${myRooms.find((r) => r.manufacturerId === m.id)!.id}` : `/demo/sirket/${m.id}`} className="rounded-ortaq-md bg-ortaq-ink px-3 py-1.5 text-[0.75rem] font-medium text-ortaq-cream hover:opacity-90">
                        {intro.status === "pending" ? `${m.name} · yanıt bekleniyor` : `${m.name} · görüşmeye git`}
                      </Link>
                    ) : fit !== "weak" && m.stage === "ready" ? (
                      <Link href={`/demo/sirket/${m.id}#talep`} className="rounded-ortaq-md bg-ortaq-trust px-3 py-1.5 text-[0.75rem] font-semibold text-ortaq-cream hover:opacity-90">
                        {m.name} ile görüşme talep et
                      </Link>
                    ) : (
                      <Link href={`/demo/sirket/${m.id}`} className="rounded-ortaq-md bg-ortaq-ink px-3 py-1.5 text-[0.75rem] font-medium text-ortaq-cream hover:opacity-90">
                        {m.name} fırsatını incele
                      </Link>
                    )}
                    <button onClick={() => toggleWatch(m.id)} className={cn("rounded-ortaq-md border px-3 py-1.5 text-[0.75rem] font-medium transition", watch.includes(m.id) ? "border-ortaq-trust bg-ortaq-trust-soft text-ortaq-trust-muted" : "border-ortaq-border text-ortaq-ink-muted hover:border-ortaq-border-strong")}>
                      {watch.includes(m.id) ? "İzlemede" : "Sonra bak"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          {verifying.length > 0 && (
            <Panel>
              <PanelHead>İnceleme sürüyor</PanelHead>
              <ul>
                {verifying.map((m) => (
                  <li key={m.id} className="border-b border-ortaq-border px-5 py-3 last:border-b-0">
                    <Link href={`/demo/sirket/${m.id}`} className="text-[0.8125rem] font-medium text-ortaq-ink hover:underline">{m.name}</Link>
                    <p className="mt-0.5 text-[0.75rem] text-ortaq-ink-muted">{introGateLine(m)}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {(myRooms.length > 0 || myIntros.some((i) => i.status === "pending")) && (
            <Panel>
              <PanelHead>Devam eden görüşmeler</PanelHead>
              <ul>
                {myIntros.filter((i) => i.status === "pending").map((i) => (
                  <li key={i.id} className="border-b border-ortaq-border px-5 py-3 last:border-b-0">
                    <span className="text-[0.8125rem] font-medium text-ortaq-ink">{getManufacturer(i.manufacturerId)?.name}</span>
                    <p className="mt-0.5 text-[0.75rem] text-ortaq-ink-muted">Yanıt bekleniyor</p>
                  </li>
                ))}
                {myIntros.filter((i) => i.status === "accepted").map((i) => {
                  const room = myRooms.find((r) => r.manufacturerId === i.manufacturerId);
                  return (
                    <li key={i.id} className="flex items-center justify-between border-b border-ortaq-border px-5 py-3 last:border-b-0">
                      <span className="text-[0.8125rem] font-medium text-ortaq-ink">{getManufacturer(i.manufacturerId)?.name}</span>
                      {room && <Link href={`/demo/oda/${room.id}`} className="text-[0.8125rem] font-semibold text-ortaq-trust-muted hover:underline">Odaya git →</Link>}
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          {watch.length > 0 && (
            <Panel>
              <PanelHead>İzleme listesi</PanelHead>
              <ul>
                {MANUFACTURERS.filter((m) => watch.includes(m.id)).map((m) => (
                  <li key={m.id} className="flex items-center justify-between border-b border-ortaq-border px-5 py-3 last:border-b-0">
                    <Link href={`/demo/sirket/${m.id}`} className="text-[0.8125rem] font-medium text-ortaq-ink hover:underline">{m.name}</Link>
                    <button onClick={() => toggleWatch(m.id)} className="text-[0.6875rem] text-ortaq-ink-soft hover:text-ortaq-ink">çıkar</button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
