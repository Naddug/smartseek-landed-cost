import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  id?: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "General",
    items: [
      {
        question: "What is SmartSeek?",
        answer: "SmartSeek is a strategic sourcing platform for procurement teams. It helps buyers discover verified suppliers, submit RFQs, and compare structured quotes across industrial categories."
      },
      {
        question: "How does supplier discovery work?",
        answer: "You search by commodity, category, and region, then review curated supplier profiles. For specific demand, submit an RFQ and a SmartSeek sourcing operator routes it to relevant verified suppliers."
      },
      {
        question: "Is SmartSeek free?",
        answer: "Yes. SmartSeek is free during beta and there is no payment flow enabled right now."
      }
    ]
  },
  {
    title: "Suppliers",
    id: "verification",
    items: [
      {
        question: "How are suppliers verified?",
        answer: "Every supplier we publish is matched to an entry in an official company registry (e.g. SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC, KRS, DART, SEDAR). Where available, we add a Trade Verified or Operator Verified tier. See /verification for the full criteria and re-verification cadence."
      },
      {
        question: "How many suppliers are in the public directory?",
        answer: "During beta, the public directory is intentionally curated rather than scraped at scale. It focuses on strategic metals, base metals, and industrial inputs. If a supplier you need isn't listed publicly, submit an RFQ — a SmartSeek operator routes the request through our internal index and verified network."
      },
      {
        question: "What countries are covered?",
        answer: "We work across the major industrial sourcing regions, including China, India, Vietnam, Turkey, Indonesia, Thailand, South Korea, Japan, Poland, Germany, the UK, the US, Mexico, Brazil, Australia, and Canada. Coverage scales as we verify more suppliers — we do not publish unverified bulk records."
      }
    ]
  },
  {
    title: "Landed Cost",
    items: [
      {
        question: "How accurate is the landed cost calculator?",
        answer: "Our calculator uses current duty rates, freight benchmarks, and insurance formulas. Accuracy depends on your inputs; we recommend verifying critical figures with customs brokers or freight forwarders for high-value shipments."
      },
      {
        question: "What incoterms are supported?",
        answer: "We support common incoterms including EXW, FOB, CIF, and DDP. The calculator adjusts freight, insurance, and customs handling based on the selected incoterm."
      },
      {
        question: "What shipping methods?",
        answer: "We support sea freight (FCL and LCL), air freight, and express shipping. You can specify container sizes (20ft, 40ft) for sea freight and we'll estimate costs accordingly."
      }
    ]
  },
  {
    title: "RFQ",
    items: [
      {
        question: "How does the RFQ process work?",
        answer: "Submit an RFQ with your product details, quantity, and requirements. We route it to relevant verified suppliers. Suppliers respond with quotes, and you can compare and negotiate directly."
      },
      {
        question: "How quickly will I get quotes?",
        answer: "Most RFQs receive first responses within 1–3 business days. Timing depends on product complexity and supplier availability."
      },
      {
        question: "Is my information shared?",
        answer: "Your contact and RFQ details are shared only with suppliers you choose to engage. We do not sell or share your data with third parties. See our Privacy Policy for full details."
      }
    ]
  },
  {
    title: "Account",
    items: [
      {
        question: "How do I create an account?",
        answer: "Click Start Free or Sign Up, enter your work email and password, then verify your email to activate your account."
      },
      {
        question: "Can I cancel anytime?",
        answer: "There is no billing during beta. If paid plans are introduced later, cancellation terms will be published in advance."
      },
      {
        question: "What payment methods?",
        answer: "Payments are not enabled during beta."
      }
    ]
  },
  {
    title: "Trust & Security",
    items: [
      {
        question: "Is my data secure?",
        answer: "We treat buyer and supplier data as confidential by default. Communications are encrypted in transit (TLS), data is encrypted at rest, and we don't sell your details. RFQs are only shared with suppliers we route them to. SOC 2 attestation work is in progress; we'll publish status when available."
      },
      {
        question: "Who can use SmartSeek?",
        answer: "Procurers, entrepreneurs, suppliers, and producers. Whether you're a startup sourcing your first supplier or a procurement team managing global supply chains, SmartSeek scales with you."
      }
    ]
  }
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors px-1"
      >
        <span className="font-medium text-slate-900 pr-4">{item.question}</span>
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

  const toggle = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setOpenKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen">
        {/* Header */}
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
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                {t("faq.title")}
              </h1>
              <p className="text-slate-300 text-lg">
                {t("faq.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-12">
              {faqSections.map((section, sectionIndex) => (
                <div key={section.title} id={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
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
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {t("faq.contactUs")}
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}
