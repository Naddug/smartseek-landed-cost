"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import {
  createDossierEntryHref,
  loginHref,
  registerPathChoiceHref,
} from "@/lib/auth/routes";
import type { PremiumPackageId } from "@/lib/marketing/premium-packages";
import { premiumPackageHref } from "@/lib/marketing/premium-packages";

interface PremiumPackageDetailPanelProps {
  packageId: PremiumPackageId;
  onClose?: () => void;
  className?: string;
}

export function PremiumPackageDetailPanel({
  packageId,
  onClose,
  className,
}: PremiumPackageDetailPanelProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const detail = ORTAQ_COPY.monetization.packageDetails[packageId];
  const tier = ORTAQ_COPY.monetization.tiers.find((item) => item.id === packageId);

  const primaryHref = resolvePrimaryHref(packageId, isAuthenticated);
  const secondaryHref = resolveSecondaryHref(packageId, isAuthenticated);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/90 via-white to-white shadow-ortaq-lg ring-1 ring-blue-100",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-blue-100 px-6 py-5 md:px-8">
        <div>
          <p className="type-eyebrow">{tier?.eyebrow}</p>
          <h3 className="mt-1 font-heading text-xl font-semibold text-ortaq-navy md:text-2xl">
            {detail.headline}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ortaq-text-secondary md:text-base">
            {detail.summary}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ortaq-text-muted transition-colors hover:bg-blue-100/60 hover:text-ortaq-navy"
            aria-label="Paket detayını kapat"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid gap-8 px-6 py-6 md:grid-cols-2 md:px-8 md:py-8">
        <div>
          <p className="text-sm font-semibold text-ortaq-navy">Neler dahil?</p>
          <ul className="mt-3 space-y-2.5">
            {detail.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ortaq-text-secondary">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ortaq-navy">Nasıl ilerler?</p>
          <ol className="mt-3 space-y-3">
            {detail.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-ortaq-text-secondary">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ortaq-navy text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="border-t border-blue-100 bg-blue-50/40 px-6 py-5 md:px-8">
        <p className="text-xs leading-relaxed text-ortaq-text-muted">{detail.note}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={primaryHref}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              {isAuthenticated ? detail.authPrimaryCta : detail.guestPrimaryCta}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Link href={secondaryHref}>
            <Button variant="outline">{detail.secondaryCta}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function resolvePrimaryHref(packageId: PremiumPackageId, isAuthenticated: boolean) {
  switch (packageId) {
    case "owner":
      return isAuthenticated
        ? createDossierEntryHref(true)
        : registerPathChoiceHref("/panel/dosya-olustur");
    case "partner":
      return isAuthenticated
        ? "/panel/profilim"
        : loginHref(premiumPackageHref("partner"));
    case "visibility":
      return isAuthenticated
        ? "mailto:destek@ortaq.biz?subject=ORTAQ%20H%C4%B1zland%C4%B1r%C4%B1lm%C4%B1%C5%9F%20De%C4%9Ferlendirme%20Talebi"
        : loginHref(premiumPackageHref("visibility"));
    default:
      return premiumPackageHref("owner");
  }
}

function resolveSecondaryHref(packageId: PremiumPackageId, isAuthenticated: boolean) {
  switch (packageId) {
    case "owner":
      return "mailto:destek@ortaq.biz?subject=ORTAQ%20Premium%20-%20F%C4%B1rsat%20Dosyas%C4%B1";
    case "partner":
      return isAuthenticated ? "/onboarding/ortak" : registerPathChoiceHref("/onboarding/ortak");
    case "visibility":
      return "mailto:destek@ortaq.biz?subject=ORTAQ%20H%C4%B1zland%C4%B1r%C4%B1lm%C4%B1%C5%9F%20De%C4%9Ferlendirme";
    default:
      return "/iletisim";
  }
}
