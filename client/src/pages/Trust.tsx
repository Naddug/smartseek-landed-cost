import { Link } from "wouter";
import { ShieldCheck, FileText, Search, AlertTriangle, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function Trust() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-5">
            <ShieldCheck className="w-3.5 h-3.5" /> Trust &amp; transparency
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">How SmartSeek earns buyer trust</h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Industrial procurement runs on accountability. Here&apos;s exactly what we verify, how we route requests, and what we deliberately do not do.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-4 border-b border-slate-100">
        <div className="max-w-3xl mx-auto space-y-10">
          <Block icon={<ShieldCheck className="w-5 h-5 text-blue-600" />} title="What we verify before publishing a supplier">
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Legal entity exists in an official company registry (e.g. SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC, KRS, DART, SEDAR).</li>
              <li>Registered company name, registration number, country, and incorporation date match registry records.</li>
              <li>Operational website resolves and is associated with the entity.</li>
              <li>Primary contact email is reachable and tied to the company domain or a verified representative.</li>
            </ul>
            <p className="text-sm text-slate-600 mt-3"><Link href="/verification" className="text-blue-700 underline underline-offset-2">See full verification standards →</Link></p>
          </Block>

          <Block icon={<FileText className="w-5 h-5 text-emerald-600" />} title="How RFQs are routed">
            <p className="text-sm text-slate-700 leading-relaxed">
              Every RFQ submitted on SmartSeek is reviewed by a sourcing operator before it leaves the platform. We screen for completeness, regulatory red flags, and supplier match — and only then route the request to suppliers we&apos;ve verified for that commodity. We do not auto-blast RFQs.
            </p>
            <p className="text-sm text-slate-600 mt-3"><Link href="/methodology" className="text-blue-700 underline underline-offset-2">See sourcing methodology →</Link></p>
          </Block>

          <Block icon={<Search className="w-5 h-5 text-violet-600" />} title="Where supplier data comes from">
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li><strong>Public registries</strong> — incorporation, ownership, status.</li>
              <li><strong>Trade data</strong> — customs and shipment records where lawfully available.</li>
              <li><strong>Direct supplier applications</strong> — companies that apply via <Link href="/become-a-supplier" className="text-blue-700 underline underline-offset-2">/become-a-supplier</Link>.</li>
              <li><strong>Operator-curated additions</strong> — suppliers added by our team after manual due diligence.</li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">During beta, the public directory shows a curated subset of our internal supplier index. We deliberately do not display unverified bulk records.</p>
          </Block>

          <Block icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} title="What we do NOT do">
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>We do not sell paid placement. Suppliers cannot pay to rank higher.</li>
              <li>We do not generate fake supplier profiles, fake reviews, or fake quote counts.</li>
              <li>We do not auto-blast RFQs to thousands of suppliers.</li>
              <li>We do not share buyer details with third parties without explicit consent.</li>
              <li>We do not claim to be the "world&apos;s largest" anything. Our credibility comes from verification, not scale.</li>
            </ul>
          </Block>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-700 mb-4">If you see a listing that looks wrong, tell us. We act on every report.</p>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                Report a listing <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}
