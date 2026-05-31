"use client";

import Link from "next/link";
import { MANUFACTURERS } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";
import { Mono, Tag, Panel, PanelHead, StageBadge, ProfileStatus, FlowContext, trustFromSignals } from "@/components/demo/DemoKit";
import { JourneyStrip, NextStep } from "@/components/demo/Journey";

const me = MANUFACTURERS[0];

export default function ManufacturerDashboard() {
  const { docs, intros, profileVisibility, setIntro, roomForManufacturer } = useDemo();
  const myIntros = intros.filter((i) => i.manufacturerId === me.id);
  const allVerified = docs.every((d) => d.status === "verified");
  const myRoom = roomForManufacturer(me.id);
  const pendingIntro = myIntros.find((i) => i.status === "pending");
  const missingDocs = docs.filter((d) => d.status === "missing");
  const verifiedDocNames = docs.filter((d) => d.status === "verified").map((d) => d.name);

  const flow = myRoom
    ? {
        what: `${myRoom.partnerName} ile görüşme başladı.`,
        why: me.attentionNow,
        trust: trustFromSignals(me.signals),
        next: "Görüşme odasında devam edin.",
      }
    : pendingIntro
      ? {
          what: `${pendingIntro.partnerName} tanışmak istiyor: "${pendingIntro.note}"`,
          why: me.attentionNow,
          trust: trustFromSignals(me.signals),
          next: "Kabul ederseniz görüşme odası açılır.",
        }
      : !allVerified
        ? {
            what: me.summary,
            why: missingDocs.length > 0 ? `${missingDocs.map((d) => d.name).join(", ")} eksik; profil keşfedilebilir değil.` : "Belge incelemesi sürüyor.",
            trust: verifiedDocNames.length > 0 ? `Doğrulanan belgeler: ${verifiedDocNames.join(", ")}.` : "Henüz doğrulanmış belge yok.",
            next: missingDocs.length > 0 ? "Eksik belgeleri yükleyin." : "Doğrulama sonucunu bekleyin.",
          }
        : {
            what: me.summary,
            why: me.attentionNow,
            trust: trustFromSignals(me.signals),
            next: "Tanıştırma talebi geldiğinde aşağıdan yanıtlayın.",
          };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Mono>Üretici profili</Mono>
          <h1 className="mt-2 text-[1.625rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[2rem]">{me.name}</h1>
          <p className="mt-1 text-[0.875rem] text-ortaq-ink-muted">{me.city} · {me.sector} · {me.markets.join(", ")}</p>
        </div>
        <StageBadge stage={allVerified ? "ready" : profileVisibility === "reviewing" ? "verifying" : me.stage} />
      </div>

      <FlowContext {...flow} lens="producer" />
      <JourneyStrip />

      {!allVerified ? (
        <NextStep prefix="Ne yapmalısınız?" label={`Eksik: ${missingDocs.map((d) => d.name).join(", ")}`} cta="Belge yükle" href="/demo/uretici/yukle" />
      ) : myRoom ? (
        <NextStep prefix="Ne yapmalısınız?" label="Görüşme devam ediyor." cta="Odaya git" href={`/demo/oda/${myRoom.id}`} />
      ) : pendingIntro ? (
        <NextStep prefix="Ne yapmalısınız?" label={`${pendingIntro.partnerName} yanıt bekliyor.`} cta="Yanıt ver" href="#talepler" />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHead>Zorunlu belgeler</PanelHead>
          <ul>
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between border-b border-ortaq-border px-5 py-3 last:border-b-0">
                <span className="text-[0.8125rem] text-ortaq-ink">{d.name}</span>
                {d.status === "verified" ? <Tag tone="trust">Doğrulandı</Tag> : d.status === "reviewing" ? <Tag tone="warn">İnceleniyor</Tag> : <Tag tone="muted">Eksik</Tag>}
              </li>
            ))}
          </ul>
          <div className="border-t border-ortaq-border px-5 py-4">
            {!allVerified ? (
              <Link href="/demo/uretici/yukle" className="inline-flex rounded-ortaq-md bg-ortaq-trust px-4 py-2 text-[0.8125rem] font-medium text-ortaq-cream hover:opacity-90">Eksik belgeleri yükle</Link>
            ) : (
              <p className="text-[0.8125rem] text-ortaq-ink-muted">Profil keşfedilebilir.</p>
            )}
          </div>
        </Panel>

        <ProfileStatus visibility={profileVisibility} missingNames={missingDocs.map((d) => d.name)} />
      </div>

      <div id="talepler" className="scroll-mt-24">
        <Panel>
          <PanelHead>Sermaye tanıştırma talepleri</PanelHead>
          <ul>
            {myIntros.length === 0 && (
              <li className="px-5 py-6 text-[0.8125rem] text-ortaq-ink-soft">Henüz talep yok. Profil keşfedilebilir olduğunda burada görünür.</li>
            )}
            {myIntros.map((r) => {
              const room = roomForManufacturer(me.id);
              return (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-ortaq-border px-5 py-4 last:border-b-0">
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-semibold text-ortaq-ink">{r.partnerName}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-ortaq-ink-muted">{r.note}</p>
                  </div>
                  {r.status === "pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIntro(r.id, "accepted")} className="rounded-ortaq-md bg-ortaq-trust px-3 py-1.5 text-[0.8125rem] font-medium text-ortaq-cream hover:opacity-90">Kabul et</button>
                      <button onClick={() => setIntro(r.id, "declined")} className="rounded-ortaq-md border border-ortaq-border px-3 py-1.5 text-[0.8125rem] text-ortaq-ink-muted">Reddet</button>
                    </div>
                  ) : r.status === "accepted" ? (
                    <Link href={room ? `/demo/oda/${room.id}` : "#"} className="rounded-ortaq-md bg-ortaq-ink px-3 py-1.5 text-[0.8125rem] font-medium text-ortaq-cream hover:opacity-90">Odaya git →</Link>
                  ) : (
                    <Tag tone="muted">Kapandı</Tag>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
