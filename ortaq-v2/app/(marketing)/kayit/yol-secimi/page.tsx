import { Suspense } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { PathChoiceSection } from "@/components/auth/PathChoiceSection";

type YolSecimiPageProps = {
  searchParams: { next?: string };
};

export default function YolSecimiPage({ searchParams }: YolSecimiPageProps) {
  return (
    <Section className="py-12 md:py-20">
      <AppContainer>
        <PageHeader
          align="center"
          title="Nereden başlamak istersiniz?"
          description="ORTAQ'ta iki rol vardır. Size uygun olanı seçin — kayıt sonrası profilinizi güncelleyebilirsiniz."
          className="mx-auto max-w-2xl border-none pb-4"
        />

        <Suspense fallback={null}>
          <PathChoiceSection next={searchParams.next} />
        </Suspense>

        <p className="mx-auto mt-10 max-w-lg text-center text-sm leading-relaxed text-ortaq-text-muted">
          Hangisinin size daha uygun olduğundan emin değil misiniz? Kayıt
          olduktan sonra profilinizi değiştirebilirsiniz.{" "}
          <Link href="/giris" className="font-medium text-blue-600 hover:underline">
            Zaten hesabınız var mı?
          </Link>
        </p>
      </AppContainer>
    </Section>
  );
}
