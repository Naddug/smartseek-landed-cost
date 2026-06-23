import { AppContainer } from "@/components/shared/AppContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

const ownerExamples = [
  "Yarım kalmış uygulama",
  "Konseptsiz mağaza / lokasyon",
  "Ortağı ayrılmış işletme",
  "Satış kanalı olmayan üretim kapasitesi",
];

const partnerExamples = [
  "Teknik ortak",
  "İşletme ortağı",
  "Büyüme ortağı",
  "Sermaye ortağı",
  "Sektör ortağı",
  "Üretim / tedarik ortağı",
];

function AudienceCard({
  title,
  examples,
}: {
  title: string;
  examples: string[];
}) {
  return (
    <div className="flex flex-col rounded-xl border border-ortaq-line bg-ortaq-surface p-6 md:p-8">
      <h3 className="font-heading text-xl font-semibold text-ortaq-navy">{title}</h3>
      <ul className="mt-5 space-y-2.5">
        {examples.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-ortaq-text-muted"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-action" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhoItsFor() {
  return (
    <section className="py-16 md:py-20">
      <AppContainer>
        <SectionHeader
          eyebrow="Kimler için"
          title="İki taraf, aynı masada"
          description="ORTAQ yatırımcı pazaryeri değil. Gerçek varlığı olan fırsatlar ve onları tamamlayabilecek ortaklar için tasarlandı."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <AudienceCard
            title="Bir fırsatın var ama ilerleyemiyor"
            examples={ownerExamples}
          />
          <AudienceCard
            title="Gerçek bir fırsata ortak olmak istiyorsun"
            examples={partnerExamples}
          />
        </div>
      </AppContainer>
    </section>
  );
}
