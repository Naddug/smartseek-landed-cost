import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type RiskCategory = {
  name: string;
  score: number;
  level: string;
  factors: string[];
};

type RiskResult = {
  overallRiskScore: number;
  riskLevel: string;
  summary: string;
  categories: RiskCategory[];
  recommendations: string[];
  tradeRestrictions: string[];
  alternativeRegions: string[];
};

function ScoreBar({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className={`w-full bg-slate-700 rounded-full ${size === "sm" ? "h-2" : "h-3"}`}>
      <div className={`${color} rounded-full ${size === "sm" ? "h-2" : "h-3"} transition-all duration-700`} style={{ width: `${score}%` }} />
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[level] || styles.Medium}`}>
      {level} Risk
    </span>
  );
}

export default function RiskIntelligence() {
  const [form, setForm] = useState({ supplierName: "", country: "", industry: "", products: "" });
  const [result, setResult] = useState<RiskResult | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/risk/analyze", form);
      return res.json();
    },
    onSuccess: (data) => setResult(data),
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Risk Intelligence</h1>
            <p className="text-slate-400">AI-powered geopolitical, financial & supply chain risk analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-800 rounded-xl p-5 border border-slate-700 h-fit">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Analysis Parameters</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Supplier Name (optional)</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" placeholder="e.g. Wenzhou Neo Electric" value={form.supplierName} onChange={e => setForm({...form, supplierName: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Country *</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" placeholder="e.g. China" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Industry</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" placeholder="e.g. Electronics" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Products</label>
              <input className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" placeholder="e.g. LED drivers, panel lights" value={form.products} onChange={e => setForm({...form, products: e.target.value})} />
            </div>
            <button onClick={() => mutation.mutate()} disabled={!form.country || mutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Shield className="w-4 h-4" /> Analyze Risk</>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {mutation.isError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">Failed to generate analysis. Please try again.</div>
          )}
          {!result && !mutation.isPending && (
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Enter parameters and click Analyze to generate a risk report</p>
            </div>
          )}
          {mutation.isPending && (
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
              <p className="text-slate-300 font-medium">Analyzing risk factors...</p>
              <p className="text-slate-500 text-sm mt-1">This may take 10-15 seconds</p>
            </div>
          )}
          {result && !mutation.isPending && (
            <>
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">Overall Risk Assessment</h2>
                  <LevelBadge level={result.riskLevel} />
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl font-bold text-white">{result.overallRiskScore}</div>
                  <div className="flex-1"><ScoreBar score={result.overallRiskScore} /></div>
                </div>
                <p className="text-slate-400 text-sm">{result.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.categories.map((cat, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                      <span className="text-xs font-bold text-slate-300">{cat.score}/100</span>
                    </div>
                    <ScoreBar score={cat.score} size="sm" />
                    <ul className="mt-2 space-y-1">
                      {cat.factors.map((f, j) => (
                        <li key={j} className="text-xs text-slate-400 flex items-start gap-1.5">
                          <span className="mt-1 w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {result.recommendations.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommendations</h3>
                  <div className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.tradeRestrictions.length > 0 && (
                <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/20">
                  <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Trade Restrictions</h3>
                  <ul className="space-y-1">
                    {result.tradeRestrictions.map((t, i) => (
                      <li key={i} className="text-sm text-slate-400">{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
