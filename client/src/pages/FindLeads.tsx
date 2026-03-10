import { useState, useEffect } from "react";
import { useProfile } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, Loader2, Building2, MapPin, Users, Mail, Phone, Globe, 
  TrendingUp, Target, Briefcase, Download, Star, CheckCircle, CreditCard, ChevronDown, ChevronUp, SlidersHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";

interface Lead {
  id?: number;
  companyName: string;
  industry: string;
  location: string;
  employeeRange: string;
  revenueRange: string;
  website: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  sourcingFocus: string[];
  aiSummary: string;
  intentSignals: {
    recentActivity?: string;
    importTrends?: string;
    growthIndicators?: string;
  };
}

const REVENUE_RANGES = ["< $1M", "$1M–$10M", "$10M–$50M", "$50M–$250M", "$250M+"];
const FUNDING_STAGES = ["Bootstrapped", "Seed", "Series A", "Series B+", "Public"];

const INDUSTRIES = [
  "Manufacturing",
  "Electronics & Technology",
  "Consumer Goods & Retail",
  "Automotive & Transportation",
  "Healthcare & Medical Devices",
  "Construction & Materials",
  "Food & Beverage",
  "Textiles & Apparel",
  "Chemicals & Plastics",
  "Metals & Mining",
  "Aerospace & Defense",
  "Energy & Utilities"
];

const COMPANY_SIZES = [
  "1-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees"
];

const REGIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "China",
  "Japan",
  "India",
  "Australia",
  "Brazil",
  "Mexico",
  "UAE",
  "Singapore",
  "South Korea",
  "Turkey"
];

function useDebouncedCount(filters: { industry: string; location: string; companySize: string; keywords: string; revenueRange: string; fundingStage: string; foundedAfter: string }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      if (filters.industry) params.set("industry", filters.industry);
      if (filters.location) params.set("location", filters.location);
      if (filters.companySize) params.set("companySize", filters.companySize);
      if (filters.keywords) params.set("keywords", filters.keywords);
      if (filters.revenueRange) params.set("revenueRange", filters.revenueRange);
      if (filters.fundingStage) params.set("fundingStage", filters.fundingStage);
      if (filters.foundedAfter) params.set("foundedAfter", filters.foundedAfter);
      try {
        const res = await fetch(`/api/leads/count?${params.toString()}`);
        const data = await res.json();
        setCount(data.count ?? null);
      } catch {
        setCount(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.industry, filters.location, filters.companySize, filters.keywords, filters.revenueRange, filters.fundingStage, filters.foundedAfter]);
  return count;
}

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "•••@•••.com";
  const [local, domain] = email.split("@");
  return `•••@${domain || "domain.com"}`;
}

