"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { getManufacturer, capitalAsk, openQuestion } from "@/lib/demo/data";
import { Panel, OpportunityHook, trustFromSignals } from "@/components/demo/DemoKit";
import { cn } from "@/lib/cn";

export default function DealRoom() {
  const params = useParams();
  const id = String(params.id);
  const { rooms, addMessage } = useDemo();
  const room = rooms.find((r) => r.id === id);
  const [as, setAs] = useState<"capital" | "manufacturer">("capital");
  const [text, setText] = useState("");

  if (!room) {
    return (
      <div className="py-16 text-center">
        <p className="text-ortaq-ink-muted">Görüşme odası bulunamadı.</p>
        <Link href="/demo/sermaye" className="mt-3 inline-block text-[0.8125rem] text-ortaq-trust-muted hover:underline">Keşfe dön</Link>
      </div>
    );
  }
  const man = getManufacturer(room.manufacturerId);

  const send = () => {
    if (!text.trim()) return;
    addMessage(room.id, as, text.trim());
    setText("");
  };

  const dealNext = man
    ? `${openQuestion(man)} Kapasite planı ve marj yapısını doğrudan sorun.`
    : "Açık soruları doğrudan sorun.";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={man ? `/demo/sirket/${man.id}` : "/demo/sermaye"} className="text-[0.75rem] text-ortaq-ink-soft hover:text-ortaq-ink">← {man?.name ?? "Keşif"}</Link>

      {man && (
        <OpportunityHook
          name={man.name}
          capitalLine={capitalAsk(man)}
          summary={man.summary}
          urgency={man.attentionNow}
          trust={trustFromSignals(man.signals)}
          next={dealNext}
        />
      )}

      <p className="text-[0.8125rem] text-ortaq-ink-muted">
        {room.partnerName} ile görüşme · karşılıklı kabul · belgeler profilde incelendi
      </p>

      <Panel>
        <div className="flex items-center justify-between border-b border-ortaq-border px-5 py-2.5">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ortaq-ink-soft">
            {man ? `${man.name} · görüşme notları` : "Görüşme notları"}
          </span>
          <div className="flex items-center gap-1 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-ortaq-ink-soft">
            <button onClick={() => setAs("capital")} className={cn("rounded-ortaq-sm px-2 py-0.5", as === "capital" ? "bg-ortaq-ink text-ortaq-cream" : "hover:text-ortaq-ink")}>Sermaye</button>
            <span className="opacity-40">·</span>
            <button onClick={() => setAs("manufacturer")} className={cn("rounded-ortaq-sm px-2 py-0.5", as === "manufacturer" ? "bg-ortaq-ink text-ortaq-cream" : "hover:text-ortaq-ink")}>Üretici</button>
          </div>
        </div>

        <div className="space-y-3 px-5 py-5">
          {room.messages.length === 1 && (
            <p className="pb-2 text-center text-[0.75rem] leading-[1.5] text-ortaq-ink-muted">
              {man ? `${capitalAsk(man)} konusunda sorularınızı yazın.` : "Sorularınızı yazın."}
            </p>
          )}
          {room.messages.map((m) => (
            <div key={m.id} className={cn("flex", m.from === "capital" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[80%] rounded-ortaq-md px-3.5 py-2", m.from === "capital" ? "bg-ortaq-ink text-ortaq-cream" : "border border-ortaq-border bg-ortaq-bg text-ortaq-ink")}>
                <p className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] opacity-60">{m.from === "capital" ? room.partnerName : man?.name}</p>
                <p className="mt-1 text-[0.875rem] leading-[1.45]">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-ortaq-border px-5 py-3">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder={as === "capital" ? "Kapasite planı, marj veya açık belge sorusu..." : "Üretici yanıtı..."}
            className="flex-1 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg px-3 py-2 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-border-strong" />
          <button onClick={send} className="rounded-ortaq-md bg-ortaq-trust px-4 py-2 text-[0.8125rem] font-medium text-ortaq-cream hover:opacity-90">Gönder</button>
        </div>
      </Panel>
    </div>
  );
}
