import { Mail } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Get in touch with our team. We typically respond within 24 hours.
          </p>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <p className="text-slate-600 mb-6">
              For sales inquiries, support, or partnership opportunities, reach out via email.
            </p>
            <a
              href="mailto:contact@smartseek.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              contact@smartseek.com
            </a>
            <p className="text-slate-500 text-sm mt-6">
              Prefer to browse first? Check our <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link> or <Link href="/pricing" className="text-blue-600 hover:underline">Pricing</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
