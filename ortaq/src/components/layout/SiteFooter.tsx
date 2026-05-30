import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Logo } from "@ortaq/components/brand/Logo";
import { Container } from "@ortaq/components/ui/Section";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-ortaq-border bg-ortaq-ink pb-16 text-ortaq-bg md:pb-10">
      <Container>
        <div className="space-y-4 border-b border-ortaq-bg/10 py-8">
          <p className="text-xs leading-[1.65] text-ortaq-bg/65">{t("footer.regulatory")}</p>
          <p className="text-xs leading-[1.65] text-ortaq-bg/50">{t("footer.notAdvice")}</p>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="text-ortaq-bg [&_span]:text-ortaq-bg" />
            <p className="mt-4 max-w-sm text-sm leading-[1.65] text-ortaq-bg/75">{t("footer.tagline")}</p>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-3 text-xs font-medium text-ortaq-bg/55">{t("footer.trustTitle")}</p>
            <ul className="space-y-2 text-sm leading-snug">
              <li><Link href="/guven" className="text-ortaq-bg/80 hover:text-ortaq-bg">{t("footer.links.trust")}</Link></li>
              <li><Link href="/riskler" className="text-ortaq-bg/80 hover:text-ortaq-bg">{t("footer.links.risk")}</Link></li>
              <li><Link href="/#nasil-calisir" className="text-ortaq-bg/80 hover:text-ortaq-bg">{t("footer.links.process")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-medium text-ortaq-bg/55">{t("footer.legalTitle")}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/gizlilik" className="text-ortaq-bg/80 hover:text-ortaq-bg">{t("footer.links.privacy")}</Link></li>
              <li><Link href="/kullanim" className="text-ortaq-bg/80 hover:text-ortaq-bg">{t("footer.links.terms")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-medium text-ortaq-bg/55">{t("footer.supportTitle")}</p>
            <p className="text-sm leading-[1.55] text-ortaq-bg/70">{t("footer.supportText")}</p>
            <p className="mt-2 text-sm text-ortaq-bg/55">destek@ortaq.biz</p>
            <p className="mt-3 text-xs leading-[1.55] text-ortaq-bg/45">{t("footer.dispute")}</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-ortaq-bg/10 py-6 text-xs leading-[1.55] text-ortaq-bg/45">
          <p>{t("footer.entity")}</p>
          <p>{t("footer.entityNote")}</p>
          <p className="pt-2">© {new Date().getFullYear()} ORTAQ.BIZ</p>
        </div>
      </Container>
    </footer>
  );
}
