import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Star, Shield, Filter, X, Building2, Clock, DollarSign, Send, ExternalLink, Check, ChevronRight, Lock, ArrowRight, Crown, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useProfile } from "@/lib/hooks";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

// ─── Types ───────────────────────────────────────────────────────────

interface Supplier {
  id: string;
  companyName: string;
  slug: string;
  country: string;
  countryCode: string;
  city: string;
  industry: string;
  subIndustry: string | null;
  products: string[];
  certifications: string[];
  description: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  responseTime: string | null;
  minOrderValue: number | null;
  yearEstablished: number;
  employeeCount: number | null;
  annualRevenue: string | null;
  dataSource?: string | null;
  registryUrl?: string | null;
  registryId?: string | null;
  sicCode?: string | null;
  contactVerified?: boolean;
}
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FilterOption {
  name: string;
  count: number;
}

interface FiltersData {
  countries: FilterOption[];
  industries: FilterOption[];
}

// ─── API Hooks ───────────────────────────────────────────────────────

function useSuppliers(params: {
  q: string;
  country: string;
  industry: string;
  verified: boolean;
  sortBy: string;
  page: number;
  minOrderValue?: number | null;
  minScore?: number | null;
}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.country) searchParams.set("country", params.country);
  if (params.industry) searchParams.set("industry", params.industry);
  if (params.verified) searchParams.set("verified", "true");
  if (params.minOrderValue != null) searchParams.set("minOrderValue", params.minOrderValue.toString());
  if (params.minScore != null) searchParams.set("minScore", params.minScore.toString());
  searchParams.set("sortBy", params.sortBy);
  searchParams.set("page", params.page.toString());
  searchParams.set("limit", "20");

  return useQuery<{ suppliers: Supplier[]; pagination: Pagination; guestLimited?: boolean; freeLimit?: number; fallback?: boolean; needFilter?: boolean; message?: string }>({
    queryKey: ["suppliers", params],
    queryFn: async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);
      try {
        const res = await fetch(`/api/suppliers?${searchParams.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        return res.json();
      } catch (err: any) {
        if (err?.name === "AbortError") throw new Error("Search timed out. Please try again.");
        throw err;
      } finally {
        clearTimeout(timeout);
      }
    },
    staleTime: 30000,
    retry: 1,
  });
}

function useFilters() {
  return useQuery<FiltersData>({
    queryKey: ["supplier-filters"],
    queryFn: async () => {
      const res = await fetch("/api/suppliers/filters");
      if (!res.ok) throw new Error("Failed to fetch filters");
      return res.json();
    },
    staleTime: 60000,
  });
}

function useStats() {
  return useQuery<{ suppliers: number; countries: number }>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      return { suppliers: data.suppliers ?? 0, countries: data.countries ?? 0 };
    },
    staleTime: 60000,
  });
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}+`;
}

const ABBREVIATIONS = new Set(["pt", "tbk", "gmbh", "llc", "ltd", "inc", "co", "lp", "llp", "plc", "sa", "ag", "nv", "bv", "corp", "pl", "spa", "srl", "ltda", "sl", "ab", "oy", "as", "uk", "us"]);

function toTitleCase(str: string): string {
  if (!str || typeof str !== "string") return str;
  return str.replace(/\w\S*/g, (w) => {
    const lower = w.toLowerCase();
    if (ABBREVIATIONS.has(lower)) {
      return lower === "gmbh" ? "GmbH" : lower.toUpperCase();
    }
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  });
}

function formatLocation(str: string): string {
  if (!str || typeof str !== "string") return str;
  return str.split(",").map((part) => toTitleCase(part.trim())).join(", ");
}

function formatList(items: string[]): string {
  if (!Array.isArray(items) || items.length === 0) return "";
  return items.map((item) => toTitleCase(String(item).trim())).join(", ");
}

// ─── Employee count badge color ───────────────────────────────────────

function getEmployeeBadgeClass(count: number): string {
  if (count <= 10) return "bg-gray-100 text-gray-700";
  if (count <= 50) return "bg-blue-100 text-blue-700";
  if (count <= 200) return "bg-teal-100 text-teal-700";
  if (count <= 1000) return "bg-purple-100 text-purple-700";
  return "bg-amber-100 text-amber-700";
}

// ─── Supplier Card ───────────────────────────────────────────────────

function SupplierCard({ supplier, onClick }: { supplier: Supplier; onClick: () => void }) {
  const { t } = useTranslation();
  const isVerified = supplier.verified || supplier.dataSource === "Companies House UK" || supplier.dataSource === "SEC EDGAR";
  const qualityScore = Math.round((supplier.rating || 0) * 20);
  const scoreColor = qualityScore >= 80
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : qualityScore >= 60
    ? "text-blue-700 bg-blue-50 border-blue-200"
    : "text-amber-700 bg-amber-50 border-amber-200";

  const products = Array.isArray(supplier.products) ? supplier.products : [];
  const productDisplay = products.slice(0, 3);
  const productOverflow = products.length - 3;

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5"
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Company initials avatar */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {toTitleCase(supplier.companyName).split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-900 truncate leading-snug">{toTitleCase(supplier.companyName)}</h3>
              {isVerified && (
                <span className="inline-flex items-center gap-0.5 shrink-0 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-full">
                  <Check className="w-2.5 h-2.5" /> {t('supplier.verified')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
              <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{formatLocation(supplier.city)}, {formatLocation(supplier.country)}</span>
            </div>
          </div>
          {/* Score badge */}
          <div className={`shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl border text-xs font-bold ${scoreColor}`}>
            <span className="text-sm leading-none">{qualityScore}</span>
            <span className="text-[9px] font-normal leading-none opacity-60 mt-0.5">QS</span>
          </div>
        </div>

        {/* Industry + sub */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="inline-block bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-md">
            {toTitleCase(supplier.industry)}
          </span>
          {supplier.subIndustry && (
            <span className="inline-block bg-slate-50 text-slate-500 text-xs px-2 py-0.5 rounded-md border border-slate-200">
              {toTitleCase(supplier.subIndustry)}
            </span>
          )}
        </div>

        {/* Products */}
        {products.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {productDisplay.map((p, i) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                {toTitleCase(String(p))}
              </span>
            ))}
            {productOverflow > 0 && (
              <span className="text-xs text-slate-400 self-center">+{productOverflow}</span>
            )}
          </div>
        )}

        {/* Footer: rating + employees */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-3 h-3 ${i <= Math.round(supplier.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
            ))}
            <span className="ml-1 text-slate-600 font-medium">{(supplier.rating || 0).toFixed(1)}</span>
          </div>
          {supplier.employeeCount != null && (
            <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] ${getEmployeeBadgeClass(supplier.employeeCount)}`}>
              {supplier.employeeCount >= 1000 ? `${(supplier.employeeCount / 1000).toFixed(1)}K+` : supplier.employeeCount.toLocaleString()} emp.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Supplier Detail Modal ───────────────────────────────────────────

function SupplierDetail({
  slug,
  supplierId,
  onClose,
  openContactForm = false,
}: {
  slug: string;
  supplierId?: string;
  onClose: () => void;
  openContactForm?: boolean;
}) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const isPaid = !!profile && profile.plan !== "free";
  const { data: supplier, isLoading } = useQuery<Supplier & {
    contactEmail?: string;
    contactPhone?: string | null;
    website?: string | null;
    paymentTerms: string[];
    exportMarkets: string[];
    currency?: string;
  }>({
    queryKey: ["supplier", slug, supplierId],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers/${slug}`, { credentials: "include" });
      if (res.ok) return res.json();
      if (res.status === 404 && supplierId) {
        const byId = await fetch(`/api/suppliers/by-id/${supplierId}`, { credentials: "include" });
        if (byId.ok) return byId.json();
      }
      throw new Error("Failed to fetch supplier");
    },
  });

  const [showContactForm, setShowContactForm] = useState(openContactForm);
  const [contactForm, setContactForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerCompany: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmitLead = async () => {
    if (!supplier || !contactForm.buyerName || !contactForm.buyerEmail || !contactForm.message) return;
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: supplier.id,
          ...contactForm,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitStatus("sent");
    } catch {
      setSubmitStatus("error");
    }
  };

  const qualityScore = Math.round((supplier?.rating || 0) * 20);
  const descFormatted = supplier?.description
    ? (() => {
        if (!supplier) return "";
        let d = supplier.description;
        d = d.replace(new RegExp(supplier.companyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), toTitleCase(supplier.companyName));
        d = d.replace(new RegExp(supplier.city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), formatLocation(supplier.city));
        d = d.replace(new RegExp(supplier.country.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), formatLocation(supplier.country));
        return d.charAt(0).toUpperCase() + d.slice(1);
      })()
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="p-12 text-center text-gray-600">Loading...</div>
        ) : supplier ? (
          <>
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900">{toTitleCase(supplier.companyName)}</h2>
                    {supplier.verified && (
                      <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {supplier.yearEstablished && (
                      <span className="text-sm text-gray-500">Est. {supplier.yearEstablished}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-4 h-4 ${i <= (supplier.rating || 0) ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                      ))}
                      <span className="ml-0.5 font-medium">{(supplier.rating || 0).toFixed(1)}</span>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-sm px-2 py-0.5 rounded font-medium">
                      {t("supplier.qualityScore")}: {qualityScore}/100
                    </span>
                    {supplier.employeeCount != null && (
                      <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${getEmployeeBadgeClass(supplier.employeeCount)}`}>
                        {supplier.employeeCount.toLocaleString()} employees
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">{toTitleCase(supplier.industry)}</span>
                    {supplier.subIndustry && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{toTitleCase(supplier.subIndustry)}</span>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <p className="text-gray-700">{descFormatted}</p>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("supplier.products")}</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(supplier.products) && supplier.products.length > 0
                    ? supplier.products.map((p, i) => (
                        <span key={i} className="text-sm bg-gray-50 text-gray-700 px-2.5 py-1 rounded">{toTitleCase(String(p))}</span>
                      ))
                    : <span className="text-sm text-gray-500">—</span>}
                </div>
              </div>

              {supplier.certifications && supplier.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("supplier.certifications")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((c) => (
                      <span key={c} className="text-sm bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded inline-flex items-center gap-1">
                        🏅 {toTitleCase(c)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {supplier.paymentTerms && supplier.paymentTerms.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">{t("supplier.paymentTerms")}</h4>
                    <p className="text-sm text-gray-900">{formatList(supplier.paymentTerms)}</p>
                  </div>
                )}
                {supplier.exportMarkets && supplier.exportMarkets.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">{t("supplier.keyMarkets")}</h4>
                    <p className="text-sm text-gray-900">{formatList(supplier.exportMarkets)}</p>
                  </div>
                )}
              </div>

              {/* Contact Section */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">{t("supplier.contactSection")}</h4>
                {isPaid ? (
                  (supplier.contactEmail || supplier.contactPhone || supplier.website) ? (
                    <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                      {supplier.contactEmail && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">Email:</span>
                          <a href={`mailto:${supplier.contactEmail}`} className="text-blue-600 hover:underline text-sm">
                            {supplier.contactEmail}
                          </a>
                        </div>
                      )}
                      {supplier.contactPhone && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">Phone:</span>
                          <a href={`tel:${supplier.contactPhone}`} className="text-blue-600 hover:underline text-sm">
                            {supplier.contactPhone}
                          </a>
                        </div>
                      )}
                      {supplier.website && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">Website:</span>
                          <a
                            href={supplier.website.startsWith("http") ? supplier.website : `https://${supplier.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-all"
                          >
                            {supplier.website}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">{t("supplier.noContactInfo")}</p>
                  )
                ) : (
                  <div className="relative bg-gray-100 rounded-lg p-6 overflow-hidden">
                    <div className="blur-sm select-none pointer-events-none space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-48" />
                      <div className="h-4 bg-gray-300 rounded w-36" />
                      <div className="h-4 bg-gray-300 rounded w-56" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
                      <span className="text-gray-600 font-medium">🔒 {t("supplier.signInToView")}</span>
                      <p className="text-sm text-gray-500 mt-1">{t("supplier.upgradeAccess")}</p>
                      <Link href="/billing">
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                          {t("supplier.upgrade")}
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {supplier.registryUrl && (
                <a
                  href={supplier.registryUrl.startsWith("http") ? supplier.registryUrl : `https://${supplier.registryUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                >
                  Official registry <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Contact Form */}
              {!showContactForm ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> {t("supplier.contactSupplier")}
                  </button>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    {t("supplier.requestQuote")}
                  </button>
                </div>
              ) : submitStatus === "sent" ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-center">
                  {t("supplier.inquirySent")} {supplier.companyName}. They typically respond within {supplier.responseTime || "1-3 days"}.
                </div>
              ) : (
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <h4 className="font-semibold text-gray-900">{t("supplier.sendInquiry")}</h4>
                  <input
                    type="text"
                    placeholder={t("supplier.yourName")}
                    value={contactForm.buyerName}
                    onChange={(e) => setContactForm((f) => ({ ...f, buyerName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder={t("supplier.yourEmail")}
                    value={contactForm.buyerEmail}
                    onChange={(e) => setContactForm((f) => ({ ...f, buyerEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder={t("supplier.companyName")}
                    value={contactForm.buyerCompany}
                    onChange={(e) => setContactForm((f) => ({ ...f, buyerCompany: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder={t("supplier.yourMessage")}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitLead}
                      disabled={submitStatus === "sending" || !contactForm.buyerName || !contactForm.buyerEmail || !contactForm.message}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitStatus === "sending" ? t("supplier.sending") : t("supplier.sendInquiry")}
                    </button>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                  {submitStatus === "error" && (
                    <p className="text-red-500 text-sm">Failed to send. Please try again.</p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-gray-600">Supplier not found</div>
        )}
      </div>
    </div>
  );
}

// ─── Signup Wall ─────────────────────────────────────────────────────

function GhostCard() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden select-none" aria-hidden="true">
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="h-6 w-14 bg-gray-100 rounded" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-5 bg-gray-100 rounded w-20" />
          <div className="h-5 bg-gray-100 rounded w-16" />
          <div className="h-5 bg-gray-100 rounded w-14" />
        </div>
      </div>
    </div>
  );
}

function SignupWall({ total, freeLimit }: { total: number; freeLimit: number }) {
  const { t } = useTranslation();
  const locked = Math.max(0, total - freeLimit);
  const ghostCount = Math.min(locked, 6);
  const [, navigate] = useLocation();

  return (
    <div className="relative mt-4">
      {/* Blurred ghost cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 blur-sm pointer-events-none">
        {Array.from({ length: ghostCount }).map((_, i) => (
          <GhostCard key={i} />
        ))}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {locked.toLocaleString()} more supplier{locked !== 1 ? "s" : ""} found
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {t("supplier.limitedResults", { shown: freeLimit, total: total.toLocaleString() })}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              {t("supplier.signUpToSeeAll")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Log in
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">{t("supplier.freeNoCard")}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Free User Upgrade Wall ───────────────────────────────────────────

function FreeUserUpgradeWall({ total, freeLimit }: { total: number; freeLimit: number }) {
  const locked = Math.max(0, total - freeLimit);
  const ghostCount = Math.min(locked, 6);
  const [, navigate] = useLocation();

  return (
    <div className="relative mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 blur-sm pointer-events-none">
        {Array.from({ length: ghostCount }).map((_, i) => (
          <GhostCard key={i} />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-4">
            <Crown className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {locked.toLocaleString()} more supplier{locked !== 1 ? "s" : ""} available
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Upgrade to Pro to unlock all {total.toLocaleString()} results, contact details, and advanced filters.
          </p>
          <button
            onClick={() => navigate("/billing")}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition w-full sm:w-auto"
          >
            <Crown className="w-4 h-4" /> Upgrade to Pro
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-400 mt-4">Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

interface SupplierDiscoveryProps {
  embedded?: boolean;
  initialIndustry?: string;
  initialQuery?: string;
}

export default function SupplierDiscovery({ embedded, initialIndustry, initialQuery }: SupplierDiscoveryProps = {}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery || "");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry || "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [minOrderValue, setMinOrderValue] = useState<number | null>(null);
  const [minScore, setMinScore] = useState<number | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Read URL params or initialIndustry/initialQuery prop on mount
  useEffect(() => {
    if (initialIndustry) setSelectedIndustry(initialIndustry);
    if (initialQuery) { setSearchQuery(initialQuery); setDebouncedQuery(initialQuery); }
    if (embedded) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const industry = params.get("industry");
    if (q) {
      setSearchQuery(q);
      setDebouncedQuery(q);
    }
    if (industry) setSelectedIndustry(industry);
  }, [initialIndustry, initialQuery, embedded]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [selectedCountry, selectedIndustry, verifiedOnly, sortBy, minOrderValue, minScore]);

  const { data: profile } = useProfile();
  const isFreeUser = !!profile && profile.plan === "free";
  const FREE_LIMIT = 5;

  const { data, isLoading, isFetching, isError, error } = useSuppliers({
    q: debouncedQuery,
    country: selectedCountry,
    industry: selectedIndustry,
    verified: verifiedOnly,
    sortBy,
    page,
    minOrderValue,
    minScore,
  });

  const { data: filters } = useFilters();

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCountry("");
    setSelectedIndustry("");
    setVerifiedOnly(false);
    setSortBy("rating");
    setMinOrderValue(null);
    setMinScore(null);
    setPage(1);
  };

  const hasActiveFilters = selectedCountry || selectedIndustry || verifiedOnly || debouncedQuery || minOrderValue != null || minScore != null;
  const needFilter = data?.needFilter === true;
  const { data: stats } = useStats();
  const supplierCount = stats?.suppliers ?? 0;
  const countryCount = stats?.countries ?? 220;

  return (
    <div className={`bg-gray-50 ${embedded ? "min-h-0 rounded-xl" : "min-h-screen"}`}>
      {/* Hero / Search Bar */}
      <div className={`bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white ${embedded ? "rounded-t-xl" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {t('supplier.pageSubtitle')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">{t('supplier.pageTitle')}</h1>
          <p className="text-slate-300 mb-1.5 text-sm max-w-2xl">
            {supplierCount > 0 ? `AI-powered search across ${formatStat(supplierCount)} verified suppliers${countryCount > 0 ? ` in ${countryCount}+ countries` : ' worldwide'}` : `AI-powered global supplier discovery`}
          </p>
          <p className="text-slate-500 text-xs mb-8">{t('supplier.pageTrustLine')}</p>
          <div className="flex gap-2">
            <div className="flex-1 relative group max-w-2xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder={t("supplier.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 focus:bg-white/8 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${showFilters || hasActiveFilters ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
            >
              <Filter className="w-4 h-4" />
              {t("supplier.filters")}
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">!</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* needFilter: metin araması için ülke/sektör zorunlu */}
      {needFilter && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-amber-600 font-medium">{data?.message || "Ülke veya sektör seçerek aramayı hızlandırın (25M+ kayıtta filtre gerekli)"}</span>
            <button onClick={() => setShowFilters(true)} className="text-amber-700 underline text-sm font-medium">Filtreleri aç</button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      {(showFilters || needFilter) && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Country filter */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t("supplier.allCountries")}</option>
                {filters?.countries.map((c) => (
                  <option key={c.name} value={c.name}>{formatLocation(c.name)} ({c.count.toLocaleString()})</option>
                ))}
              </select>

              {/* Industry filter */}
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t("supplier.allIndustries")}</option>
                {filters?.industries.map((i) => (
                  <option key={i.name} value={i.name}>{toTitleCase(i.name)} ({i.count.toLocaleString()})</option>
                ))}
              </select>

              {/* Verified only */}
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                {t("supplier.verifiedOnly")}
              </label>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="rating">{t("supplier.sortTopRated")}</option>
                <option value="reviewCount">{t("supplier.sortMostReviewed")}</option>
                <option value="yearEstablished">{t("supplier.sortEstablished")}</option>
                <option value="companyName">{t("supplier.sortNameAZ")}</option>
                <option value="reliability">{t("supplier.sortMostReliable")}</option>
                <option value="cost">{t("supplier.sortLowestCost")}</option>
                <option value="tradeVolume">{t("supplier.sortHighestVolume")}</option>
                <option value="shippingSpeed">{t("supplier.sortFastestShipping")}</option>
              </select>

              {/* MOQ filter */}
              <select
                value={minOrderValue ?? ""}
                onChange={(e) => setMinOrderValue(e.target.value === "" ? null : Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Minimum Order Quantity"
              >
                <option value="">{t('supplier.moqAny')}</option>
                <option value="0">{t('supplier.moqRange', { min: '$0' })}</option>
                <option value="500">{t('supplier.moqRange', { min: '$500' })}</option>
                <option value="1000">{t('supplier.moqRange', { min: '$1,000' })}</option>
                <option value="5000">{t('supplier.moqRange', { min: '$5,000' })}</option>
                <option value="10000">{t('supplier.moqRange', { min: '$10,000' })}</option>
              </select>

              {/* Supplier Score filter */}
              <select
                value={minScore ?? ""}
                onChange={(e) => setMinScore(e.target.value === "" ? null : Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title={t("supplier.qualityScore")}
              >
                <option value="">{t("supplier.qualityScore")}: Any</option>
                <option value="60">{t("supplier.qualityScore")}: 60+</option>
                <option value="70">{t("supplier.qualityScore")}: 70+</option>
                <option value="80">{t("supplier.qualityScore")}: 80+</option>
                <option value="90">{t("supplier.qualityScore")}: 90+</option>
              </select>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> {t("supplier.clearAll")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Searching suppliers...</span>
              </>
            ) : isError ? (
              <span className="text-red-600">{t("supplier.failedLoad")}</span>
            ) : needFilter ? (
              <span className="text-amber-600">Ülke veya sektör seçerek aramayı hızlandırın</span>
            ) : data ? (
              <>
                {t("supplier.suppliersFound", { total: data.pagination.total.toLocaleString() })}
                {debouncedQuery && <span className="text-gray-500"> for &ldquo;{debouncedQuery}&rdquo;</span>}
                {isFetching && <Loader2 className="w-3 h-3 animate-spin text-slate-400 inline-block" />}
              </>
            ) : null}
          </p>
          {data?.guestLimited && (
            <Link href="/signup">
              <span className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                <Lock className="w-3.5 h-3.5" />
                {t("supplier.signUpToSeeAll")}
              </span>
            </Link>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-12 bg-gray-100 rounded mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded w-20" />
                  <div className="h-6 bg-gray-100 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.suppliers.length > 0 ? (
          <>
            {data.fallback && (
              <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" /></svg>
                {t("supplier.noExactMatches")}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isFreeUser ? data.suppliers.slice(0, FREE_LIMIT) : data.suppliers).map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onClick={() => {
                    setSelectedSlug(supplier.slug);
                    setSelectedSupplierId(supplier.id);
                  }}
                />
              ))}
            </div>

            {/* Growth loop: show signup wall for guests */}
            {data.guestLimited && data.pagination.total > (data.freeLimit ?? 3) && (
              <SignupWall
                total={data.pagination.total}
                freeLimit={data.freeLimit ?? 3}
              />
            )}

            {/* Upgrade wall for authenticated free users */}
            {!data.guestLimited && isFreeUser && data.pagination.total > FREE_LIMIT && (
              <FreeUserUpgradeWall
                total={data.pagination.total}
                freeLimit={FREE_LIMIT}
              />
            )}

            {/* Pagination — only for pro users */}
            {!data.guestLimited && !isFreeUser && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8 pb-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  Page {data.pagination.page.toLocaleString()} of {data.pagination.totalPages.toLocaleString()}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : isError ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">{t("supplier.failedLoad")}</h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : t("supplier.serverRunning")}
            </p>
            <button onClick={() => window.location.reload()} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Retry
            </button>
          </div>
        ) : needFilter ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Ülke veya sektör seçin</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              25M+ tedarikçi arasında metin araması filtre olmadan çok yavaş. Üstteki filtrelerden bir ülke veya sektör seçerek aramayı hızlandırın.
            </p>
            <button onClick={() => setShowFilters(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Filtreleri aç
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">{t("supplier.noSuppliers")}</h3>
            <p className="text-gray-600 mb-4">{t("supplier.adjustSearch")}</p>
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              {t("supplier.clearFilters")}
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSlug && (
        <SupplierDetail
          slug={selectedSlug}
          supplierId={selectedSupplierId ?? undefined}
          onClose={() => {
            setSelectedSlug(null);
            setSelectedSupplierId(null);
          }}
          openContactForm={new URLSearchParams(window.location.search).get("contact") === "1"}
        />
      )}

      {/* Disclaimer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
            {t("supplier.disclaimer")}
          </p>
        </div>
      </footer>
    </div>
  );
}
