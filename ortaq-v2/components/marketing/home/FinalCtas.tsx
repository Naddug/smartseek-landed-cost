import Link from "next/link";
import { ArrowRight, Briefcase, Handshake } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

function FinalCtaCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-ortaq-line bg-ortaq-surface p-6 transition-all hover:border-ortaq-action hover:shadow-sm md:p-8"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-ortaq-surface-alt text-ortaq-navy transition-colors group-hover:bg-ortaq-action/10 group-hover:text-ortaq-action">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-semibold text-ortaq-navy group-hover:text-ortaq-action">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ortaq-text-muted">
        {description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ortaq-action">
        Devam et
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function FinalCtas() {
  return (
    <section className="border-t border-ortaq-line bg-ortaq-surface-alt py-16 md:py-20">
      <AppContainer>
        <SectionHeader
          title="Hangi yoldan başlamak istersiniz?"
          align="center"
        />
        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
          <FinalCtaCard
            title="Bir fırsat dosyası oluşturmak istiyorum"
            description="Elinizde ilerlemeye değer bir varlık, proje veya kapasite var; doğru ortağı arıyorsunuz."
            href="/kayit/yol-secimi"
            icon={<Briefcase className="h-5 w-5" />}
          />
          <FinalCtaCard
            title="Ortak olarak fırsatlara bakmak istiyorum"
            description="Sermaye, teknik bilgi, operasyon veya sektör deneyimiyle gerçek bir fırsata katkı sunmak istiyorsunuz."
            href="/kayit/yol-secimi"
            icon={<Handshake className="h-5 w-5" />}
          />
        </div>
      </AppContainer>
    </section>
  );
}
