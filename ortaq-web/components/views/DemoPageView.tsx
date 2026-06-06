"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { typography } from "@/design/typography";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";

type FormState = "idle" | "submitting" | "success" | "error";

export function DemoPageView() {
  const { t } = useTranslation();
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    corridor: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <PublicShell stickyCta={false}>
      <section className="bg-ortaq-surface border-b border-ortaq-border">
        <Container wide>
          <div className="grid min-h-[calc(100dvh-4rem)] gap-12 py-14 sm:py-16 lg:grid-cols-2 lg:items-start lg:py-20">
            {/* Left — context */}
            <div className="max-w-md">
              <p className={cn(typography.label, "mb-3 text-ortaq-trust")}>
                Demo
              </p>
              <h1 className={cn(typography.display, "mb-4")}>
                İşlem Odanızı Birlikte Açalım.
              </h1>
              <p className={cn(typography.body, "mb-8 leading-relaxed")}>
                Demo talepte bulunun. Ekibimiz 24 saat içinde size ulaşır ve
                kullanım senaryonuza özel bir demo hazırlar.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Özelleştirilmiş demo",
                    desc: "Kendi ticaret koridorunuz ve ürün tipinize göre iş akışı gösterimi.",
                  },
                  {
                    title: "24 saat yanıt",
                    desc: "Talebinizi aldıktan sonra 24 iş saati içinde iletişime geçiyoruz.",
                  },
                  {
                    title: "Kurulum gerektirmez",
                    desc: "Sistem entegrasyonu veya kurulum yok. Canlı demo, soru & cevap.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ortaq-trust/15">
                      <svg className="h-3 w-3 text-ortaq-trust" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.875rem] font-semibold text-ortaq-ink">{title}</p>
                      <p className={cn(typography.bodySm, "mt-0.5")}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className={cn(typography.caption, "mt-8 text-ortaq-ink-soft")}>
                {t("trade.cta.operator")}
              </p>
            </div>

            {/* Right — form */}
            <div className="rounded-ortaq-lg border border-ortaq-border bg-ortaq-bg p-6 shadow-[var(--shadow-elevated)] sm:p-8">
              {state === "success" ? (
                <div className="flex min-h-[20rem] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ortaq-trust/10">
                    <svg className="h-7 w-7 text-ortaq-trust" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className={cn(typography.h2, "mb-2")}>Talebiniz alındı.</h2>
                  <p className={cn(typography.body, "max-w-xs")}>
                    Ekibimiz 24 saat içinde{" "}
                    <strong className="text-ortaq-ink">{form.email}</strong>{" "}
                    adresine ulaşacak.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className={cn(typography.h2, "mb-5")}>Demo Talebi</h2>

                  <Field
                    label="Ad Soyad"
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  />
                  <Field
                    label="Şirket"
                    id="company"
                    type="text"
                    required
                    value={form.company}
                    onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                  />
                  <Field
                    label="E-posta"
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  />

                  <div>
                    <label htmlFor="corridor" className={cn(typography.label, "mb-1.5 block")}>
                      Ticaret Koridoru
                    </label>
                    <select
                      id="corridor"
                      value={form.corridor}
                      onChange={(e) => setForm((f) => ({ ...f, corridor: e.target.value }))}
                      className="w-full rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-3 py-2.5 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-ink focus:ring-0"
                    >
                      <option value="">Seçiniz (isteğe bağlı)</option>
                      <option value="turkey-asean">Türkiye ↔ ASEAN</option>
                      <option value="turkey-gulf">Türkiye ↔ Körfez</option>
                      <option value="turkey-europe">Türkiye ↔ Avrupa</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={cn(typography.label, "mb-1.5 block")}>
                      Kısa Not (isteğe bağlı)
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Ürün, hacim, hedef pazar..."
                      className="w-full resize-none rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-3 py-2.5 text-[0.875rem] text-ortaq-ink placeholder:text-ortaq-ink-soft outline-none focus:border-ortaq-ink"
                    />
                  </div>

                  {state === "error" && (
                    <p className="rounded-ortaq-sm border border-red-200 bg-red-50 px-3 py-2.5 text-[0.8125rem] text-red-700">
                      Bir sorun oluştu. Lütfen{" "}
                      <a href="mailto:destek@ortaq.biz" className="font-medium underline">
                        destek@ortaq.biz
                      </a>{" "}
                      adresine yazın.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="w-full inline-flex min-h-12 items-center justify-center rounded-ortaq-sm bg-ortaq-ink px-6 text-[0.9375rem] font-semibold text-ortaq-cream shadow-[var(--shadow-product)] transition-colors hover:bg-ortaq-ink-muted disabled:opacity-60"
                  >
                    {state === "submitting" ? "Gönderiliyor..." : "Demo Talep Et"}
                  </button>

                  <p className={cn(typography.caption, "text-center")}>
                    Bilgileriniz yalnızca demo hazırlığı için kullanılır.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}

function Field({
  label,
  id,
  type,
  required,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={cn("text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ortaq-ink-soft mb-1.5 block")}>
        {label}
        {required && <span className="ml-1 text-ortaq-accent">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-ortaq-sm border border-ortaq-border bg-ortaq-surface px-3 py-2.5 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-ink placeholder:text-ortaq-ink-soft"
      />
    </div>
  );
}
