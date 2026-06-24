"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MonetizationTiers } from "@/components/marketing/MonetizationTiers";
import { PremiumPackageDetailPanel } from "@/components/marketing/PremiumPackageDetailPanel";
import {
  PREMIUM_DETAIL_ANCHOR,
  type PremiumPackageId,
  isPremiumPackageId,
  parsePremiumPackageFromLocation,
  premiumPackageHref,
} from "@/lib/marketing/premium-packages";

interface PremiumPackagesSectionProps {
  showCtas?: boolean;
  layout?: "grid" | "homepage";
}

export function PremiumPackagesSection({
  showCtas = true,
  layout = "homepage",
}: PremiumPackagesSectionProps) {
  const pathname = usePathname();
  const detailRef = useRef<HTMLDivElement>(null);
  const [activePackage, setActivePackage] = useState<PremiumPackageId | null>(null);
  const isPremiumPage =
    pathname === "/guven-kalite" || pathname === "/nasil-calisir";

  const scrollToDetail = useCallback(() => {
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const openPackage = useCallback(
    (packageId: PremiumPackageId, options?: { updateUrl?: boolean; scroll?: boolean }) => {
      setActivePackage(packageId);

      if (options?.updateUrl !== false && isPremiumPage) {
        const href = premiumPackageHref(packageId, pathname);
        window.history.replaceState(null, "", href);
      }

      if (options?.scroll !== false) {
        scrollToDetail();
      }
    },
    [isPremiumPage, pathname, scrollToDetail]
  );

  useEffect(() => {
    if (!isPremiumPage) return;

    const syncFromLocation = () => {
      const parsed = parsePremiumPackageFromLocation(
        window.location.search,
        window.location.hash
      );
      if (parsed) {
        setActivePackage(parsed);
        scrollToDetail();
      }
    };

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    return () => window.removeEventListener("hashchange", syncFromLocation);
  }, [isPremiumPage, scrollToDetail]);

  const handleTierSelect = useCallback(
    (tierId: string) => {
      if (!isPremiumPackageId(tierId)) return;
      openPackage(tierId);
    },
    [openPackage]
  );

  return (
    <div>
      <MonetizationTiers
        showCtas={showCtas}
        layout={layout}
        activeTierId={activePackage}
        onTierSelect={isPremiumPage ? handleTierSelect : undefined}
      />

      <div
        id={PREMIUM_DETAIL_ANCHOR}
        ref={detailRef}
        className="scroll-mt-24"
        aria-live="polite"
      >
        {activePackage ? (
          <div className="mt-8 transition-all duration-300">
            <PremiumPackageDetailPanel
              packageId={activePackage}
              onClose={() => {
                setActivePackage(null);
                if (isPremiumPage) {
                  window.history.replaceState(null, "", pathname);
                }
              }}
            />
          </div>
        ) : (
          isPremiumPage && (
            <p className="mt-6 rounded-xl border border-dashed border-ortaq-line bg-ortaq-surface-alt/60 px-5 py-4 text-center text-sm text-ortaq-text-muted">
              Bir paket seçin — detaylar, adımlar ve devam yolu burada açılır.
            </p>
          )
        )}
      </div>
    </div>
  );
}
