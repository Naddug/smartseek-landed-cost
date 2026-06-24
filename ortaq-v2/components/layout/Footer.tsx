import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { OrtaqLogo } from "@/components/brand/OrtaqLogo";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const footerLinks = [
  { href: "/firsatlar", label: "Fırsatlar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/guven-kalite", label: "Güven & Kalite" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export function Footer() {
  return (
    <footer className="border-t border-ortaq-line bg-ortaq-surface">
      <AppContainer className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <OrtaqLogo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ortaq-text-secondary">
              {ORTAQ_COPY.trust.platformTagline}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ortaq-text-secondary transition-colors hover:text-ortaq-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-ortaq-line pt-6">
          <p className="text-xs text-ortaq-text-muted">
            © {new Date().getFullYear()} ORTAQ. Tüm hakları saklıdır.
          </p>
        </div>
      </AppContainer>
    </footer>
  );
}