export default function FindLeads() {
  const { data: profile } = useProfile();
  const [, setLocation] = useLocation();
  
  const [industry, setIndustry] = useState("");
  const [location, setLeadLocation] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [keywords, setKeywords] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [fundingStage, setFundingStage] = useState("");
  const [foundedAfter, setFoundedAfter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  const { t } = useTranslation();
  const totalCredits = (profile?.monthlyCredits || 0) + (profile?.topupCredits || 0);
  const isAdmin = profile?.role === 'admin';
  const isPaid = !!profile && profile.plan !== "free";

  const estimatedCount = useDebouncedCount({
    industry,
    location,
    companySize,
    keywords,
    revenueRange,
    fundingStage,
    foundedAfter,
  });

  const [stats, setStats] = useState<{ suppliers: number; leads: number } | null>(null);
  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then((d) => setStats({ suppliers: d.suppliers, leads: d.leads })).catch(() => setStats(null));
  }, []);

  const formatStat = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+` : n >= 1_000 ? `${Math.round(n / 1_000)}K+` : `${n}+`);

  const handleSearch = async () => {
    if (!industry || !location) {
      toast.error(t("findLeads.validation.selectIndustryAndLocation"));
      return;
    }

    if (totalCredits < 1 && !isAdmin) {
      setShowCreditsDialog(true);
      return;
    }

    setIsSearching(true);
    setLeads([]);

    try {
      const response = await apiRequest("POST", "/api/leads/search", {
        industry,
        location,
        companySize: companySize === "any" ? undefined : companySize,
        keywords: keywords || undefined,
        revenueRange: revenueRange || undefined,
        fundingStage: fundingStage || undefined,
        foundedAfter: foundedAfter || undefined,
      });

      const data = await response.json();
      console.log("Search response:", data);
      
      if (data.leads && Array.isArray(data.leads)) {
        setLeads(data.leads);
        setSelectedIds(new Set());
        if (data.leads.length > 0) {
          toast.success(t("findLeads.success.leadsFound", { count: data.leads.length }));
        } else {
          toast.info(t("findLeads.info.noLeadsMatched"));
        }
      } else {
        toast.error(t("findLeads.error.invalidResponse"));
      }
    } catch (error: any) {
      console.error("Lead search error:", error);
      toast.error(error.message || t("findLeads.error.searchFailed"));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              {t("findLeads.creditsDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("findLeads.creditsDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={() => setLocation("/billing")} className="w-full">
              {t("findLeads.creditsDialog.viewPlansButton")}
            </Button>
            <Button variant="outline" onClick={() => setShowCreditsDialog(false)}>
              {t("common.cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700/50 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">{t("findLeads.header.title")}</h1>
            <p className="text-slate-400 break-words">{stats ? `${formatStat(stats.leads)} buyer & trade leads` : "7M+ buyer & trade leads"} • AI-ranked, high-signal • Intent & firmographics from {stats ? formatStat(stats.suppliers) : "25.2M+"} verified and trusted suppliers</p>
          </div>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Search className="w-5 h-5" />
            {t("findLeads.searchCriteria.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-slate-700 font-medium">{t("findLeads.filter.industryLabel")}</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry" data-testid="select-industry" className="text-slate-800 placeholder:text-slate-500 data-[placeholder]:text-slate-500">
                  <SelectValue placeholder={t("findLeads.filter.industryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("findLeads.filter.regionLabel")}</Label>
              <Select value={location} onValueChange={setLeadLocation}>
                <SelectTrigger id="location" data-testid="select-location">
                  <SelectValue placeholder={t("findLeads.filter.regionPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((reg) => (
                    <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-slate-700 font-medium">{t("findLeads.filter.companySizeLabel")}</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger id="companySize" data-testid="select-company-size" className="text-slate-800 placeholder:text-slate-500 data-[placeholder]:text-slate-500">
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("findLeads.filter.anySizeOption")}</SelectItem>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-slate-700 font-medium">{t("findLeads.filter.keywordsLabel")}</Label>
              <Input 
                id="keywords" 
                placeholder={t("findLeads.filter.keywordsPlaceholder")}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                data-testid="input-keywords"
                className="text-slate-800 placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-sm text-slate-300 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-colors mt-4"
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            <span>{t("findLeads.advancedFilters.toggleLabel")} {showAdvancedFilters ? "▴" : "▾"}</span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${showAdvancedFilters ? "rotate-180" : ""}`} />
          </button>

          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
              <div className="space-y-2">
                <Label htmlFor="revenueRange">{t("findLeads.advancedFilters.revenueRangeLabel")}</Label>
                <Select value={revenueRange} onValueChange={setRevenueRange}>
                  <SelectTrigger id="revenueRange">
                    <SelectValue placeholder={t("findLeads.advancedFilters.anyOption")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("findLeads.advancedFilters.anyOption")}</SelectItem>
                    {REVENUE_RANGES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fundingStage">{t("findLeads.advancedFilters.fundingStageLabel")}</Label>
                <Select value={fundingStage} onValueChange={setFundingStage}>
                  <SelectTrigger id="fundingStage">
                    <SelectValue placeholder={t("findLeads.advancedFilters.anyOption")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("findLeads.advancedFilters.anyOption")}</SelectItem>
                    {FUNDING_STAGES.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedAfter">{t("findLeads.advancedFilters.foundedAfterLabel")}</Label>
                <Input
                  id="foundedAfter"
                  type="number"
                  placeholder={t("findLeads.advancedFilters.foundedAfterPlaceholder")}
                  min={1900}
                  max={new Date().getFullYear()}
                  value={foundedAfter}
                  onChange={(e) => setFoundedAfter(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-700">
                {isAdmin ? (
                <span className="text-emerald-700 font-semibold">{t("findLeads.search.adminUnlimitedText")}</span>
              ) : (
                <>{t("findLeads.search.creditUsageText", { count: totalCredits })}</>
              )}
            </p>
              {estimatedCount != null && (
                <p className="text-sm text-slate-600">
                  {t("findLeads.search.matchingCompaniesText", { n: estimatedCount.toLocaleString() })}
                </p>
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !industry || !location}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              data-testid="button-search-leads"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("findLeads.search.searchingButton")}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {t("findLeads.search.findButton")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSearching && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin mx-auto"></div>
                <Target className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-600 mt-4 font-medium">{t("findLeads.loading.analyzing")}</p>
              <p className="text-slate-400 text-sm mt-1">{t("findLeads.loading.duration")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {leads.length > 0 && (
        <Card className="bg-white border-slate-200 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-slate-800">
              {t("findLeads.results.foundTitle", { count: leads.length })}
            </h2>
            {selectedIds.size > 0 && isPaid && (
              <Button
                variant="outline"
                size="sm"
                data-testid="button-export-leads"
                onClick={() => {
                  const selected = leads.filter((l, i) => selectedIds.has(i));
                  const headers = ["Company", "Industry", "Location", "Employees", "Revenue", "Contact", "Email"];
                  const rows = selected.map((l) => [
                    l.companyName,
                    l.industry,
                    l.location,
                    l.employeeRange,
                    l.revenueRange,
                    `${l.contactName} (${l.contactTitle})`,
                    l.contactEmail,
                  ]);
                  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "leads-export.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success(`Exported ${selected.length} leads`);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("findLeads.results.exportCsvButton")}
              </Button>
            )}
            {selectedIds.size > 0 && !isPaid && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                🔒 {t("findLeads.results.exportLocked")}
              </Badge>
            )}
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.size === leads.length && leads.length > 0}
                      onCheckedChange={(c) => {
                        if (c) setSelectedIds(new Set(leads.map((_, i) => i)));
                        else setSelectedIds(new Set());
                      }}
                    />
                  </TableHead>
                  <TableHead>{t("findLeads.table.companyHeader")}</TableHead>
                  <TableHead>{t("findLeads.table.locationHeader")}</TableHead>
                  <TableHead>{t("findLeads.table.industryHeader")}</TableHead>
                  <TableHead>{t("findLeads.table.employeesHeader")}</TableHead>
                  <TableHead>{t("findLeads.table.revenueHeader")}</TableHead>
                  <TableHead>{t("findLeads.table.contactHeader")}</TableHead>
                  <TableHead className="w-16">{t("findLeads.table.linkedinHeader")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead, index) => {
                  const aiScore = 70 + (index % 25);
                  const scoreColor = aiScore >= 80 ? "bg-green-100 text-green-700" : aiScore >= 60 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700";
                  return (
                    <TableRow
                      key={index}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelectedLead(lead)}
                      data-testid={`row-lead-${index}`}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(index)}
                          onCheckedChange={(c) => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (c) next.add(index);
                              else next.delete(index);
                              return next;
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800 line-clamp-1">{lead.companyName}</span>
                          <Badge className={`text-xs shrink-0 ${scoreColor}`}>{aiScore}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{lead.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs bg-slate-100">{lead.industry}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{lead.employeeRange}</TableCell>
                      <TableCell className="text-slate-600">{lead.revenueRange}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium">{(lead.contactName || "").split(" ")[0]}</span>
                          <span className="text-slate-500"> · {lead.contactTitle}</span>
                          <br />
                          <span className={isPaid ? "text-blue-600" : "text-slate-400"}>{isPaid ? lead.contactEmail : maskEmail(lead.contactEmail)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isPaid ? (
                          <a
                            href={`https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(lead.contactName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">🔒 {t("findLeads.table.proLocked")}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="block">{selectedLead.companyName}</span>
                    <span className="text-sm font-normal text-slate-500">{selectedLead.industry}</span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{t("findLeads.detailsModal.locationLabel")}</p>
                      <p className="font-medium text-slate-900">{selectedLead.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Users className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{t("findLeads.detailsModal.companySizeLabel")}</p>
                      <p className="font-medium text-slate-900">{selectedLead.employeeRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{t("findLeads.detailsModal.revenueLabel")}</p>
                      <p className="font-medium text-slate-900">{selectedLead.revenueRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Globe className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{t("findLeads.detailsModal.websiteLabel")}</p>
                      {selectedLead.website ? (
                        <a
                          href={selectedLead.website.startsWith("http") ? selectedLead.website : `https://${selectedLead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                        >
                          {selectedLead.website}
                        </a>
                      ) : (
                        <span className="font-medium text-slate-500">—</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {t("findLeads.detailsModal.keyContactTitle")}
                  </h4>
                  <div className="bg-gradient-to-r from-slate-50 to-emerald-50 p-4 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-800">{selectedLead.contactName}</p>
                    <p className="text-sm text-slate-600">{selectedLead.contactTitle}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-blue-600">{selectedLead.contactEmail}</span>
                    </div>
                  </div>
                </div>

                {selectedLead.sourcingFocus && selectedLead.sourcingFocus.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {t("findLeads.detailsModal.sourcingFocusTitle")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.sourcingFocus.map((focus, i) => (
                        <Badge key={i} className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {t("findLeads.detailsModal.aiInsightsTitle")}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedLead.aiSummary}</p>
                </div>

                {selectedLead.intentSignals && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      {t("findLeads.detailsModal.intentSignalsTitle")}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedLead.intentSignals.recentActivity && (
                        <p className="text-slate-600">
                          <span className="font-medium">{t("findLeads.detailsModal.recentActivityLabel")}</span> {selectedLead.intentSignals.recentActivity}
                        </p>
                      )}
                      {selectedLead.intentSignals.importTrends && (
                        <p className="text-slate-600">
                          <span className="font-medium">{t("findLeads.detailsModal.importTrendsLabel")}</span> {selectedLead.intentSignals.importTrends}
                        </p>
                      )}
                      {selectedLead.intentSignals.growthIndicators && (
                        <p className="text-slate-600">
                          <span className="font-medium">{t("findLeads.detailsModal.growthIndicatorsLabel")}</span> {selectedLead.intentSignals.growthIndicators}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
