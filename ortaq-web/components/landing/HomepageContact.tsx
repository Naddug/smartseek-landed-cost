"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

export function HomepageContact() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
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

          {submitted ? (
            <p className={cn(typography.body, "mt-6 text-ortaq-trust")}>{t("homeLanding.contact.form.success")}</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="contact-name" className={typography.caption}>
                  {t("homeLanding.contact.form.name")}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg px-3 py-2.5 text-[0.875rem]"
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
                  className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg px-3 py-2.5 text-[0.875rem]"
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
                  className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-bg px-3 py-2.5 text-[0.875rem]"
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
              <Button type="submit" variant="primary" size="lg" fullWidth>
                {t("homeLanding.contact.form.submit")}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
