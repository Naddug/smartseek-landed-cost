"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo/store";
import { Mono, Tag, Panel, PanelHead, ProfileStatus, FlowContext } from "@/components/demo/DemoKit";

export default function UploadFlow() {
  const { docs, uploadDoc, profileVisibility } = useDemo();
  const allVerified = docs.every((d) => d.status === "verified");
  const reviewing = docs.some((d) => d.status === "reviewing");
  const missingDocs = docs.filter((d) => d.status === "missing");
  const verifiedDocNames = docs.filter((d) => d.status === "verified").map((d) => d.name);

  const flow = allVerified
    ? {
        what: "Profiliniz keşfedilebilir; sermaye partnerleri sizi bulabilir.",
        why: "Tüm zorunlu belgeler doğrulandı.",
        trust: `Doğrulanan: ${verifiedDocNames.join(", ")}.`,
        next: "Sermaye panelinde profilinizin nasıl göründüğüne bakın.",
      }
    : reviewing
      ? {
          what: "Yüklenen belge inceleniyor.",
          why: "Onay sonrası profile işlenir; keşifte görünürlük artar.",
          trust: verifiedDocNames.length > 0 ? `Doğrulanan: ${verifiedDocNames.join(", ")}.` : "Henüz doğrulanmış belge yok.",
          next: "Sonucu bekleyin; ardından kalan eksikleri tamamlayın.",
        }
      : {
          what: "Profil henüz keşfedilebilir değil.",
          why: `Eksik: ${missingDocs.map((d) => d.name).join(", ")}.`,
          trust: verifiedDocNames.length > 0 ? `Doğrulanan: ${verifiedDocNames.join(", ")}.` : "Henüz doğrulanmış belge yok.",
          next: "Eksik belgeleri yükleyin.",
        };

  return (
    <div className="space-y-8">
      <Link href="/demo/uretici" className="text-[0.75rem] text-ortaq-ink-soft hover:text-ortaq-ink">← Üretici profili</Link>

      <div>
        <Mono>Belge yükleme</Mono>
        <h1 className="mt-2 text-[1.625rem] font-semibold tracking-[-0.02em] text-ortaq-ink sm:text-[2rem]">Keşfedilebilir profil için belgeleri tamamlayın</h1>
      </div>

      <FlowContext {...flow} lens="producer" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel>
          <PanelHead>Zorunlu belgeler</PanelHead>
          <ul>
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 border-b border-ortaq-border px-5 py-4 last:border-b-0">
                <div>
                  <p className="text-[0.875rem] font-medium text-ortaq-ink">{d.name}</p>
                  <p className="mt-0.5 text-[0.75rem] text-ortaq-ink-muted">
                    {d.status === "verified" ? "İncelendi" : d.status === "reviewing" ? "İnceleniyor" : "Keşfedilebilir profili engelliyor"}
                  </p>
                </div>
                {d.status === "verified" ? <Tag tone="trust">Doğrulandı</Tag>
                  : d.status === "reviewing" ? <Tag tone="warn">İnceleniyor</Tag>
                  : <button onClick={() => uploadDoc(d.id)} className="rounded-ortaq-md border border-ortaq-border-strong px-3 py-1.5 text-[0.8125rem] font-medium text-ortaq-ink hover:bg-ortaq-bg-alt">Yükle</button>}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4 self-start">
          <ProfileStatus visibility={profileVisibility} missingNames={missingDocs.map((d) => d.name)} />
          {allVerified && (
            <Link href="/demo/sermaye" className="inline-flex w-full justify-center rounded-ortaq-md bg-ortaq-trust px-4 py-3 text-[0.8125rem] font-semibold text-ortaq-cream hover:opacity-90">
              Keşifte profili gör →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
