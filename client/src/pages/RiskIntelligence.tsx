import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Loader2, ArrowRight, Globe, TrendingDown, TrendingUp, BarChart3, FileText, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const categoryIcons: Record<string, React.ReactNode> = {
  "Geopolitical Risk": <Globe className="w-4 h-4" />,
  "Economic & Financial Stability": <TrendingDown className="w-4 h-4" />,
  "Supply Chain & Logistics": <Zap className="w-4 h-4" />,
  "Regulatory & Trade Policy": <FileText className="w-4 h-4" />,
  "Quality & Compliance": <CheckCircle2 className="w-4 h-4" />,
  "Currency & Payment Risk": <BarChart3 className="w-4 h-4" />,
  "Environmental & ESG": <Shield className="w-4 h-4" />,
};

function ScoreBar({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className={`w-full bg-slate-200 rounded-full ${size === "sm" ? "h-2" : "h-3"}`}>
      <div className={`${color} rounded-full ${size === "sm" ? "h-2" : "h-3"} transition-all duration-700`} style={{ width: `${score}%` }} />
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    High: "bg-orange-100 text-orange-700 border-orange-200",
    Critical: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[level] || styles.Medium}`}>
      {level} Risk
    </span>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : score >= 40 ? "text-orange-600" : "text-red-600";
  const bg = score >= 80 ? "bg-emerald-50" : score >= 60 ? "bg-amber-50" : score >= 40 ? "bg-orange-50" : "bg-red-50";
  return (
    <div className={`${bg} rounded-2xl p-6 flex flex-col items-center justify-center`}>
      <div className={`text-5xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-slate-500 mt-1">/ 100</div>
    </div>
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Risk Intelligence</h1>
            <p className="text-blue-100">AI-powered geopolitical, financial, supply chain & ESG risk analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-900">Analysis Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Supplier Name</label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Wenzhou Neo Electric" value={form.supplierName} onChange={e => setForm({...form, supplierName: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country <span className="text-red-500">*</span></label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="e.g. China" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Industry</label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Electronics" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Products</label>
              <input className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="e.g. LED drivers, panel lights" value={form.products} onChange={e => setForm({...form, products: e.target.value})} />
            </div>
            <button onClick={() => mutation.mutate()} disabled={!form.country || mutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors mt-2">
              {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Shield className="w-4 h-4" /> Analyze Risk</>}
            </button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {mutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">Failed to generate analysis. Please try again.</div>
          )}
          {!result && !mutation.isPending && (
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">What we analyze</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Enter parameters on the left and click Analyze to get a comprehensive risk assessment across these categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Geopolitical Risk", icon: Globe, desc: "Political stability, sanctions, trade tensions" },
                    { name: "Economic & Financial Stability", icon: TrendingDown, desc: "Currency volatility, inflation, credit risk" },
                    { name: "Supply Chain & Logistics", icon: Zap, desc: "Port congestion, transit times, capacity" },
                    { name: "Regulatory & Trade Policy", icon: FileText, desc: "Tariffs, customs, compliance requirements" },
                    { name: "Quality & Compliance", icon: CheckCircle2, desc: "Standards, certifications, audit risk" },
                    { name: "Currency & Payment Risk", icon: BarChart3, desc: "FX exposure, payment terms, banking" },
                    { name: "Environmental & ESG", icon: Shield, desc: "Carbon footprint, sustainability, CBAM" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{item.name}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {mutation.isPending && (
            <Card className="bg-white/5">
              <CardContent className="py-16 text-center">
                <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                <p className="text-slate-200 font-semibold text-lg">Analyzing risk factors...</p>
                <p className="text-slate-400 text-sm mt-1">Scanning geopolitical, financial, supply chain, and ESG data</p>
              </CardContent>
            </Card>
          )}
          {result && !mutation.isPending && (
            <>
              <Card className="bg-white border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Overall Risk Assessment</h2>
                    <LevelBadge level={result.riskLevel} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <ScoreGauge score={result.overallRiskScore} />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 text-sm leading-relaxed">{result.summary}</p>
                      <div className="mt-4">
                        <ScoreBar score={result.overallRiskScore} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.categories.map((cat, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow bg-white border-slate-200">
                    <CardContent className="pt-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                            {categoryIcons[cat.name] || <Shield className="w-4 h-4" />}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 truncate">{cat.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-700">{cat.score}/100</span>
                          <LevelBadge level={cat.level} />
                        </div>
                      </div>
                      <ScoreBar score={cat.score} size="sm" />
                      <ul className="mt-3 space-y-1.5">
                        {cat.factors.map((f, j) => (
                          <li key={j} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {result.recommendations.length > 0 && (
                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      {result.recommendations.map((r, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                          <span className="text-sm text-slate-700 leading-relaxed">{r}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.tradeRestrictions.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-5 h-5" /> Trade Restrictions & Barriers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.tradeRestrictions.map((t, i) => (
                        <li key={i} className="text-sm text-red-800 flex items-start gap-2 bg-white/60 p-3 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {result.alternativeRegions && result.alternativeRegions.length > 0 && (
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
                      <Globe className="w-5 h-5" /> Alternative Sourcing Regions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.alternativeRegions.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-white/60 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-sm text-emerald-800">{r}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
