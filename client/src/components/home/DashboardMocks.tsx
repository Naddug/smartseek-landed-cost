import { BarChart3, Globe2, Shield, DollarSign, Users, Package, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Logo } from "@/components/Logo";

function StatCard({ icon: Icon, label, value, change, positive, iconBg }: {
  icon: any; label: string; value: string; change: string; positive: boolean; iconBg: string;
}) {
  return (
    <div className="bg-white rounded-lg p-2 sm:p-3 border border-slate-200/80 flex flex-col gap-1 sm:gap-1.5 min-w-0">
      <div className="flex items-center justify-between gap-1">
        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        </div>
        <span className={`text-[9px] sm:text-[10px] font-medium flex items-center gap-0.5 shrink-0 ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
          {change}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">{label}</p>
        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

export function HeroDashboardMock() {
  return (
    <div className="relative rounded-2xl shadow-2xl border border-slate-200 w-full bg-white overflow-hidden" data-testid="img-hero-dashboard">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-slate-700 rounded-md px-3 py-0.5 text-[9px] text-slate-400">smartseek.com/dashboard</div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500">Welcome back</p>
            <p className="text-xs font-semibold text-slate-800">Sourcing Dashboard</p>
          </div>
          <div className="bg-blue-600 text-white text-[9px] px-2 py-1 rounded-md font-medium">+ New Report</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={Users} label="Suppliers" value="2,847" change="+12%" positive iconBg="bg-blue-600" />
          <StatCard icon={DollarSign} label="Avg Landed Cost" value="$4.2M" change="-8%" positive iconBg="bg-emerald-600" />
          <StatCard icon={Shield} label="Risk Score" value="Low" change="94/100" positive iconBg="bg-violet-600" />
        </div>
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-medium text-slate-700">Sourcing Volume</p>
            <p className="text-[9px] text-slate-400">Last 12 months</p>
          </div>
          <div className="flex items-end justify-between gap-1 h-12">
            {[35, 45, 40, 55, 50, 65, 60, 75, 70, 85, 80, 92].map((v, i) => (
              <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${v}%`, opacity: 0.4 + (i / 12) * 0.6 }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-slate-400">Jan</span>
            <span className="text-[8px] text-slate-400">Dec</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPreviewMock() {
  const regionData = [
    { region: "Asia Pacific", value: 45, color: "bg-blue-500" },
    { region: "Europe", value: 28, color: "bg-violet-500" },
    { region: "North America", value: 18, color: "bg-emerald-500" },
    { region: "Middle East", value: 9, color: "bg-amber-500" },
  ];

  return (
    <div className="relative rounded-2xl shadow-2xl border border-slate-200 w-full mx-auto max-w-5xl bg-white overflow-hidden" data-testid="img-preview-dashboard">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-slate-700 rounded-md px-3 py-0.5 text-[9px] text-slate-400 truncate">smartseek.com/dashboard/analytics</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row h-auto sm:h-72">
        <div className="hidden sm:flex w-40 bg-slate-900 p-3 flex-col gap-1 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Logo size="sm" className="rounded-md w-20 h-20" />
            <span className="text-[10px] text-white font-semibold">SmartSeek</span>
          </div>
          {[
            { icon: BarChart3, label: "Analytics", active: true },
            { icon: Users, label: "Suppliers", active: false },
            { icon: Globe2, label: "Trade Data", active: false },
            { icon: Shield, label: "Risk Monitor", active: false },
            { icon: Package, label: "RFQ Manager", active: false },
            { icon: DollarSign, label: "Cost Calculator", active: false },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[9px] ${item.active ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <item.icon className="w-3 h-3 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 p-3 sm:p-4 bg-slate-50 overflow-hidden min-w-0">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Supplier Analytics</p>
              <p className="text-[9px] text-slate-500 truncate">Real-time performance metrics</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <div className="bg-white border border-slate-200 text-[9px] px-2 py-1 rounded-md text-slate-600 whitespace-nowrap">Last 30 days</div>
              <div className="bg-blue-600 text-white text-[9px] px-2 py-1 rounded-md whitespace-nowrap">Export</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <StatCard icon={Users} label="Active Suppliers" value="2,847" change="+12%" positive iconBg="bg-blue-600" />
            <StatCard icon={DollarSign} label="Total Spend" value="$14.2M" change="+23%" positive iconBg="bg-emerald-600" />
            <StatCard icon={Shield} label="Avg Risk Score" value="92/100" change="+3pts" positive iconBg="bg-violet-600" />
            <StatCard icon={AlertTriangle} label="Alerts" value="7" change="-34%" positive iconBg="bg-amber-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            <div className="sm:col-span-3 bg-white rounded-lg p-3 border border-slate-200/80">
              <p className="text-[10px] font-medium text-slate-700 mb-2">Spend by Category</p>
              <div className="flex items-end justify-between gap-1 h-20">
                {[
                  { label: "Raw Mat.", h: 85, c: "bg-blue-500" },
                  { label: "Electronics", h: 65, c: "bg-violet-500" },
                  { label: "Chemicals", h: 50, c: "bg-emerald-500" },
                  { label: "Packaging", h: 40, c: "bg-amber-500" },
                  { label: "Logistics", h: 30, c: "bg-rose-500" },
                  { label: "Equipment", h: 55, c: "bg-cyan-500" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <div className={`w-full ${bar.c} rounded-t-sm`} style={{ height: `${bar.h}%`, opacity: 0.8 }} />
                    <span className="text-[7px] text-slate-400 truncate w-full text-center">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 bg-white rounded-lg p-3 border border-slate-200/80">
              <p className="text-[10px] font-medium text-slate-700 mb-2">By Region</p>
              <div className="space-y-2">
                {regionData.map((r, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className="text-slate-600 truncate mr-2">{r.region}</span>
                      <span className="text-slate-500 shrink-0">{r.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReportPreviewMock() {
  return (
    <div className="relative rounded-2xl shadow-2xl border border-slate-200 w-full mx-auto max-w-5xl bg-white overflow-hidden" data-testid="img-preview-report">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-slate-700 rounded-md px-3 py-0.5 text-[9px] text-slate-400">smartseek.com/reports/SR-2847</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row h-auto sm:h-72">
        <div className="hidden sm:block w-44 bg-white border-r border-slate-200 p-3 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Logo size="sm" className="rounded-md w-20 h-20" />
            <span className="text-[10px] text-slate-800 font-semibold">Intelligence Report</span>
          </div>
          <div className="space-y-1">
            {["Executive Summary", "Supplier Profile", "Cost Analysis", "Risk Assessment", "Compliance Check", "Recommendations"].map((s, i) => (
              <div key={i} className={`text-[9px] px-2 py-1.5 rounded-md ${i === 3 ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500'}`}>{s}</div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[8px] text-slate-400 mb-1">Report Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '87%' }} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600">87</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-3 sm:p-4 bg-slate-50 overflow-hidden min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Risk Assessment</p>
              <p className="text-[9px] text-slate-500 truncate">Wenzhou Neo Electric Co. — Chongqing, China</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <div className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-1 rounded-md font-medium flex items-center gap-1 whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3 shrink-0" /> Verified
              </div>
              <div className="bg-white border border-slate-200 text-[9px] px-2 py-1 rounded-md text-slate-600 whitespace-nowrap hidden sm:block">Download PDF</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
            {[
              { label: "Financial Stability", score: 91, level: "Low Risk", color: "emerald" },
              { label: "Geopolitical Risk", score: 72, level: "Medium", color: "amber" },
              { label: "Supply Chain", score: 88, level: "Low Risk", color: "emerald" },
            ].map((risk, i) => (
              <div key={i} className="bg-white rounded-lg p-2.5 border border-slate-200/80">
                <p className="text-[9px] text-slate-500 mb-1">{risk.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{risk.score}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
                    risk.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{risk.level}</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full mt-1.5">
                  <div className={`h-full rounded-full ${risk.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${risk.score}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-200/80">
            <p className="text-[10px] font-medium text-slate-700 mb-2">Compliance & Certifications</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { cert: "ISO 9001:2015", status: true },
                { cert: "ISO 14001:2015", status: true },
                { cert: "RoHS Compliant", status: true },
                { cert: "SA8000 (Social)", status: false },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[9px]">
                  {c.status ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                  <span className={c.status ? 'text-slate-700' : 'text-amber-600'}>{c.cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
