import { useState } from "react";
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Loader2, FileText, Shield, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type Certification = { name: string; status: string; required: boolean; notes: string };
type RegulatoryCheck = { regulation: string; status: string; description: string; action: string };
type ComplianceResult = {
  overallScore: number;
  complianceLevel: string;
  summary: string;
  certifications: Certification[];
  regulatoryChecks: RegulatoryCheck[];
  sanctionsScreening: { status: string; details: string };
  recommendations: string[];
  requiredDocuments: string[];
};

function StatusIcon({ status }: { status: string }) {
  if (status === "Verified" || status === "Pass" || status === "Clear") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "Likely" || status === "Warning" || status === "Flagged") return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  return <XCircle className="w-4 h-4 text-red-400" />;
}

function ComplianceBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    "Fully Compliant": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Mostly Compliant": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Partially Compliant": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Non-Compliant": "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[level] || styles["Partially Compliant"]}`}>{level}</span>;
}

export default function ComplianceCheck() {
  const [form, setForm] = useState({ supplierName: "", country: "", industry: "", targetMarkets: "USA, EU", products: "" });
  const [result, setResult] = useState<ComplianceResult | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, targetMarkets: form.targetMarkets.split(",").map(s => s.trim()).filter(Boolean) };
      const res = await apiRequest("POST", "/api/compliance/check", payload);
      return res.json();
    },
    onSuccess: (data) => setResult(data),
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-emerald-900 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Compliance Check</h1>
            <p className="text-slate-400">AI-powered certification verification & regulatory compliance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-800 rounded-xl p-5 border border-slate-700 h-fit">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Check Parameters</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Supplier Name *</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" placeholder="e.g. Wenzhou Neo Electric" value={form.supplierName} onChange={e => setForm({...form, supplierName: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Country *</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" placeholder="e.g. China" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Industry *</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" placeholder="e.g. Electronics" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Target Markets</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" placeholder="USA, EU, UK" value={form.targetMarkets} onChange={e => setForm({...form, targetMarkets: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Products</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" placeholder="e.g. LED drivers, panel lights" value={form.products} onChange={e => setForm({...form, products: e.target.value})} />
            </div>
            <button onClick={() => mutation.mutate()} disabled={!form.supplierName || !form.country || !form.industry || mutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : <><ClipboardCheck className="w-4 h-4" /> Run Compliance Check</>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {mutation.isError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">Failed to generate compliance check. Please try again.</div>}
          {!result && !mutation.isPending && (
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <ClipboardCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Enter supplier details and run a compliance check</p>
            </div>
          )}
          {mutation.isPending && (
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <Loader2 className="w-10 h-10 text-emerald-500 mx-auto mb-3 animate-spin" />
              <p className="text-slate-300 font-medium">Running compliance check...</p>
              <p className="text-slate-500 text-sm mt-1">Checking certifications, regulations & sanctions</p>
            </div>
          )}
          {result && !mutation.isPending && (
            <>
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">Compliance Overview</h2>
                  <ComplianceBadge level={result.complianceLevel} />
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl font-bold text-white">{result.overallScore}</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all duration-700 ${result.overallScore >= 80 ? "bg-emerald-500" : result.overallScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${result.overallScore}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{result.summary}</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-3">Certifications</h3>
                <div className="space-y-2">
                  {result.certifications.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <StatusIcon status={c.status} />
                        <div>
                          <p className="text-sm text-white font-medium">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.notes}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.required && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Required</span>}
                        <span className={`text-xs font-medium ${c.status === "Verified" ? "text-emerald-400" : c.status === "Likely" ? "text-amber-400" : "text-red-400"}`}>{c.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-3">Regulatory Checks</h3>
                <div className="space-y-2">
                  {result.regulatoryChecks.map((r, i) => (
                    <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={r.status} />
                          <span className="text-sm text-white font-medium">{r.regulation}</span>
                        </div>
                        <span className={`text-xs font-medium ${r.status === "Pass" ? "text-emerald-400" : r.status === "Warning" ? "text-amber-400" : "text-red-400"}`}>{r.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 ml-6">{r.description}</p>
                      {r.action && <p className="text-xs text-blue-400 ml-6 mt-1">→ {r.action}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-xl p-5 border ${result.sanctionsScreening.status === "Clear" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  <h3 className="text-sm font-semibold text-white">Sanctions Screening: {result.sanctionsScreening.status}</h3>
                </div>
                <p className="text-sm text-slate-400">{result.sanctionsScreening.details}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><ArrowRight className="w-4 h-4 text-blue-400" /> Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" /> Required Documents</h3>
                  <ul className="space-y-2">
                    {result.requiredDocuments.map((d, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2"><FileText className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
