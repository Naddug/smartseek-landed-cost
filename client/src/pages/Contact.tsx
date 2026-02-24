import { Mail, Clock, MessageSquare, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { TrustBadges } from "@/components/trust/TrustBadges";

export default function Contact() {
  const inquiryTypes = [
    { icon: MessageSquare, label: "Sales", desc: "Pricing, demos, enterprise" },
    { icon: HelpCircle, label: "Support", desc: "Technical help, onboarding" },
    { icon: Mail, label: "Partnerships", desc: "Integrations, suppliers" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Average response: 24 hours
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Get in touch with our team. We're here to help procurers, entrepreneurs, suppliers, and producers succeed.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {inquiryTypes.map((type, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                  <type.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{type.label}</h3>
                <p className="text-sm text-slate-600">{type.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Send us a message</h2>
            <p className="text-slate-600 mb-8">
              For sales inquiries, support, or partnership opportunities, reach out via email. We typically respond within 24 hours.
            </p>
            <a
              href="mailto:contact@smartseek.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/25"
            >
              <Mail className="w-5 h-5" />
              contact@smartseek.com
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-slate-500 text-sm mt-8">
              Prefer to browse first? Check our <Link href="/faq" className="text-blue-600 hover:underline font-medium">FAQ</Link> or <Link href="/pricing" className="text-blue-600 hover:underline font-medium">Pricing</Link>.
            </p>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500 mb-8">Your data is protected</p>
            <TrustBadges />
          </div>
        </div>
      </section>
    </div>
  );
}
