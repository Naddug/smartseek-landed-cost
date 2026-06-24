"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Briefcase, Handshake } from "lucide-react";
import { PathChoiceCard } from "@/components/marketing/PathChoiceCard";
import { registerHref, sanitizeNextPath } from "@/lib/auth/routes";
import {
  resolvePostAuthDestination,
  sessionToPostAuthContext,
} from "@/lib/auth/session-policy";
import type { UserRole } from "@/types";

type PathChoiceSectionProps = {
  next?: string;
};

export function PathChoiceSection({ next }: PathChoiceSectionProps) {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  const [error, setError] = useState("");

  const sanitizedNext = next ? sanitizeNextPath(next) : undefined;
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  async function selectRole(role: UserRole) {
    setError("");
    setLoadingRole(role);

    const response = await fetch("/api/auth/select-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, next: sanitizedNext }),
    });

    const data = (await response.json()) as { error?: string; redirect?: string };

    if (!response.ok) {
      setLoadingRole(null);
      setError(data.error ?? "Rol seçimi kaydedilemedi.");
      return;
    }

    await update();
    router.push(
      data.redirect ??
        resolvePostAuthDestination(sessionToPostAuthContext(session), sanitizedNext)
    );
    router.refresh();
  }

  if (isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <PathChoiceCard
            title="Bir fırsat dosyası oluşturmak istiyorum"
            description="Elinizde ilerlemeye değer bir iş fırsatı, lokasyon, ürün, kapasite veya yarım kalmış proje var. Doğru ortağı arıyorsunuz."
            ctaLabel={
              loadingRole === "opportunity_owner"
                ? "Kaydediliyor…"
                : "Fırsat Sahibi Olarak Devam Et"
            }
            onSelect={() => selectRole("opportunity_owner")}
            disabled={Boolean(loadingRole)}
            icon={<Briefcase className="h-6 w-6" />}
          />
          <PathChoiceCard
            title="Fırsatlara ortak olmak istiyorum"
            description="Bir fırsata sermaye, teknik bilgi, operasyon, satış gücü veya sektör deneyimiyle ortak olmak istiyorsunuz."
            ctaLabel={
              loadingRole === "partner" ? "Kaydediliyor…" : "Ortak Olarak Devam Et"
            }
            onSelect={() => selectRole("partner")}
            disabled={Boolean(loadingRole)}
            icon={<Handshake className="h-6 w-6" />}
          />
        </div>
        {error && (
          <p className="text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      <PathChoiceCard
        title="Bir fırsat dosyası oluşturmak istiyorum"
        description="Elinizde ilerlemeye değer bir iş fırsatı, lokasyon, ürün, kapasite veya yarım kalmış proje var. Doğru ortağı arıyorsunuz."
        ctaLabel="Fırsat Sahibi Olarak Devam Et"
        href={registerHref("opportunity_owner", sanitizedNext)}
        icon={<Briefcase className="h-6 w-6" />}
      />
      <PathChoiceCard
        title="Fırsatlara ortak olmak istiyorum"
        description="Bir fırsata sermaye, teknik bilgi, operasyon, satış gücü veya sektör deneyimiyle ortak olmak istiyorsunuz."
        ctaLabel="Ortak Olarak Devam Et"
        href={registerHref("partner", sanitizedNext)}
        icon={<Handshake className="h-6 w-6" />}
      />
    </div>
  );
}
