import { useState } from "react";
import { Link } from "wouter";
import { Building2, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

const INDUSTRIES = [
  "Mining & Strategic Metals",
  "Steel & Alloys",
  "Non-ferrous Metals",
  "Rare Earths & Critical Minerals",
  "Chemicals & Polymers",
  "Industrial Machinery",
  "Electronics & Components",
  "Textiles & Apparel",
  "Food & Agriculture",
  "Other",
];

const EMPLOYEE_BANDS = ["1-10", "10-50", "50-200", "200-500", "500-1000", "1000-5000", "5000+"];

const REGISTRY_HINTS = [
  "SAIC (China)",
  "Companies House (UK)",
  "SEC EDGAR (USA)",
  "Handelsregister (Germany)",
  "MERSIS (Turkey)",
  "ASIC (Australia)",
  "KRS (Poland)",
  "DART (Korea)",
  "SEDAR (Canada)",
  "Other / National Registry",
];

type Form = {
  companyName: string;
  website: string;
  country: string;
  city: string;
  registryNumber: string;
  registryAuthority: string;
  yearEstablished: string;
  employeeBand: string;
  industry: string;
  subIndustry: string;
  products: string;
  certifications: string;
  exportMarkets: string;
  leadTimeDays: string;
  paymentTerms: string;
  incoterms: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
};

const INITIAL: Form = {
  companyName: "",
  website: "",
  country: "",
  city: "",
  registryNumber: "",
  registryAuthority: "",
  yearEstablished: "",
  employeeBand: "",
  industry: "",
  subIndustry: "",
  products: "",
  certifications: "",
  exportMarkets: "",
  leadTimeDays: "",
  paymentTerms: "",
  incoterms: "",
  contactName: "",
  contactRole: "",
  contactEmail: "",
  contactPhone: "",
};

export default function BecomeASupplier() {
  const [form, setForm] = useState<Form>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.companyName.trim() || !form.country.trim() || !form.industry.trim() || !form.products.trim() || !form.contactName.trim() || !form.contactEmail.trim()) {
      setError("Please fill required fields: company, country, industry, products, contact name, contact email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/supplier-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearEstablished: form.yearEstablished || undefined,
          leadTimeDays: form.leadTimeDays || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PublicLayout>
        <section className="bg-slate-950 py-20 px-4 min-h-[60vh] flex items-center">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Application received</h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
              Thank you. A SmartSeek sourcing operator will review your application and verify your registry details. We typically respond within 1–3 business days at <strong className="text-slate-200">{form.contactEmail}</strong>.
            </p>
            <p className="text-slate-500 text-xs mb-8">If we need additional documents (registry extract, ISO certificates, recent invoices) we&apos;ll request them by email.</p>
            <Link href="/">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">
                Back to homepage <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-5">
            <Building2 className="w-3.5 h-3.5" /> Supplier application
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">List your company on SmartSeek</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We accept applications from manufacturers, traders, and distributors operating across strategic metals and industrial supply chains. Listings are free during beta. Each application is reviewed manually and verified against company registry records.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-12 px-4 border-b border-slate-100">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-blue-600" />, title: "Registry-verified only", body: "We confirm legal entity status against an official company registry before listing." },
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, title: "No pay-to-list", body: "We don&apos;t sell placement. Listing is based on verification, not budget." },
            { icon: <ArrowRight className="w-5 h-5 text-amber-600" />, title: "Real RFQs", body: "Buyer requests are screened by an operator and routed only to relevant suppliers." },
          ].map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">{c.icon}<span className="font-semibold text-slate-900">{c.title}</span></div>
              <p className="text-slate-600 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: c.body }} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Company</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company name *" name="companyName" value={form.companyName} onChange={onChange} placeholder="Legal entity name" required />
                <Field label="Website" name="website" value={form.website} onChange={onChange} placeholder="https://example.com" />
                <Field label="Country *" name="country" value={form.country} onChange={onChange} placeholder="e.g. Germany" required />
                <Field label="City" name="city" value={form.city} onChange={onChange} placeholder="e.g. Munich" />
                <Field label="Year established" name="yearEstablished" value={form.yearEstablished} onChange={onChange} placeholder="e.g. 1998" type="number" />
                <SelectField label="Employees" name="employeeBand" value={form.employeeBand} onChange={onChange} options={EMPLOYEE_BANDS} placeholder="Select band" />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1 pb-2 border-b border-slate-100">Registry verification</h2>
              <p className="text-xs text-slate-500 mb-4">We verify against an official registry. Provide your number — we&apos;ll cross-check.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Registry authority" name="registryAuthority" value={form.registryAuthority} onChange={onChange} options={REGISTRY_HINTS} placeholder="Select registry" />
                <Field label="Registry / company number" name="registryNumber" value={form.registryNumber} onChange={onChange} placeholder="e.g. HRB 12345" />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Offering</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Industry *" name="industry" value={form.industry} onChange={onChange} options={INDUSTRIES} placeholder="Select industry" required />
                <Field label="Sub-industry / specialty" name="subIndustry" value={form.subIndustry} onChange={onChange} placeholder="e.g. Antimony refining" />
              </div>
              <div className="mt-4">
                <Label>Products you supply *</Label>
                <textarea
                  name="products" value={form.products} onChange={onChange} required rows={3}
                  placeholder="Comma-separated list. e.g. Antimony ingot 99.65%, Antimony trioxide, Lead-antimony alloy"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Certifications" name="certifications" value={form.certifications} onChange={onChange} placeholder="ISO 9001, ISO 14001, REACH..." />
                <Field label="Export markets" name="exportMarkets" value={form.exportMarkets} onChange={onChange} placeholder="EU, US, JP, KR..." />
                <Field label="Lead time (days)" name="leadTimeDays" value={form.leadTimeDays} onChange={onChange} type="number" placeholder="e.g. 30" />
                <Field label="Payment terms" name="paymentTerms" value={form.paymentTerms} onChange={onChange} placeholder="e.g. 30% TT, 70% before shipment" />
                <Field label="Incoterms supported" name="incoterms" value={form.incoterms} onChange={onChange} placeholder="FOB, CIF, EXW, DDP" />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Primary contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name *" name="contactName" value={form.contactName} onChange={onChange} required />
                <Field label="Role" name="contactRole" value={form.contactRole} onChange={onChange} placeholder="e.g. Sales Director" />
                <Field label="Work email *" name="contactEmail" value={form.contactEmail} onChange={onChange} type="email" required />
                <Field label="Phone" name="contactPhone" value={form.contactPhone} onChange={onChange} placeholder="+49 89 ..." />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm sm:text-base inline-flex items-center justify-center gap-2 transition"
              >
                {submitting ? "Submitting..." : (<>Submit application <ArrowRight className="w-4 h-4" /></>)}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-3">
                By submitting, you confirm the information is accurate. We may contact you for registry documents or certificates before publishing your listing.
              </p>
            </div>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-700 mb-1">{children}</label>;
}

function Field({ label, name, value, onChange, placeholder, type = "text", required = false }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, placeholder, required = false }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[]; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder || "Select"}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
