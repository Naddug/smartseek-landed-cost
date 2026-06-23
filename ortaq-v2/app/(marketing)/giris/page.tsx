import { Suspense } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { GirisForm } from "@/components/auth/GirisForm";

export default function GirisPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <div className="mx-auto max-w-md rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-semibold text-stone-950">
            Giriş Yap
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            ORTAQ paneline erişmek için hesabınıza giriş yapın.
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <GirisForm />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-stone-600">
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
