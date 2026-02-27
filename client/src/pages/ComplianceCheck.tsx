import { useState } from "react";
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Loader2, FileText, Shield, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  if (status === "Verified" || status === "Pass" || status === "Clear") return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (status === "Likely" || status === "Warning" || status === "Flagged") return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
}

function ComplianceBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    "Fully Compliant": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Mostly Compliant": "bg-blue-100 text-blue-700 border-blue-200",
    "Partially Compliant": "bg-amber-100 text-amber-700 border-amber-200",
    "Non-Compliant": "bg-red-100 text-red-700 border-red-200",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[level] || styles["Partially Compliant"]}`}>{level}</span>;
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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <ClipboardCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Compliance Check</h1>
            <p className="text-emerald-100">AI-powered certification verification, regulatory compliance & sanctions screening</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-900">Check Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Supplier Name <span className="text-red-500">*</span></label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" placeholder="e.g. Wenzhou Neo Electric" value={form.supplierName} onChange={e => setForm({...form, supplierName: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country <span className="text-red-500">*</span></label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" placeholder="e.g. China" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Industry <span className="text-red-500">*</span></label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" placeholder="e.g. Electronics" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Target Markets</label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" placeholder="USA, EU, UK" value={form.targetMarkets} onChange={e => setForm({...form, targetMarkets: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Products</label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" placeholder="e.g. LED drivers, panel lights" value={form.products} onChange={e => setForm({...form, products: e.target.value})} />
            </div>
            <button onClick={() => mutation.mutate()} disabled={!form.supplierName || !form.country || !form.industry || mutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors mt-2">
              {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : <><ClipboardCheck className="w-4 h-4" /> Run Compliance Check</>}
            </button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {mutation.isError && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">Failed to generate compliance check. Please try again.</div>}
          {!result && !mutation.isPending && (
            <Card className="border-dashed bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <CardContent className="py-16 text-center">
                <ClipboardCheck className="w-14 h-14 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <p className="text-slate-700 dark:text-slate-200 text-lg font-medium">Enter supplier details and run a compliance check</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Covers certifications, regulatory checks, and sanctions screening</p>
              </CardContent>
            </Card>
          )}
          {mutation.isPending && (
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <CardContent className="py-16 text-center">
                <Loader2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-spin" />
                <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">Running compliance check...</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Checking certifications, regulations & sanctions lists</p>
              </CardContent>
            </Card>
          )}
          {result && !mutation.isPending && (
            <>
              <Card className="bg-white border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Compliance Overview</h2>
                    <ComplianceBadge level={result.complianceLevel} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
                    <div className={`rounded-2xl p-4 sm:p-6 flex flex-col items-center shrink-0 ${result.overallScore >= 80 ? "bg-emerald-50" : result.overallScore >= 60 ? "bg-amber-50" : "bg-red-50"}`}>
                      <div className={`text-4xl sm:text-5xl font-bold ${result.overallScore >= 80 ? "text-emerald-600" : result.overallScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{result.overallScore}</div>
                      <div className="text-sm text-slate-500 mt-1">/ 100</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 text-sm leading-relaxed">{result.summary}</p>
                      <div className="mt-3 w-full bg-slate-200 rounded-full h-3">
                        <div className={`h-3 rounded-full transition-all duration-700 ${result.overallScore >= 80 ? "bg-emerald-500" : result.overallScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${result.overallScore}%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-900 dark:text-slate-100">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.certifications.map((c, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-100 gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <StatusIcon status={c.status} />
                          <div className="min-w-0">
                            <p className="text-sm text-slate-900 font-semibold truncate">{c.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{c.notes}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-8 sm:ml-0">
                          {c.required && <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Required</Badge>}
                          <Badge variant="outline" className={`text-xs ${c.status === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : c.status === "Likely" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>{c.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-900 dark:text-slate-100">Regulatory Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.regulatoryChecks.map((r, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon status={r.status} />
                            <span className="text-sm text-slate-900 font-semibold">{r.regulation}</span>
                          </div>
                          <Badge variant="outline" className={`text-xs ${r.status === "Pass" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : r.status === "Warning" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>{r.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 ml-7 leading-relaxed">{r.description}</p>
                        {r.action && <p className="text-xs text-blue-700 ml-7 mt-1.5 font-medium flex items-center gap-1"><ArrowRight className="w-3 h-3" /> {r.action}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`${result.sanctionsScreening.status === "Clear" ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"}`}>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className={`w-6 h-6 ${result.sanctionsScreening.status === "Clear" ? "text-emerald-600" : "text-red-600"}`} />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Sanctions Screening</h3>
                      <Badge variant="outline" className={`text-xs mt-1 ${result.sanctionsScreening.status === "Clear" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}>{result.sanctionsScreening.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mt-2">{result.sanctionsScreening.details}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                      <ArrowRight className="w-5 h-5 text-blue-500" /> Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                      <FileText className="w-5 h-5 text-amber-500" /> Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {result.requiredDocuments.map((d, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2 leading-relaxed">
                          <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />{d}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
