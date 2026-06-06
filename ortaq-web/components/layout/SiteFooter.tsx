"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock, FileText, Scale } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const trustIcons = [ShieldCheck, Lock, FileText, Scale] as const;
const trustKeys = ["1", "2", "3", "4"] as const;

const footerLinkClass = cn(
  typography.bodySm,
  "inline-flex min-h-10 items-center text-ortaq-cream/75 transition-colors hover:text-ortaq-cream",
);

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-ortaq-trust/20 bg-gradient-to-b from-ortaq-trust-deep/95 via-ortaq-ink-panel to-[#0f1210] pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-6 text-ortaq-cream md:pb-10 md:pt-10">
      <Container wide>
        <div className="rounded-ortaq-lg border border-ortaq-cream/10 bg-ortaq-cream/[0.04] px-4 py-5 sm:px-6 sm:py-7">
          <p className={cn(typography.label, "text-ortaq-trust-soft/90")}>{t("footer.protectionLabel")}</p>
          <p className={cn(typography.bodySm, "mt-2 max-w-3xl font-medium leading-relaxed text-ortaq-cream/85")}>
            {t("footer.regulatory")}
          </p>
          <p className={cn(typography.caption, "mt-2 leading-relaxed text-ortaq-cream/55")}>{t("footer.notAdvice")}</p>

          <ul className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustKeys.map((key, i) => {
              const Icon = trustIcons[i];
              return (
                <li
                  key={key}
                  className="flex items-start gap-2.5 rounded-ortaq-md border border-ortaq-cream/8 bg-ortaq-cream/[0.03] px-3 py-2.5"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ortaq-trust-soft" strokeWidth={1.75} />
                  <span className={cn(typography.caption, "font-medium leading-snug text-ortaq-cream/75")}>
                    {t(`footer.trustPills.${key}`)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-ortaq-lg border border-ortaq-cream/10 bg-ortaq-trust/15 px-4 py-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className={cn(typography.label, "text-ortaq-trust-soft/80")}>{t("footer.faqTeaser.label")}</p>
            <p className={cn(typography.bodySm, "mt-1 font-medium text-ortaq-cream/90")}>{t("footer.faqTeaser.title")}</p>
          </div>
          <Link href="/sss" className={cn(typography.bodySm, "inline-flex min-h-11 w-full items-center justify-center rounded-ortaq-md border border-ortaq-cream/15 bg-ortaq-cream/[0.06] px-4 font-semibold text-ortaq-trust-soft transition-colors hover:border-ortaq-cream/25 hover:bg-ortaq-cream/10 hover:text-ortaq-cream sm:w-auto sm:min-w-[10rem] sm:justify-center sm:border-0 sm:bg-transparent sm:px-0 sm:hover:underline")}>
            {t("footer.faqTeaser.link")} →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ortaq-cream/10 pt-8 sm:gap-x-8 lg:grid-cols-12 lg:gap-10 lg:pt-10">
          <div className="col-span-2 lg:col-span-4">
            <Logo theme="dark" variant="stacked" showTagline tagline={t("brand.navTagline")} markSize={40} />
            <p className={cn(typography.bodySm, "mt-4 max-w-sm leading-relaxed text-ortaq-cream/70")}>{t("footer.tagline")}</p>
          </div>

          <div className="lg:col-span-2">
            <p className={cn(typography.label, "mb-2 text-ortaq-cream/50 sm:mb-3")}>{t("footer.learnTitle")}</p>
            <ul className="space-y-1">
              <li><Link href="/nasil-calisir" className={footerLinkClass}>{t("footer.links.process")}</Link></li>
              <li><Link href="/corridors" className={footerLinkClass}>{t("nav.corridors")}</Link></li>
              <li><Link href="/demo" className={footerLinkClass}>{t("nav.startDemo")}</Link></li>
              <li><Link href="/sss" className={footerLinkClass}>{t("footer.links.faq")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={cn(typography.label, "mb-2 text-ortaq-cream/50 sm:mb-3")}>{t("footer.trustTitle")}</p>
            <ul className="space-y-1">
              <li><Link href="/guven" className={footerLinkClass}>{t("footer.links.trust")}</Link></li>
              <li><Link href="/ekip" className={footerLinkClass}>{t("footer.links.team")}</Link></li>
              <li><Link href="/investors" className={footerLinkClass}>{t("footer.links.investors")}</Link></li>
              <li><Link href="/riskler" className={footerLinkClass}>{t("footer.links.risk")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={cn(typography.label, "mb-2 text-ortaq-cream/50 sm:mb-3")}>{t("footer.legalTitle")}</p>
            <ul className="space-y-1">
              <li><Link href="/gizlilik" className={footerLinkClass}>{t("footer.links.privacy")}</Link></li>
              <li><Link href="/kullanim" className={footerLinkClass}>{t("footer.links.terms")}</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <p className={cn(typography.label, "mb-2 text-ortaq-cream/50 sm:mb-3")}>{t("footer.supportTitle")}</p>
            <p className={cn(typography.bodySm, "text-ortaq-cream/70")}>{t("footer.supportText")}</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="mailto:destek@ortaq.biz" className={cn(typography.bodySm, "inline-flex min-h-10 items-center font-medium text-ortaq-trust-soft hover:text-ortaq-cream hover:underline")}>
                  {t("footer.contactEmail")}
                </a>
              </li>
              <li className={cn(typography.bodySm, "text-ortaq-cream/60")}>{t("footer.contactLocation")}</li>
            </ul>
            <p className={cn(typography.caption, "mt-3 max-w-xs leading-relaxed text-ortaq-cream/45")}>{t("footer.dispute")}</p>
          </div>
        </div>

        <div className={cn(typography.caption, "mt-8 space-y-1.5 border-t border-ortaq-cream/10 pt-5 text-ortaq-cream/45 sm:mt-10 sm:pt-6")}>
          <p>{t("footer.entity")}</p>
          <p className="max-w-2xl leading-relaxed">{t("footer.entityNote")}</p>
          <p className="pt-1">© {new Date().getFullYear()} ORTAQ.BIZ</p>
        </div>
      </Container>
    </footer>
  );
}
