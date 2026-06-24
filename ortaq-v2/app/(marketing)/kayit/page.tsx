import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { KayitForm } from "@/components/auth/KayitForm";
import { getAuthProviderFlags } from "@/lib/auth/providers";
import { parseUserRole } from "@/lib/auth/roles";
import { registerPathChoiceHref } from "@/lib/auth/routes";

type KayitPageProps = {
  searchParams: { role?: string; next?: string };
};

export default function KayitPage({ searchParams }: KayitPageProps) {
  const role = parseUserRole(searchParams.role);
  const providers = getAuthProviderFlags();

  if (!role) {
    redirect(registerPathChoiceHref(searchParams.next));
  }

  const roleLabel =
    role === "opportunity_owner" ? "Fırsat Sahibi" : "Ortak";

  return (
    <Section>
      <AppContainer size="narrow">
        <div className="mx-auto max-w-md card-editorial p-8">
          <h1 className="font-heading text-2xl font-semibold text-ortaq-navy">
            Kayıt Ol
          </h1>
          <p className="mt-2 text-sm text-ortaq-text-secondary">
            {roleLabel} olarak ORTAQ hesabınızı oluşturun. Giriş sonrası
            onboarding adımlarına yönlendirileceksiniz.
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <KayitForm enabled={providers} />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-ortaq-text-secondary">
            Zaten hesabınız var mı?{" "}
            <Link
              href={`/giris?next=${encodeURIComponent(searchParams.next ?? "/panel")}`}
              className="font-medium text-blue-600 hover:underline"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </AppContainer>
    </Section>
  );
}
