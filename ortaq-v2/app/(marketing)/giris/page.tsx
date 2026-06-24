import { Suspense } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { GirisForm } from "@/components/auth/GirisForm";
import { getAuthProviderFlags } from "@/lib/auth/providers";
import { registerPathChoiceHref } from "@/lib/auth/routes";

type GirisPageProps = {
  searchParams: { next?: string; magic?: string };
};

export default function GirisPage({ searchParams }: GirisPageProps) {
  const providers = getAuthProviderFlags();
  const kayitHref = registerPathChoiceHref(searchParams.next);

  return (
    <Section>
      <AppContainer size="narrow">
        <div className="mx-auto max-w-md card-editorial p-8">
          <h1 className="font-heading text-2xl font-semibold text-ortaq-navy">
            Giriş Yap
          </h1>
          <p className="mt-2 text-sm text-ortaq-text-secondary">
            ORTAQ paneline erişmek için hesabınıza giriş yapın.
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <GirisForm enabled={providers} />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-ortaq-text-secondary">
            Hesabınız yok mu?{" "}
            <Link href={kayitHref} className="font-medium text-blue-600 hover:underline">
              Kayıt olun
            </Link>
          </p>
        </div>
      </AppContainer>
    </Section>
  );
}
