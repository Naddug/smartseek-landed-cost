"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

/**
 * SiteFooter — two-company positioning throughout.
 *
 * TAGLINE: "ORTAQ, alıcı ve satıcının aynı işlem kaydını paylaştığı sistemdir."
 *
 * Every label in the footer reinforces the category:
 *   Şirketler Arası İşlem Kaydı (Company-to-Company Transaction Record)
 *
 * Demo CTA: "Demo İsteyin" (not "Demo Talep Et" — sounds bureaucratic)
 * Email CTA: "Karşı tarafınızla birlikte deneyin" — names both sides
 *
 * Removed:
 *   - Yatırımcılar — wrong audience
 *   - Riskler — defensive signal
 *   - Güven as standalone — merge into product pages
 *
 * Added placeholder:
 *   - Kimler İçin — self-identification for exporters, procurement, traders
 *   - Kullanım Senaryoları — real examples > feature lists
 */

const linkClass = cn(
  typography.bodySm,
  "inline-flex min-h-10 items-center text-ortaq-cream/70 transition-colors hover:text-ortaq-cream",
);

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-ortaq-dark pb-[calc(4rem+env(safe-area-inset-bottom))] pt-10 text-ortaq-cream md:pb-10">
      <Container wide>

        {/* Demo teaser — names both parties explicitly */}
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-ortaq-trust/20 bg-ortaq-trust/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust/60">
              {t("footer.faqTeaser.label")}
            </p>
            <p className="mt-1 text-[0.875rem] font-semibold text-ortaq-cream/90">
              {t("footer.faqTeaser.title")}
            </p>
          </div>
          <Link
            href="/demo"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-ortaq-trust/30 bg-ortaq-trust/10 px-4 text-[0.8125rem] font-semibold text-ortaq-trust transition-colors hover:border-ortaq-trust/50 hover:bg-ortaq-trust/20 sm:shrink-0"
          >
            {t("nav.requestDemo")} →
          </Link>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ortaq-cream/10 pt-8 sm:gap-x-8 lg:grid-cols-12 lg:gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-5">
            <Logo theme="dark" variant="stacked" showTagline tagline={t("brand.navTagline")} markSize={36} />
            <p className={cn(typography.bodySm, "mt-4 max-w-sm leading-relaxed text-ortaq-cream/60")}>
              {t("footer.tagline")}
            </p>
          </div>

          {/* Product links */}
          <div className="lg:col-span-2">
            <p className={cn(typography.label, "mb-3 text-ortaq-cream/40")}>
              {t("footer.learnTitle")}
            </p>
            <ul className="space-y-1">
              <li><Link href="/nasil-calisir" className={linkClass}>{t("footer.links.process")}</Link></li>
              <li><Link href="/kimler-icin"   className={linkClass}>{t("footer.links.whoFor")}</Link></li>
              <li><Link href="/senaryolar"    className={linkClass}>{t("footer.links.useCases")}</Link></li>
              <li><Link href="/sss"           className={linkClass}>{t("footer.links.faq")}</Link></li>
              <li>
                <Link
                  href="/demo"
                  className={cn(linkClass, "font-semibold text-ortaq-trust hover:text-ortaq-trust-soft")}
                >
                  {t("nav.requestDemo")} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <p className={cn(typography.label, "mb-3 text-ortaq-cream/40")}>
              {t("footer.trustTitle")}
            </p>
            <ul className="space-y-1">
              <li><Link href="/ekip"       className={linkClass}>{t("footer.links.team")}</Link></li>
              <li><Link href="/iletisim"   className={linkClass}>İletişim</Link></li>
            </ul>
          </div>

          {/* Legal + contact */}
          <div className="lg:col-span-3">
            <p className={cn(typography.label, "mb-3 text-ortaq-cream/40")}>
              {t("footer.legalTitle")}
            </p>
            <ul className="mb-4 space-y-1">
              <li><Link href="/gizlilik"  className={linkClass}>{t("footer.links.privacy")}</Link></li>
              <li><Link href="/kullanim"  className={linkClass}>{t("footer.links.terms")}</Link></li>
            </ul>
            <p className={cn(typography.label, "mb-2 text-ortaq-cream/40")}>
              {t("footer.supportTitle")}
            </p>
            <a
              href="mailto:destek@ortaq.biz"
              className={cn(linkClass, "font-medium text-ortaq-trust hover:text-ortaq-trust-soft hover:underline")}
            >
              {t("footer.contactEmail")}
            </a>
            <p className={cn(typography.caption, "mt-1 text-ortaq-cream/40")}>
              {t("footer.contactLocation")}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={cn(typography.caption, "mt-8 flex flex-col gap-1 border-t border-ortaq-cream/10 pt-5 text-ortaq-cream/35 sm:flex-row sm:items-center sm:justify-between")}>
          <p>© {new Date().getFullYear()} ORTAQ.BIZ — İstanbul, Türkiye</p>
          <p className="max-w-md text-right leading-relaxed text-ortaq-cream/25">
            Şirketler Arası İşlem Kaydı
          </p>
        </div>

      </Container>
    </footer>
  );
}
