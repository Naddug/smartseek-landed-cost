"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthProviderButtons } from "@/components/auth/AuthProviderButtons";
import type { AuthProviderFlags } from "@/lib/auth/providers";
import { sanitizeNextPath } from "@/lib/auth/routes";
import {
  resolvePostAuthDestination,
  sessionToPostAuthContext,
} from "@/lib/auth/session-policy";

type GirisFormProps = {
  enabled: Pick<AuthProviderFlags, "google" | "linkedin" | "emailMagicLink">;
};

async function fetchSessionSnapshot() {
  const response = await fetch("/api/auth/session");
  if (!response.ok) return null;
  return response.json();
}

export function GirisForm({ enabled }: GirisFormProps) {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const magicSent = searchParams.get("magic") === "sent";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function redirectAfterAuth() {
    const session = await fetchSessionSnapshot();
    const destination = resolvePostAuthDestination(
      sessionToPostAuthContext(session),
      nextParam
    );
    window.location.assign(destination);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("E-posta veya şifre hatalı.");
      return;
    }

    await redirectAfterAuth();
    setLoading(false);
  }

  const oauthNext = nextParam ? sanitizeNextPath(nextParam) : undefined;

  return (
    <div className="space-y-6">
      {magicSent && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Giriş bağlantısı e-postanıza gönderildi. Bağlantıya tıkladıktan sonra oturumunuz açılır.
        </p>
      )}

      {!enabled.google && !enabled.linkedin && !enabled.emailMagicLink && (
        <p className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs leading-relaxed text-stone-600">
          Sosyal giriş bu ortamda yapılandırılmamış. E-posta ve şifre ile giriş
          yapabilirsiniz.
        </p>
      )}

      <AuthProviderButtons next={oauthNext} mode="login" enabled={enabled} />

      {!enabled.google && !enabled.linkedin && !enabled.emailMagicLink ? null : (
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-stone-200" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-xs text-stone-500">
            veya e-posta / şifre
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-800">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none ring-blue-600 focus:ring-2"
            placeholder="ornek@firma.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-800">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none ring-blue-600 focus:ring-2"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
        </Button>
      </form>
    </div>
  );
}
