import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  anchor?: string;
  items: FAQItem[];
}

const FAQ_SECTION_DEFS: { id: string; anchor?: string; count: number }[] = [
  { id: "general", count: 3 },
  { id: "suppliers", anchor: "verification", count: 3 },
  { id: "landedCost", count: 3 },
  { id: "rfq", count: 3 },
  { id: "account", count: 3 },
  { id: "trust", count: 2 },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 sm:py-5 min-h-12 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors px-1"
      >
        <span className="font-medium text-slate-900 pr-4 text-sm sm:text-base leading-snug">{item.question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="pb-5 pr-12 text-slate-600 text-sm leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  const faqSections: FAQSection[] = useMemo(
    () =>
      FAQ_SECTION_DEFS.map((def) => ({
        id: def.id,
        anchor: def.anchor,
        title: t(`faq.sections.${def.id}.title`),
        items: Array.from({ length: def.count }, (_, i) => ({
          question: t(`faq.sections.${def.id}.q${i + 1}`),
          answer: t(`faq.sections.${def.id}.a${i + 1}`),
        })),
      })),
    [t]
  );

  const toggle = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-blue-300 font-medium">{t("faq.support")}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                {t("faq.title")}
              </h1>
              <p className="text-slate-300 text-lg">
                {t("faq.subtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-12">
              {faqSections.map((section, sectionIndex) => (
                <div key={section.id} id={section.anchor} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
                  <h2 className="px-6 py-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-900 text-lg">
                    {section.title}
                  </h2>
                  <div className="px-6">
                    {section.items.map((item, itemIndex) => (
                      <FAQAccordionItem
                        key={itemIndex}
                        item={item}
                        isOpen={!!openKeys[`${sectionIndex}-${itemIndex}`]}
                        onToggle={() => toggle(sectionIndex, itemIndex)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-600 mb-4">{t("faq.stillQuestions")}</p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 min-h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {t("faq.contactUs")}
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}
