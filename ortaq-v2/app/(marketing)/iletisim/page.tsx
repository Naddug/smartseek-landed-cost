import Link from "next/link";
import { Mail } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { Section } from "@/components/shared/Section";
import { PageShell } from "@/components/marketing/PageShell";

export default function IletisimPage() {
  return (
    <Section>
      <AppContainer size="narrow">
        <PageShell
          eyebrow="İletişim"
          title="Bizimle iletişime geçin"
          description="Dosya, inceleme veya platform kullanımı hakkında sorularınız için bize yazın."
        >
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-stone-500" />
                <div>
                  <p className="text-sm font-medium text-stone-950">E-posta</p>
                  <a
                    href="mailto:destek@ortaq.biz"
                    className="mt-1 text-sm text-blue-600 hover:underline"
                  >
                    destek@ortaq.biz
                  </a>
                  <p className="mt-2 text-sm text-stone-600">
                    İş günlerinde 24 saat içinde yanıt vermeyi hedefliyoruz.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-stone-600">
              Hesabınız varsa panel üzerinden dosya ve eşleşme durumunuzu
              takip edebilirsiniz.{" "}
              <Link href="/panel" className="font-medium text-blue-600 hover:underline">
                Panele git
              </Link>
            </p>
          </div>
        </PageShell>
      </AppContainer>
    </Section>
  );
}
