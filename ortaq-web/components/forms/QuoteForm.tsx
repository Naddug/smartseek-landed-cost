"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

type FormState = "idle" | "submitting" | "success" | "error";

export function QuoteForm() {
  const { t } = useTranslation();
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    market: "",
    product: "",
    volume: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "quote_form",
          name: form.name,
          company: form.company,
          email: form.email,
          market: form.market,
          product: form.product,
          volume: form.volume,
          message: form.message,
        }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-ortaq-trust/30 bg-ortaq-trust/5 px-6 py-8 text-center">
        <p className="text-[1.125rem] font-bold text-ortaq-ink">{t("quote.form.successTitle")}</p>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
          {t("quote.form.successBody")}
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-ortaq-border bg-white px-4 py-3 text-[0.9375rem] text-ortaq-ink outline-none transition-colors focus:border-ortaq-trust";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[0.75rem] font-semibold text-ortaq-ink">
            {t("quote.form.name")} *
          </label>
          <input
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[0.75rem] font-semibold text-ortaq-ink">
            {t("quote.form.company")} *
          </label>
          <input
            required
            className={inputClass}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[0.75rem] font-semibold text-ortaq-ink">
          {t("quote.form.email")} *
        </label>
        <input
          required
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[0.75rem] font-semibold text-ortaq-ink">
          {t("quote.form.market")} *
        </label>
        <input
          required
          className={inputClass}
          placeholder={t("quote.form.marketPlaceholder")}
          value={form.market}
          onChange={(e) => setForm({ ...form, market: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[0.75rem] font-semibold text-ortaq-ink">
          {t("quote.form.product")} *
        </label>
        <input
          required
          className={inputClass}
          placeholder={t("quote.form.productPlaceholder")}
          value={form.product}
          onChange={(e) => setForm({ ...form, product: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[0.75rem] font-semibold text-ortaq-ink">
          {t("quote.form.volume")}
        </label>
        <input
          className={inputClass}
          placeholder={t("quote.form.volumePlaceholder")}
          value={form.volume}
          onChange={(e) => setForm({ ...form, volume: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[0.75rem] font-semibold text-ortaq-ink">
          {t("quote.form.message")}
        </label>
        <textarea
          rows={4}
          className={cn(inputClass, "resize-y")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      {state === "error" && (
        <p className="text-[0.875rem] text-red-600">{t("quote.form.error")}</p>
      )}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-ortaq-trust px-8 text-[1rem] font-bold text-white transition-all hover:bg-ortaq-trust-deep disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? t("quote.form.submitting") : t("quote.form.submit")}
      </button>
    </form>
  );
}
