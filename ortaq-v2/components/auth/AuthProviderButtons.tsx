"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { postAuthRedirect, sanitizeNextPath } from "@/lib/auth/routes";
import type { UserRole } from "@/types";

type AuthProviderButtonsProps = {
  role?: UserRole;
  next?: string;
  mode?: "login" | "register";
  enabled?: {
    google?: boolean;
    linkedin?: boolean;
    emailMagicLink?: boolean;
  };
};

async function persistSignupIntent(role?: UserRole) {
  if (!role) return;
  await fetch("/api/auth/signup-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

export function AuthProviderButtons({
  role,
  next,
  mode = "login",
  enabled = { google: false, linkedin: false, emailMagicLink: false },
}: AuthProviderButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [magicError, setMagicError] = useState("");

  const callbackUrl = sanitizeNextPath(
    next ??
      (role ? postAuthRedirect(role) : mode === "register" ? "/kayit/yol-secimi" : "/panel")
  );

  async function handleOAuth(provider: "google" | "linkedin") {
    setLoadingProvider(provider);
    if (mode === "register" && role) {
      await persistSignupIntent(role);
    }
    await signIn(provider, { callbackUrl });
  }

  async function handleMagicLink(event: React.FormEvent) {
    event.preventDefault();
    setMagicError("");
    setLoadingProvider("email");

    if (mode === "register" && role) {
      await persistSignupIntent(role);
    }

    const result = await signIn("email", {
      email: magicEmail.trim(),
      redirect: false,
      callbackUrl,
    });

    setLoadingProvider(null);

    if (result?.error) {
      setMagicError(
        "Magic link gönderilemedi. E-posta ayarlarını kontrol edin veya şifre ile devam edin."
      );
      return;
    }

    setMagicSent(true);
  }

  const showOAuth = enabled.google || enabled.linkedin;
  const showMagicLink = enabled.emailMagicLink;

  return (
    <div className="space-y-4">
      {showOAuth && (
        <div className="grid gap-2">
          {enabled.google && (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center border-stone-200 bg-white"
              disabled={Boolean(loadingProvider)}
              onClick={() => handleOAuth("google")}
            >
              {loadingProvider === "google" ? "Yönlendiriliyor…" : "Google ile devam et"}
            </Button>
          )}
          {enabled.linkedin && (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center border-stone-200 bg-white"
              disabled={Boolean(loadingProvider)}
              onClick={() => handleOAuth("linkedin")}
            >
              {loadingProvider === "linkedin"
                ? "Yönlendiriliyor…"
                : "LinkedIn ile devam et"}
            </Button>
          )}
        </div>
      )}

      {showOAuth && showMagicLink && (
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-stone-200" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-xs text-stone-500">
            veya e-posta magic link
          </p>
        </div>
      )}

      {showMagicLink && (
        <>
          {magicSent ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Giriş bağlantısı e-postanıza gönderildi. Gelen kutunuzu kontrol edin.
            </p>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-2">
              <input
                type="email"
                required
                value={magicEmail}
                onChange={(event) => setMagicEmail(event.target.value)}
                placeholder="ornek@firma.com"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none ring-blue-600 focus:ring-2"
              />
              {magicError && (
                <p className="text-sm text-red-600" role="alert">
                  {magicError}
                </p>
              )}
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={loadingProvider === "email"}
              >
                {loadingProvider === "email" ? "Gönderiliyor…" : "Magic link gönder"}
              </Button>
            </form>
          )}
        </>
      )}

      {(showOAuth || showMagicLink) && (
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-stone-200" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-xs text-stone-500">
            veya e-posta {mode === "register" ? "ile kayıt" : "/ şifre"}
          </p>
        </div>
      )}
    </div>
  );
}
