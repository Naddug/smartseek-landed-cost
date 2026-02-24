import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "wouter";

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
        answer: "SmartSeek is an AI-powered sourcing platform that helps buyers discover verified global suppliers, calculate landed costs, submit RFQs, and make data-driven procurement decisions. We combine market intelligence with automation to save time and reduce risk."
      },
      {
        question: "How does AI-powered sourcing work?",
        answer: "Our AI analyzes supplier profiles, market data, and trade flows to surface the best matches for your requirements. It helps you compare options, estimate costs, and identify qualified suppliers faster than manual research."
      },
      {
        question: "Is SmartSeek free?",
        answer: "We offer a free tier with limited searches and features. Professional and Enterprise plans unlock unlimited access, advanced tools, and priority support. See our Pricing page for details."
      }
    ]
  },
  {
    title: "Suppliers",
    id: "verification",
    items: [
      {
        question: "How are suppliers verified?",
        answer: "Suppliers undergo verification checks including business registration, trade history, and compliance documentation. Verified suppliers display a badge and have completed our verification process. We aggregate data from trade registries, certifications, and verified business sources; validate trade history and compliance; score on response time and quality; and continuously monitor risk signals. See our homepage for the full methodology."
      },
      {
        question: "How many suppliers are in the database?",
        answer: "We have 100,000+ verified suppliers across 24+ countries, with coverage expanding regularly. Our database spans Mining & Minerals, Electronics, Textiles, Machinery, Chemicals, Food & Agriculture, and more."
      },
      {
        question: "What countries do you cover?",
        answer: "We cover major sourcing regions including China, India, Vietnam, Turkey, Bangladesh, Indonesia, Pakistan, Thailand, Poland, Malaysia, South Korea, Egypt, Brazil, and Mexico."
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
        answer: "Most suppliers respond within 24–72 hours. Response times vary by industry and complexity. Pro users get priority routing for faster responses."
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
        answer: "Click Get Started or Sign Up, enter your email and password, and verify your email. You can start using the free tier immediately."
      },
      {
        question: "Can I cancel anytime?",
        answer: "Yes. You can cancel your subscription at any time from the Billing page. Access continues until the end of your billing period."
      },
      {
        question: "What payment methods?",
        answer: "We accept major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise plans can be invoiced. All payments are processed securely via Stripe."
      }
    ]
  },
  {
    title: "Trust & Security",
    items: [
      {
        question: "Is my data secure?",
        answer: "Yes. SmartSeek is SOC 2 Type II certified, uses 256-bit encryption, and is GDPR compliant. We never sell your data. Enterprise customers can use SSO and SAML."
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
                <span className="text-blue-300 font-medium">Support</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-slate-300 text-lg">
                Find answers to common questions about SmartSeek, our platform, and how we can help procurers, entrepreneurs, suppliers, and producers.
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
              <p className="text-slate-600 mb-4">Still have questions?</p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}
