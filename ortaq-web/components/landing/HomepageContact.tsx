"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const teamKeys = ["1", "2", "3"] as const;

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
      className="border-b border-ortaq-border bg-ortaq-bg-alt scroll-mt-20"
      aria-label={t("homeLanding.contact.aria")}
    >
      <Container wide className="py-10 sm:py-12 lg:py-14">
        <div className="landing-fade-in max-w-3xl">
          <p className={typography.label}>{t("homeLanding.contact.label")}</p>
          <h2 className={cn(typography.h1, "mt-2 text-[1.5rem] sm:text-[1.75rem]")}>
            {t("homeLanding.contact.title")}
          </h2>
          <p className={cn(typography.body, "mt-3")}>{t("homeLanding.contact.lead")}</p>
        </div>

        <div className="landing-fade-in-delayed mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className={typography.label}>{t("homeLanding.contact.teamLabel")}</p>
            <ul className="mt-4 space-y-3">
              {teamKeys.map((key) => (
                <li
                  key={key}
                  className="rounded-ortaq-md border border-dashed border-ortaq-border-strong bg-ortaq-surface/60 px-4 py-4"
                >
                  <p className={cn(typography.bodySm, "font-medium text-ortaq-ink-muted")}>
                    {t(`homeLanding.contact.team.${key}.name`)}
                  </p>
                  <p className={cn(typography.caption, "mt-1")}>{t(`homeLanding.contact.team.${key}.role`)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="product-card p-5 sm:p-6">
            {submitted ? (
              <p className={cn(typography.body, "text-ortaq-trust")}>{t("homeLanding.contact.form.success")}</p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="contact-name" className={typography.caption}>
                    {t("homeLanding.contact.form.name")}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-surface px-3 py-2.5 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-ink-soft"
                    placeholder={t("homeLanding.contact.form.namePlaceholder")}
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
                    className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-surface px-3 py-2.5 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-ink-soft"
                    placeholder={t("homeLanding.contact.form.emailPlaceholder")}
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
                    className="mt-1 w-full rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-surface px-3 py-2.5 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-ink-soft"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {t("homeLanding.contact.form.rolePlaceholder")}
                    </option>
                    <option value="company">{t("homeLanding.contact.form.roleCompany")}</option>
                    <option value="investor">{t("homeLanding.contact.form.roleInvestor")}</option>
                    <option value="partner">{t("homeLanding.contact.form.rolePartner")}</option>
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
                    rows={4}
                    className="mt-1 w-full resize-y rounded-ortaq-sm border border-ortaq-border-strong bg-ortaq-surface px-3 py-2.5 text-[0.875rem] text-ortaq-ink outline-none focus:border-ortaq-ink-soft"
                    placeholder={t("homeLanding.contact.form.messagePlaceholder")}
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  {t("homeLanding.contact.form.submit")}
                </Button>
                <p className={cn(typography.caption)}>{t("homeLanding.contact.form.note")}</p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
