"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { submitLead } from "@/lib/leads/client";
import type { LeadPayload } from "@/lib/leads/types";

export function HomepageContact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorCode(null);

    const fd = new FormData(e.currentTarget);
    const payload: LeadPayload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      role: String(fd.get("role") ?? "") as LeadPayload["role"],
      message: String(fd.get("message") ?? "") || undefined,
    };

    const result = await submitLead(payload);
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorCode(result.error);
    }
  }

  return (
    <section
      id="basvuru"
      className="border-b border-ortaq-border bg-ortaq-surface scroll-mt-20"
      aria-label={t("homeLanding.contact.aria")}
    >
      <Container wide className="py-10 sm:py-12">
        <div className="mx-auto max-w-lg">
          <p className={typography.label}>{t("homeLanding.contact.label")}</p>
          <h2 className={cn(typography.h2, "mt-2 text-xl sm:text-2xl")}>{t("homeLanding.contact.title")}</h2>
          <p className={cn(typography.bodySm, "mt-2")}>{t("homeLanding.contact.lead")}</p>
          <p className={cn(typography.caption, "mt-3 rounded-ortaq-md border border-ortaq-border bg-ortaq-bg-alt px-3 py-2.5 leading-relaxed text-ortaq-ink-muted")}>
            {t("homeLanding.contact.producerTrust")}
          </p>

          {status === "success" ? (
            <p className={cn(typography.body, "mt-6 text-ortaq-trust")}>{t("homeLanding.contact.form.success")}</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              {status === "error" && (
                <div className="rounded-ortaq-md border border-red-200 bg-red-50 px-4 py-3 text-[0.8125rem] text-red-900">
                  <p>{t("homeLanding.contact.form.error")}</p>
                  <p className="mt-1">
                    <a href="mailto:destek@ortaq.biz" className="font-semibold underline">
                      destek@ortaq.biz
                    </a>
                  </p>
                  {errorCode && process.env.NODE_ENV === "development" && (
                    <p className="mt-1 font-mono text-[0.6875rem] opacity-70">{errorCode}</p>
                  )}
                </div>
              )}
              <div>
                <label htmlFor="contact-name" className={typography.caption}>
                  {t("homeLanding.contact.form.name")}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  disabled={status === "loading"}
                  className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg px-3 py-2.5 text-[0.875rem] disabled:opacity-60"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={typography.caption}>
                  {t("homeLanding.contact.form.email")}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  disabled={status === "loading"}
                  className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg px-3 py-2.5 text-[0.875rem] disabled:opacity-60"
                />
              </div>
              <div>
                <label htmlFor="contact-role" className={typography.caption}>
                  {t("homeLanding.contact.form.role")}
                </label>
                <select
                  id="contact-role"
                  name="role"
                  required
                  disabled={status === "loading"}
                  className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg px-3 py-2.5 text-[0.875rem] disabled:opacity-60"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t("homeLanding.contact.form.rolePlaceholder")}
                  </option>
                  <option value="company">{t("homeLanding.contact.form.roleCompany")}</option>
                  <option value="investor">{t("homeLanding.contact.form.roleInvestor")}</option>
                  <option value="other">{t("homeLanding.contact.form.roleOther")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className={typography.caption}>
                  {t("homeLanding.contact.form.message")}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={3}
                  disabled={status === "loading"}
                  placeholder={t("homeLanding.contact.form.messagePlaceholder")}
                  className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg px-3 py-2.5 text-[0.875rem] disabled:opacity-60"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={status === "loading"}>
                {status === "loading" ? t("homeLanding.contact.form.submitting") : t("homeLanding.contact.form.submit")}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
