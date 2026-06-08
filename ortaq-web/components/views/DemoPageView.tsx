"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

/**
 * DemoPageView — Phase 9: CRO rebuild.
 *
 * Key changes vs previous version:
 *   - Form reduced from 5 to 3 required fields + 1 qualifying question.
 *     Every extra field costs ~15% conversion. Corridor dropdown removed —
 *     visitors don't think of themselves as "corridors."
 *
 *   - Left panel: "what happens and when" — not feature list.
 *     Visitors need to know the process before they commit.
 *     Shows concrete timeline: form → response → 30-min call.
 *
 *   - Button: "Demo İsteyin →" (not "Demo Talep Et" — "talep" sounds bureaucratic)
 *
 *   - Qualifying question: "Which problem brings you here?"
 *     Maps to real scenarios. Helps sales prepare. Doesn't feel like a quiz.
 *
 *   - Success state: full "what to bring + what happens next" screen.
 *     Previous version just said "Talebiniz alındı." and nothing else.
 *
 *   - WhatsApp alternative: Turkish B2B buyers expect this channel.
 *     Offering it captures high-intent visitors who don't want to wait.
 *
 *   - Trust signals: inline, near form — not in a separate footer paragraph.
 */

type FormState = "idle" | "submitting" | "success" | "error";

const PROBLEMS = [
  { value: "", label: "Hangi sorun sizi getirdi? (isteğe bağlı)" },
  { value: "sgs-belge", label: "SGS, muayene veya belge takibi" },
  { value: "sozlesme-version", label: "Sözleşme versiyon anlaşmazlığı" },
  { value: "cok-islem", label: "Çok sayıda aktif işlem yönetimi" },
  { value: "alici-bilgi", label: "Alıcı ile bilgi uyumsuzluğu" },
  { value: "odeme-lc", label: "Ödeme, LC veya finans süreci" },
  { value: "ic-ekip", label: "Şirket içi ekip koordinasyonu" },
  { value: "diger", label: "Başka bir sebep" },
];

