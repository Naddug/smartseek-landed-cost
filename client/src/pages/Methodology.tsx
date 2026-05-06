import { Link } from "wouter";
import { FileText, Search, ShieldCheck, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

const STEPS = [
  {
    n: "01",
    title: "RFQ intake & screening",
    body: "When a buyer submits an RFQ, a sourcing operator reviews it for completeness — commodity specification, quantity, destination, lead time, regulatory constraints — within one business day. Incomplete RFQs are returned with specific clarification questions.",
  },
  {
    n: "02",
    title: "Supplier matching",
    body: "We match the request to suppliers in our verified directory based on commodity, geography, certification requirements, and historical responsiveness. We deliberately do not blast — most RFQs are routed to between 3 and 8 suppliers.",
  },
  {
    n: "03",
    title: "Quote consolidation",
    body: "Suppliers respond directly to the buyer or via the operator. Quotes are returned to the buyer with consistent fields: unit price, MOQ, incoterms, lead time, payment terms, and supplier provenance. The buyer chooses who to engage.",
  },
  {
    n: "04",
    title: "Post-quote support",
    body: "We assist with reference checks, sample requests, contract review pointers, and (where useful) trade documentation. SmartSeek does not act as a broker or take a commission on the trade.",
  },
];

export default function Methodology() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-5">
            <FileText className="w-3.5 h-3.5" /> Sourcing methodology
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">How we route a sourcing request</h1>
          <p className="text-slate-300 text-base leading-relaxed">
            SmartSeek is operator-led. Every RFQ touches a human sourcing operator before it reaches a supplier.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 px-4 border-b border-slate-100">
        <div className="max-w-3xl mx-auto space-y-6">
          {STEPS.map((s) => (
            <div key={s.n} className="border border-slate-200 rounded-2xl p-6 bg-white">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xs font-mono text-slate-400">{s.n}</span>
                <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-3">What we deliberately don&apos;t do</h2>
          <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5 mb-8">
            <li>We do not auto-blast RFQs to thousands of suppliers.</li>
            <li>We do not insert ourselves into supplier-buyer commercial communication unless asked.</li>
            <li>We do not take a hidden commission on the underlying trade.</li>
            <li>We do not promise quotes from suppliers we have not verified.</li>
          </ul>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Ready to test the methodology?</p>
              <p className="text-xs text-slate-600">Submit an RFQ — there&apos;s no payment system during beta.</p>
            </div>
            <Link href="/rfq">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                Submit RFQ <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <div className="text-center mt-6 text-xs text-slate-500">
            <Link href="/verification" className="underline underline-offset-2 inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verification standards</Link>
            <span className="mx-2">·</span>
            <Link href="/trust" className="underline underline-offset-2 inline-flex items-center gap-1"><Search className="w-3 h-3" /> Trust &amp; transparency</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
