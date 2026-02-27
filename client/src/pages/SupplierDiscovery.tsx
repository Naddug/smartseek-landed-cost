import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Star, Shield, Filter, X, Building2, Clock, DollarSign, Send, ExternalLink, BadgeCheck } from "lucide-react";
import { Logo } from "@/components/Logo";

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
}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.country) searchParams.set("country", params.country);
  if (params.industry) searchParams.set("industry", params.industry);
  if (params.verified) searchParams.set("verified", "true");
  searchParams.set("sortBy", params.sortBy);
  searchParams.set("page", params.page.toString());
  searchParams.set("limit", "20");

  return useQuery<{ suppliers: Supplier[]; pagination: Pagination }>({
    queryKey: ["suppliers", params],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      return res.json();
    },
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
      return { suppliers: data.suppliers ?? 4300000, countries: data.countries ?? 220 };
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

// ─── Industry border color ────────────────────────────────────────────

function getIndustryBorderColor(industry: string): string {
  if (industry.includes("Mining") || industry.includes("Minerals")) return "border-l-amber-600";
  if (industry.includes("Electronics")) return "border-l-blue-500";
  if (industry.includes("Textiles")) return "border-l-purple-500";
  if (industry.includes("Machinery")) return "border-l-orange-500";
  if (industry.includes("Chemicals")) return "border-l-green-500";
  if (industry.includes("Food") || industry.includes("Agriculture")) return "border-l-amber-500";
  return "border-l-gray-300";
}

// ─── Supplier Card ───────────────────────────────────────────────────

function SupplierCard({ supplier, onClick }: { supplier: Supplier; onClick: () => void }) {
  const borderColor = getIndustryBorderColor(supplier.industry);
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 border-l-4 ${borderColor} rounded-lg p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{toTitleCase(supplier.companyName)}</h3>
            {supplier.verified && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" />Verified
              </span>
            )}
            {(supplier.dataSource === "Companies House UK" || supplier.dataSource === "SEC EDGAR") && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                <BadgeCheck className="w-3 h-3" />Registry Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
            <MapPin className="w-3.5 h-3.5" />
            <span>{formatLocation(supplier.city)}, {formatLocation(supplier.country)}</span>
          </div>
        </div>
        {supplier.reviewCount > 0 ? (
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-yellow-700">{supplier.rating.toFixed(1)}</span>
            <span className="text-gray-600">({supplier.reviewCount})</span>
          </div>
        ) : (
          <span className="text-xs text-slate-500 px-2 py-1">Verified</span>
        )}
      </div>

      <div className="mb-3">
        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded mr-2">
          {toTitleCase(supplier.industry)}
        </span>
        {supplier.subIndustry && (
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
            {toTitleCase(supplier.subIndustry)}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
        {supplier.description
          ? (() => {
              let d = supplier.description;
              d = d.replace(new RegExp(supplier.companyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), toTitleCase(supplier.companyName));
              d = d.replace(new RegExp(supplier.city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), formatLocation(supplier.city));
              d = d.replace(new RegExp(supplier.country.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), formatLocation(supplier.country));
              return d.charAt(0).toUpperCase() + d.slice(1);
            })()
          : ""}
      </p>

      {Array.isArray(supplier.products) && supplier.products.length > 0 && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {formatList(supplier.products.slice(0, 4))}
          {supplier.products.length > 4 && ` +${supplier.products.length - 4} more`}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {supplier.registryUrl && (
            <a
              href={supplier.registryUrl.startsWith("http") ? supplier.registryUrl : `https://${supplier.registryUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> {supplier.contactVerified ? "Verified contact · Registry" : "Contact via registry"}
            </a>
          )}
          {supplier.responseTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {supplier.responseTime}
            </span>
          )}
          {supplier.employeeCount && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {supplier.employeeCount} staff
            </span>
          )}
        </div>
        {supplier.minOrderValue && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> MOQ ${supplier.minOrderValue.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Supplier Detail Modal ───────────────────────────────────────────

function SupplierDetail({
  slug,
  onClose,
  openContactForm = false,
}: {
  slug: string;
  onClose: () => void;
  openContactForm?: boolean;
}) {
  const { data: supplier, isLoading } = useQuery<Supplier & {
    contactEmail: string;
    contactPhone: string | null;
    website: string | null;
    paymentTerms: string[];
    exportMarkets: string[];
    currency: string;
  }>({
    queryKey: ["supplier", slug],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch supplier");
      return res.json();
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
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900">{toTitleCase(supplier.companyName)}</h2>
                    {supplier.verified && <Shield className="w-5 h-5 text-blue-600" />}
                    {(supplier.dataSource === "Companies House UK" || supplier.dataSource === "SEC EDGAR") && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3" /> Registry Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{formatLocation(supplier.city)}, {formatLocation(supplier.country)} · Est. {supplier.yearEstablished}</p>
                </div>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-3">
                {supplier.reviewCount > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{supplier.rating.toFixed(1)}</span>
                    <span className="text-gray-600 text-sm">({supplier.reviewCount} reviews)</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Verified</span>
                )}
                <span className="bg-blue-50 text-blue-700 text-sm px-2 py-0.5 rounded">{toTitleCase(supplier.industry)}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <p className="text-gray-700">
                {supplier.description
                  ? (() => {
                      let d = supplier.description;
                      d = d.replace(new RegExp(supplier.companyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), toTitleCase(supplier.companyName));
                      d = d.replace(new RegExp(supplier.city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), formatLocation(supplier.city));
                      d = d.replace(new RegExp(supplier.country.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), formatLocation(supplier.country));
                      return d.charAt(0).toUpperCase() + d.slice(1);
                    })()
                  : ""}
              </p>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Products</h4>
                <p className="text-sm text-gray-700">
                  {Array.isArray(supplier.products) && supplier.products.length > 0
                    ? formatList(supplier.products)
                    : toTitleCase(supplier.industry || "—")}
                </p>
              </div>

              {supplier.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((c) => (
                      <span key={c} className="text-sm bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded">{toTitleCase(c)}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {supplier.employeeCount && (
                  <div><span className="text-gray-700 font-medium">Employees:</span> <span className="font-medium text-gray-900">{supplier.employeeCount.toLocaleString()}</span></div>
                )}
                {supplier.annualRevenue && (
                  <div><span className="text-gray-700 font-medium">Revenue:</span> <span className="font-medium text-gray-900">{supplier.annualRevenue}</span></div>
                )}
                {supplier.responseTime && (
                  <div><span className="text-gray-700 font-medium">Response Time:</span> <span className="font-medium text-gray-900">{supplier.responseTime}</span></div>
                )}
                {supplier.minOrderValue && (
                  <div><span className="text-gray-700 font-medium">Min Order:</span> <span className="font-medium text-gray-900">${supplier.minOrderValue.toLocaleString()}</span></div>
                )}
                {supplier.paymentTerms.length > 0 && (
                  <div><span className="text-gray-700 font-medium">Payment:</span> <span className="font-medium text-gray-900">{formatList(supplier.paymentTerms)}</span></div>
                )}
                {supplier.exportMarkets.length > 0 && (
                  <div><span className="text-gray-700 font-medium">Markets:</span> <span className="font-medium text-gray-900">{formatList(supplier.exportMarkets)}</span></div>
                )}
                {supplier.website && (
                  <div className="col-span-2"><span className="text-gray-700 font-medium">Website:</span>{" "}
                    <a
                      href={supplier.website.startsWith("http") ? supplier.website : `https://${supplier.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                    >
                      {supplier.website}
                    </a>
                  </div>
                )}
                {supplier.registryUrl && (
                  <div className="col-span-2"><span className="text-gray-700 font-medium">Official registry:</span>{" "}
                    <a
                      href={supplier.registryUrl.startsWith("http") ? supplier.registryUrl : `https://${supplier.registryUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      View on official registry <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              {!showContactForm ? (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Contact Supplier
                </button>
              ) : submitStatus === "sent" ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-center">
                  Your inquiry has been sent to {supplier.companyName}. They typically respond within {supplier.responseTime || "1-3 days"}.
                </div>
              ) : (
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <h4 className="font-semibold text-gray-900">Send Inquiry</h4>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={contactForm.buyerName}
                    onChange={(e) => setContactForm((f) => ({ ...f, buyerName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email *"
                    value={contactForm.buyerEmail}
                    onChange={(e) => setContactForm((f) => ({ ...f, buyerEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={contactForm.buyerCompany}
                    onChange={(e) => setContactForm((f) => ({ ...f, buyerCompany: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Your message to the supplier... *"
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
                      {submitStatus === "sending" ? "Sending..." : "Send Inquiry"}
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

// ─── Main Page ───────────────────────────────────────────────────────

interface SupplierDiscoveryProps {
  embedded?: boolean;
  initialIndustry?: string;
}

export default function SupplierDiscovery({ embedded, initialIndustry }: SupplierDiscoveryProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry || "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug");
  });
  const [showFilters, setShowFilters] = useState(false);

  // Read URL params or initialIndustry prop on mount
  useEffect(() => {
    if (initialIndustry) {
      setSelectedIndustry(initialIndustry);
    }
    if (embedded) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const industry = params.get("industry");
    if (q) {
      setSearchQuery(q);
      setDebouncedQuery(q);
    }
    if (industry) setSelectedIndustry(industry);
  }, [initialIndustry, embedded]);

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
  }, [selectedCountry, selectedIndustry, verifiedOnly, sortBy]);

  const { data, isLoading, isError, error } = useSuppliers({
    q: debouncedQuery,
    country: selectedCountry,
    industry: selectedIndustry,
    verified: verifiedOnly,
    sortBy,
    page,
  });

  const { data: filters } = useFilters();

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCountry("");
    setSelectedIndustry("");
    setVerifiedOnly(false);
    setSortBy("rating");
    setPage(1);
  };

  const hasActiveFilters = selectedCountry || selectedIndustry || verifiedOnly || debouncedQuery;
  const { data: stats } = useStats();
  const supplierCount = stats?.suppliers ?? 4300000;
  const countryCount = stats?.countries ?? 220;

  return (
    <div className={`bg-gray-50 ${embedded ? "min-h-0 rounded-xl" : "min-h-screen"}`}>
      {/* Hero / Search Bar */}
      <div className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white ${embedded ? "rounded-t-xl" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Logo size="lg" variant="light" className="w-28 h-28" />
            <span className="text-white/80 text-sm font-medium">SmartSeek Supplier Discovery</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Find Verified Global Suppliers</h1>
          <p className="text-blue-100 mb-2">AI-powered search across {formatStat(supplierCount)} verified suppliers in {countryCount}+ countries</p>
          <p className="text-blue-200/90 text-sm mb-6">100% real companies from government registries • Every supplier links to official source • No fake or scraped data</p>
          <div className="flex gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-white group-focus-within:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-200" />
              <input
                type="text"
                placeholder="Search suppliers, products, or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-white text-blue-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Countries</option>
                {filters?.countries.map((c) => (
                  <option key={c.name} value={c.name}>{formatLocation(c.name)} ({c.count.toLocaleString()})</option>
                ))}
              </select>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {filters?.industries.map((i) => (
                  <option key={i.name} value={i.name}>{toTitleCase(i.name)} ({i.count.toLocaleString()})</option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Verified Only
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Top Rated</option>
                <option value="reviewCount">Most Reviewed</option>
                <option value="yearEstablished">Established</option>
                <option value="companyName">Name A-Z</option>
              </select>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Clear All
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
          <p className="text-sm text-gray-700">
            {data ? `${data.pagination.total.toLocaleString()} suppliers found` : "Loading..."}
            {debouncedQuery && ` for "${debouncedQuery}"`}
          </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.suppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onClick={() => setSelectedSlug(supplier.slug)}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
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
            <h3 className="text-lg font-medium text-gray-700 mb-1">Failed to load suppliers</h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : "Check that the server is running on the same port (e.g. http://localhost:3000)"}
            </p>
            <p className="text-sm text-gray-500 mb-4">Visit http://localhost:3000/suppliers if using port 3000</p>
            <button onClick={() => window.location.reload()} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Retry
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No suppliers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSlug && (
        <SupplierDetail
          slug={selectedSlug}
          onClose={() => setSelectedSlug(null)}
          openContactForm={new URLSearchParams(window.location.search).get("contact") === "1"}
        />
      )}

      {/* Disclaimer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
            All suppliers are real companies from government registries (Companies House UK, SEC EDGAR, OpenCorporates). We do not use Alibaba scraping or fake data. &quot;Registry Verified&quot; = official source. &quot;Contact via registry&quot; = use the registry link to find verified contact details.
          </p>
        </div>
      </footer>
    </div>
  );
}
