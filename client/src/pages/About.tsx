import { Building2, Target, Users, Shield, Globe, Zap } from "lucide-react";
import { Link } from "wouter";
import { TrustBadges } from "@/components/trust/TrustBadges";

export default function About() {
  const values = [
    { icon: Shield, title: "Integrity", desc: "We verify every supplier and stand behind our data." },
    { icon: Globe, title: "Global mindset", desc: "Sourcing without borders—we connect buyers and suppliers worldwide." },
    { icon: Zap, title: "Speed & clarity", desc: "Decisions in minutes, not weeks. No complexity." },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">About SmartSeek</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              We're building the sourcing intelligence platform that procurers, entrepreneurs, suppliers, and producers trust to make better decisions—faster.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Our mission</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SmartSeek helps procurement teams and buyers discover verified suppliers, calculate landed costs, and submit RFQs—all powered by AI and market intelligence.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our mission is to make global sourcing simpler, faster, and more transparent. We combine verified supplier data with tools that reduce risk and improve margins—so you can act with confidence.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Who we serve</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <strong className="text-slate-900">Procurers</strong> — Reduce risk, improve margins, stay compliant.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <strong className="text-slate-900">Entrepreneurs</strong> — Source fast, scale smart, launch sooner.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <strong className="text-slate-900">Suppliers & producers</strong> — Get discovered, win more RFQs.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-10 text-center">What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-500 mb-8">Trusted by 10,000+ users worldwide</p>
          <TrustBadges />
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6">Explore SmartSeek</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/suppliers" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <Users className="w-4 h-4" /> Supplier Directory
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <Target className="w-4 h-4" /> Pricing
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Building2 className="w-4 h-4" /> Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
