"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthProviderButtons } from "@/components/auth/AuthProviderButtons";
import { postAuthRedirect } from "@/lib/auth/routes";
import {
  resolvePostAuthDestination,
  sessionToPostAuthContext,
} from "@/lib/auth/session-policy";
import { defaultRoleForSignup, parseUserRole } from "@/lib/auth/roles";
import type { AuthProviderFlags } from "@/lib/auth/providers";
import type { UserRole } from "@/types";

type KayitFormProps = {
  enabled: Pick<AuthProviderFlags, "google" | "linkedin" | "emailMagicLink">;
};

export function KayitForm({ enabled }: KayitFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = parseUserRole(searchParams.get("role")) ?? defaultRoleForSignup(undefined);
  const next = searchParams.get("next");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTarget = postAuthRedirect(role, next);

  async function fetchSessionSnapshot() {
    const response = await fetch("/api/auth/session");
    if (!response.ok) return null;
    return response.json();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });

    const registerData = (await registerResponse.json()) as { error?: string };

    if (!registerResponse.ok) {
      setLoading(false);
      setError(registerData.error ?? "Kayıt tamamlanamadı.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      setError("Hesap oluşturuldu ancak otomatik giriş başarısız. Lütfen giriş yapın.");
      router.push(`/giris?next=${encodeURIComponent(redirectTarget)}`);
      return;
    }

    const session = await fetchSessionSnapshot();
    window.location.assign(
      resolvePostAuthDestination(sessionToPostAuthContext(session), next)
    );
  }

  return (
    <div className="space-y-6">
      {!enabled.google && !enabled.linkedin && !enabled.emailMagicLink && (
        <p className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs leading-relaxed text-stone-600">
          Sosyal giriş bu ortamda yapılandırılmamış. E-posta ve şifre ile kayıt
          olabilirsiniz.
        </p>
      )}

      <AuthProviderButtons
        role={role as UserRole}
        next={redirectTarget}
        mode="register"
        enabled={enabled}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-800">
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none ring-blue-600 focus:ring-2"
            placeholder="Adınız Soyadınız"
          />
        </div>
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
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-800">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none ring-blue-600 focus:ring-2"
          />
          <p className="mt-1 text-xs text-stone-500">En az 8 karakter.</p>
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? "Hesap oluşturuluyor…" : "Hesap Oluştur"}
        </Button>
      </form>
    </div>
  );
}
