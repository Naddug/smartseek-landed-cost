import Link from "next/link";
import { MANUFACTURERS, matchFit, CURRENT_PARTNER, companyPitch, capitalAsk, openQuestion } from "@/lib/demo/data";
import { OpportunityHook, trustFromSignals, Mono } from "@/components/demo/DemoKit";

const spotlight = MANUFACTURERS.find((m) => m.id === "karat-parca-konya")!;
const { whyNow } = matchFit(spotlight, CURRENT_PARTNER);

export default function DemoHub() {
  return (
    <div>
      <Mono>Öne çıkan fırsat</Mono>
      <h1 className="mt-2 max-w-2xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ortaq-ink sm:text-[2.25rem]">
        {spotlight.name}
      </h1>
      <p className="mt-2 text-[0.9375rem] font-semibold text-ortaq-trust-muted">{capitalAsk(spotlight)}</p>
      <p className="mt-1 text-[0.8125rem] text-ortaq-ink-muted">{companyPitch(spotlight)}</p>

      <div className="mt-6">
        <OpportunityHook
          summary={spotlight.summary}
          urgency={whyNow}
          trust={trustFromSignals(spotlight.signals)}
          next={`${openQuestion(spotlight)} Görüşme talebi gönderin veya profili derinlemesine inceleyin.`}
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/demo/sirket/${spotlight.id}#talep`} className="inline-flex rounded-ortaq-md bg-ortaq-trust px-5 py-3 text-[0.8125rem] font-semibold text-ortaq-cream hover:opacity-90">
            {spotlight.name} ile görüşme talep et →
          </Link>
          <Link href={`/demo/sirket/${spotlight.id}`} className="inline-flex rounded-ortaq-md border border-ortaq-border px-5 py-3 text-[0.8125rem] font-medium text-ortaq-ink hover:border-ortaq-border-strong">
            Profili incele
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Link href="/demo/sermaye" className="group rounded-ortaq-lg bg-ortaq-dark p-7 text-ortaq-cream transition hover:opacity-95">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ortaq-cream/55">Keşif</span>
          <p className="mt-2 text-[1.25rem] font-semibold text-ortaq-cream">Kapasite darboğazı olan ihracatçılar</p>
          <p className="mt-2 text-[0.875rem] leading-[1.55] text-ortaq-cream/75">
            Tezinize uyan fırsatlar; her profilde hazır belgeler, açık sorular ve görüşme yolu.
          </p>
          <span className="mt-4 inline-block text-[0.8125rem] font-medium text-ortaq-cream group-hover:underline">Fırsatları keşfet →</span>
        </Link>

        <Link href="/demo/uretici" className="group rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface p-7 transition hover:border-ortaq-border-strong">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ortaq-ink-soft">Üretici tarafı</span>
          <p className="mt-2 text-[1.25rem] font-semibold text-ortaq-ink">Belge yükleme ve listede görünme</p>
          <p className="mt-2 text-[0.875rem] leading-[1.55] text-ortaq-ink-muted">
            {spotlight.name} belgelerini nasıl yüklediğini ve profilin ne zaman listede göründüğünü görün.
          </p>
          <span className="mt-4 inline-block text-[0.8125rem] font-medium text-ortaq-trust-muted group-hover:underline">Üretici tarafını gör →</span>
        </Link>
      </div>

      <p className="mt-8 text-[0.75rem] leading-[1.5] text-ortaq-ink-muted">
        ORTAQ yatırım satmaz, fon garanti etmez ve para tutmaz. Belgeleri toparlar, listeler ve iki tarafı bir araya getirir.
      </p>
    </div>
  );
}
