import { Suspense } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { GirisForm } from "@/components/auth/GirisForm";

export default function GirisPage() {
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
              <GirisForm />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-ortaq-text-secondary">
            Hesabınız yok mu?{" "}
            <Link href="/kayit/yol-secimi" className="font-medium text-blue-600 hover:underline">
              Kayıt olun
            </Link>
          </p>
        </div>
      </AppContainer>
    </Section>
  );
}