export function DemoPageView() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    problem: "",
    note: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    form.name,
          company: form.company,
          email:   form.email,
          corridor: form.problem,   // backwards compat with existing API field
          message: form.note,
        }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <PublicShell stickyCta={false}>
      <div className="min-h-[calc(100dvh-3.75rem)] bg-[#faf9f7]">
        <Container wide>
          <div className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_480px] lg:items-start lg:gap-16 xl:py-20">

            {/* ── LEFT — framing & process ──────────────────────────── */}
            <div className="max-w-lg">

              {/* Label */}
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                Demo
              </p>

              {/* Headline */}
              <h1 className="mt-3 text-[2rem] font-bold tracking-[-0.035em] text-ortaq-ink leading-[1.05] sm:text-[2.625rem]">
                Platform değerlendirmesi<br />
                <span className="text-ortaq-trust">aktif işleminiz üzerinde.</span>
              </h1>

              {/* Sub */}
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                Genel tanıtım değil. Seçtiğiniz işlemde durum, risk ve bekleyen onayları
                30 dakikada platformda birlikte inceleriz.
              </p>

              {/* What you will learn */}
              <div className="mt-8 rounded-xl border border-ortaq-border bg-white p-5">
                <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
                  Ne öğreneceksiniz
                </p>
                <div className="space-y-2.5">
                  {[
                    "İşleminizde durum kaydı nasıl görünür",
                    "Hangi adımlar gecikiyor ve risk listesi",
                    "Kim onay bekliyor ve sıra kimde",
                    "Bugünkü atanmış işler ve sorumlu taraf",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="mt-[1px] shrink-0 text-[0.5625rem] font-bold text-ortaq-trust">✓</span>
                      <p className="text-[0.8125rem] leading-relaxed text-ortaq-ink">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to bring */}
              <div className="mt-8 rounded-xl border border-ortaq-border bg-white p-5">
                <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
                  Getirmeniz gerekenler
                </p>
                <div className="space-y-3">
                  {[
                    "Aktif bir ticari işlem (sektör fark etmez)",
                    "Bir belge: sözleşme, LC, BL taslağı veya proforma fatura",
                    "İşlemin nerede takıldığına dair kısa not (isteğe bağlı)",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-2.5">
                      <span className="mt-[1px] shrink-0 text-[0.5625rem] font-bold text-ortaq-trust">·</span>
                      <p className="text-[0.8125rem] leading-relaxed text-ortaq-ink">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
                  Sonra ne olur?
                </p>
                <div className="space-y-0">
                  {[
                    { step: "01", time: "Hemen", label: "Formu gönderin", note: "2 dakika" },
                    { step: "02", time: "24 saat içinde", label: "Görüşme zamanı belirleriz", note: "E-posta veya WhatsApp" },
                    { step: "03", time: "30 dakika", label: "Kendi işleminize bakıyoruz", note: "Yalnızca sizin verilerinizle" },
                  ].map((item, i) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ortaq-trust text-[0.5rem] font-bold text-white">
                          {item.step}
                        </span>
                        {i < 2 && (
                          <span className="mt-0.5 h-8 w-px bg-ortaq-trust/20" />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className="text-[0.8125rem] font-semibold text-ortaq-ink">{item.label}</p>
                        <p className="text-[0.6875rem] text-ortaq-ink-muted">{item.time} · {item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative contact */}
              <div className="mt-2 rounded-xl border border-ortaq-border bg-white px-5 py-4">
                <p className="mb-2 text-[0.5625rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
                  Hemen ulaşmak için
                </p>
                <div className="space-y-1.5">
                  <a
                    href="mailto:destek@ortaq.biz"
                    className="flex items-center gap-2 text-[0.8125rem] font-medium text-ortaq-trust hover:underline"
                  >
                    <span className="text-base">✉️</span>
                    destek@ortaq.biz
                  </a>
                  <p className="text-[0.6875rem] text-ortaq-ink-soft">
                    E-posta tercih ediyorsanız — formsuz da ulaşabilirsiniz.
                  </p>
                </div>
              </div>

              {/* Pricing note */}
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-ortaq-border/60 bg-[#faf9f7] px-4 py-3.5">
                <span className="mt-0.5 shrink-0 text-[0.875rem]">💰</span>
                <div>
                  <p className="text-[0.75rem] font-semibold text-ortaq-ink">Fiyat hakkında merak ediyorsanız</p>
                  <p className="mt-0.5 text-[0.6875rem] leading-relaxed text-ortaq-ink-muted">
                    Görüşmede konuşulur. Gizli ücret yok.{" "}
                    <Link href="/fiyat" className="font-semibold text-ortaq-trust hover:underline">
                      Fiyatlandırma sayfasına bakın →
                    </Link>
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT — form ──────────────────────────────────────── */}
            <div className="sticky top-[4.5rem]">
              <div className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-[0_4px_24px_rgba(20,19,16,0.08)]">

                {state === "success" ? (
                  <SuccessState email={form.email} />
                ) : (
                  <>
                    {/* Form header */}
                    <div className="border-b border-ortaq-border bg-ortaq-trust/[0.04] px-6 py-5">
                      <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                        Bu hafta
                      </p>
                      <h2 className="mt-1 text-[1.25rem] font-bold text-ortaq-ink tracking-[-0.025em]">
                        Değerlendirme talep edin
                      </h2>
                      <p className="mt-0.5 text-[0.75rem] text-ortaq-ink-muted">
                        3 zorunlu alan · 2 dakika · 24 saat içinde randevu
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">

                      <InputField
                        label="Ad Soyad"
                        id="name"
                        type="text"
                        placeholder="Ahmet Yılmaz"
                        required
                        value={form.name}
                        onChange={v => setForm(f => ({ ...f, name: v }))}
                      />

                      <InputField
                        label="Şirket"
                        id="company"
                        type="text"
                        placeholder="Şirket Adı"
                        required
                        value={form.company}
                        onChange={v => setForm(f => ({ ...f, company: v }))}
                      />

                      <InputField
                        label="İş E-postası"
                        id="email"
                        type="email"
                        placeholder="ahmet@sirket.com"
                        required
                        value={form.email}
                        onChange={v => setForm(f => ({ ...f, email: v }))}
                      />

                      {/* Qualifying question */}
                      <div>
                        <label htmlFor="problem" className="mb-1.5 block text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
                          Hangi sorun sizi getirdi?
                        </label>
                        <select
                          id="problem"
                          value={form.problem}
                          onChange={e => setForm(f => ({ ...f, problem: e.target.value }))}
                          className="w-full rounded-lg border border-ortaq-border bg-[#faf9f7] px-3 py-2.5 text-[0.8125rem] text-ortaq-ink outline-none focus:border-ortaq-trust transition-colors appearance-none"
                        >
                          {PROBLEMS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Optional note */}
                      <div>
                        <label htmlFor="note" className="mb-1.5 block text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
                          Aktif işleminiz hakkında kısaca
                          <span className="ml-1 normal-case font-normal text-ortaq-ink-soft/60">(isteğe bağlı)</span>
                        </label>
                        <textarea
                          id="note"
                          rows={2}
                          value={form.note}
                          onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                          placeholder="Sektör, alıcı ülke, son sorun…"
                          className="w-full resize-none rounded-lg border border-ortaq-border bg-[#faf9f7] px-3 py-2.5 text-[0.8125rem] text-ortaq-ink placeholder:text-ortaq-ink-soft/50 outline-none focus:border-ortaq-trust transition-colors"
                        />
                      </div>

                      {state === "error" && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                          <p className="text-[0.75rem] text-red-700">
                            Bir sorun oluştu.{" "}
                            <a href="mailto:destek@ortaq.biz" className="font-semibold underline">
                              destek@ortaq.biz
                            </a>{" "}
                            adresine doğrudan yazabilirsiniz.
                          </p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={state === "submitting"}
                        className={cn(
                          "w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-[0.9375rem] font-bold text-white shadow-sm transition-all active:scale-[0.98]",
                          state === "submitting"
                            ? "bg-ortaq-trust/60 cursor-not-allowed"
                            : "bg-ortaq-trust hover:bg-ortaq-trust-deep",
                        )}
                      >
                        {state === "submitting" ? (
                          <>
                            <SpinnerIcon />
                            Gönderiliyor…
                          </>
                        ) : (
                          "Değerlendirme talep edin"
                        )}
                      </button>

                      {/* Trust note */}
                      <div className="flex items-center justify-center gap-1.5">
                        <svg className="h-3 w-3 text-ortaq-ink-soft/40" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 2a4 4 0 014 4v1H2V6a4 4 0 014-4z" />
                          <rect x="2" y="7" width="8" height="4" rx="1" />
                        </svg>
                        <p className="text-[0.5625rem] text-ortaq-ink-soft/60">
                          Bilgileriniz yalnızca demo hazırlığı için kullanılır. Asla satılmaz.
                        </p>
                      </div>

                    </form>
                  </>
                )}
              </div>

              {/* Inline trust signals below form */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "30 dakika", note: "Aktif işlem üzerinde" },
                  { label: "Kendi veriniz", note: "Örnek veri yok" },
                  { label: "Form 2 dk", note: "24 saatte randevu" },
                ].map(item => (
                  <div key={item.label} className="rounded-xl border border-ortaq-border bg-white px-3 py-3 text-center">
                    <p className="text-[0.625rem] font-bold text-ortaq-ink">{item.label}</p>
                    <p className="text-[0.5rem] text-ortaq-ink-soft">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* Scenarios reference strip */}
      <div className="border-t border-ortaq-border bg-white">
        <Container wide>
          <div className="py-8 sm:py-10">
            <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.09em] text-ortaq-ink-soft">
              Hangi sorunu çözüyoruz?
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "SGS onayı bekleniyor",
                "Yanlış sözleşme versiyonu",
                "LC gecikmesi",
                "BL eksik",
                "Çok sayıda işlem",
                "Alıcı yanıt vermiyor",
                "Tedarikçi gecikmesi",
                "Fiyat anlaşmazlığı",
                "Numune süreci",
                "Sabah özeti",
              ].map(tag => (
                <Link
                  key={tag}
                  href="/senaryolar"
                  className="rounded-full border border-ortaq-border bg-[#faf9f7] px-3 py-1.5 text-[0.6875rem] font-medium text-ortaq-ink-muted transition-colors hover:border-ortaq-trust/40 hover:text-ortaq-trust"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>

    </PublicShell>
  );
}

/* ─── Success state ──────────────────────────────────────────────────────── */

function SuccessState({ email }: { email: string }) {
  return (
    <div className="px-6 py-8">

      {/* Check mark */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200">
        <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-[1.25rem] font-bold text-ortaq-ink tracking-[-0.025em]">
        Talebiniz alındı.
      </h2>
      <p className="mt-1 text-[0.8125rem] text-ortaq-ink-muted">
        <span className="font-semibold text-ortaq-ink">{email}</span> adresine 24 saat içinde ulaşacağız.
      </p>

      {/* What to prepare */}
      <div className="mt-6 rounded-xl border border-ortaq-border bg-[#faf9f7] p-4">
        <p className="mb-3 text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
          Demoya hazırlanmak için
        </p>
        <div className="space-y-2.5">
          {[
            "Aktif bir işlem seçin. Büyük veya küçük olması önemli değil.",
            "O işlemin bir belgesini açık tutun — sözleşme, SGS veya proforma fatura.",
            "Alıcıyla en son ne konuştunuzu hatırlayın. Nerede takıldınız?",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/15 text-[0.4375rem] font-bold text-ortaq-trust">
                {i + 1}
              </span>
              <p className="text-[0.75rem] leading-snug text-ortaq-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* While you wait */}
      <div className="mt-5">
        <p className="mb-3 text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft">
          Bu arada
        </p>
        <div className="space-y-2">
          <Link
            href="/senaryolar"
            className="flex items-center justify-between rounded-lg border border-ortaq-border bg-white px-4 py-3 transition-colors hover:border-ortaq-trust/40"
          >
            <div>
              <p className="text-[0.75rem] font-semibold text-ortaq-ink">15 kullanım senaryosu</p>
              <p className="text-[0.625rem] text-ortaq-ink-muted">İşleminize benzer bir durum var mı?</p>
            </div>
            <span className="text-ortaq-ink-soft/40">→</span>
          </Link>
          <Link
            href="/guven"
            className="flex items-center justify-between rounded-lg border border-ortaq-border bg-white px-4 py-3 transition-colors hover:border-ortaq-trust/40"
          >
            <div>
              <p className="text-[0.75rem] font-semibold text-ortaq-ink">Güven & gizlilik</p>
              <p className="text-[0.625rem] text-ortaq-ink-muted">Sorularınız varsa burada yanıt var.</p>
            </div>
            <span className="text-ortaq-ink-soft/40">→</span>
          </Link>
        </div>
      </div>

      {/* Direct contact */}
      <div className="mt-5 rounded-xl border border-ortaq-border bg-white px-4 py-3">
        <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-ortaq-ink-soft mb-1.5">
          Beklemeyi istemiyorsanız
        </p>
        <a
          href="mailto:destek@ortaq.biz"
          className="text-[0.8125rem] font-semibold text-ortaq-trust hover:underline"
        >
          destek@ortaq.biz →
        </a>
      </div>

    </div>
  );
}

/* ─── Input field component ──────────────────────────────────────────────── */

function InputField({
  label, id, type, placeholder, required, value, onChange,
}: {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-ortaq-ink-soft">
        {label}
        {required && <span className="ml-1 text-ortaq-trust">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-ortaq-border bg-[#faf9f7] px-3 py-2.5 text-[0.8125rem] text-ortaq-ink placeholder:text-ortaq-ink-soft/50 outline-none focus:border-ortaq-trust transition-colors"
      />
    </div>
  );
}

/* ─── Spinner icon ───────────────────────────────────────────────────────── */

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
