import { useState } from "react";
import { Link } from "wouter";
import { Building2, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "react-i18next";

const INDUSTRY_OPTIONS: { value: string; key: string }[] = [
  { value: "Mining & Strategic Metals", key: "mining" },
  { value: "Steel & Alloys", key: "steel" },
  { value: "Non-ferrous Metals", key: "nonFerrous" },
  { value: "Rare Earths & Critical Minerals", key: "rareEarths" },
  { value: "Chemicals & Polymers", key: "chemicals" },
  { value: "Industrial Machinery", key: "machinery" },
  { value: "Electronics & Components", key: "electronics" },
  { value: "Textiles & Apparel", key: "textiles" },
  { value: "Food & Agriculture", key: "food" },
  { value: "Other", key: "other" },
];

const EMPLOYEE_BAND_OPTIONS: { value: string; key: string }[] = [
  { value: "1-10", key: "b1_10" },
  { value: "10-50", key: "b10_50" },
  { value: "50-200", key: "b50_200" },
  { value: "200-500", key: "b200_500" },
  { value: "500-1000", key: "b500_1000" },
  { value: "1000-5000", key: "b1000_5000" },
  { value: "5000+", key: "b5000plus" },
];

const REGISTRY_OPTIONS: { value: string; key: string }[] = [
  { value: "SAIC (China)", key: "saic" },
  { value: "Companies House (UK)", key: "companiesHouse" },
  { value: "SEC EDGAR (USA)", key: "secEdgar" },
  { value: "Handelsregister (Germany)", key: "handelsregister" },
  { value: "MERSIS (Turkey)", key: "mersis" },
  { value: "ASIC (Australia)", key: "asic" },
  { value: "KRS (Poland)", key: "krs" },
  { value: "DART (Korea)", key: "dart" },
  { value: "SEDAR (Canada)", key: "sedar" },
  { value: "Other / National Registry", key: "other" },
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
  const { t } = useTranslation();
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
      setError(t("becomeSupplier.errors.required"));
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
      if (!res.ok) throw new Error(data.error || t("becomeSupplier.errors.submitFailed"));
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("becomeSupplier.errors.submitFailed"));
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t("becomeSupplier.success.title")}</h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
              {t("becomeSupplier.success.body1")} <strong className="text-slate-200">{form.contactEmail}</strong>.
            </p>
            <p className="text-slate-500 text-xs mb-8">{t("becomeSupplier.success.body2")}</p>
            <Link href="/">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">
                {t("becomeSupplier.success.backHome")} <ArrowRight className="w-4 h-4" />
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
            <Building2 className="w-3.5 h-3.5" /> {t("becomeSupplier.header.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{t("becomeSupplier.header.title")}</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t("becomeSupplier.header.subtitle")}
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-12 px-4 border-b border-slate-100">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-blue-600" />, title: t("becomeSupplier.cards.verifyTitle"), body: t("becomeSupplier.cards.verifyBody") },
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, title: t("becomeSupplier.cards.nopayTitle"), body: t("becomeSupplier.cards.nopayBody") },
            { icon: <ArrowRight className="w-5 h-5 text-amber-600" />, title: t("becomeSupplier.cards.rfqTitle"), body: t("becomeSupplier.cards.rfqBody") },
          ].map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">{c.icon}<span className="font-semibold text-slate-900">{c.title}</span></div>
              <p className="text-slate-600 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: c.body }} />
            </div>
          ))}
        </div>
        <div className="max-w-4xl mx-auto mt-5 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-800 mb-2 uppercase tracking-wider">{t("becomeSupplier.expect.title")}</p>
          <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <p className="font-semibold text-slate-900">{t("becomeSupplier.expect.step1Title")}</p>
              <p>{t("becomeSupplier.expect.step1Desc")}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <p className="font-semibold text-slate-900">{t("becomeSupplier.expect.step2Title")}</p>
              <p>{t("becomeSupplier.expect.step2Desc")}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <p className="font-semibold text-slate-900">{t("becomeSupplier.expect.step3Title")}</p>
              <p>{t("becomeSupplier.expect.step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{t("becomeSupplier.sections.company")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t("becomeSupplier.fields.companyName.label")} name="companyName" value={form.companyName} onChange={onChange} placeholder={t("becomeSupplier.fields.companyName.placeholder")} required />
                <Field label={t("becomeSupplier.fields.website.label")} name="website" value={form.website} onChange={onChange} placeholder={t("becomeSupplier.fields.website.placeholder")} />
                <Field label={t("becomeSupplier.fields.country.label")} name="country" value={form.country} onChange={onChange} placeholder={t("becomeSupplier.fields.country.placeholder")} required />
                <Field label={t("becomeSupplier.fields.city.label")} name="city" value={form.city} onChange={onChange} placeholder={t("becomeSupplier.fields.city.placeholder")} />
                <Field label={t("becomeSupplier.fields.yearEstablished.label")} name="yearEstablished" value={form.yearEstablished} onChange={onChange} placeholder={t("becomeSupplier.fields.yearEstablished.placeholder")} type="number" />
                <SelectField label={t("becomeSupplier.fields.employees.label")} name="employeeBand" value={form.employeeBand} onChange={onChange} options={EMPLOYEE_BAND_OPTIONS} optionPrefix="becomeSupplier.employees" placeholder={t("becomeSupplier.fields.employees.placeholder")} />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1 pb-2 border-b border-slate-100">{t("becomeSupplier.sections.registry")}</h2>
              <p className="text-xs text-slate-500 mb-4">{t("becomeSupplier.sections.registryDesc")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label={t("becomeSupplier.fields.registryAuthority.label")} name="registryAuthority" value={form.registryAuthority} onChange={onChange} options={REGISTRY_OPTIONS} optionPrefix="becomeSupplier.registry" placeholder={t("becomeSupplier.fields.registryAuthority.placeholder")} />
                <Field label={t("becomeSupplier.fields.registryNumber.label")} name="registryNumber" value={form.registryNumber} onChange={onChange} placeholder={t("becomeSupplier.fields.registryNumber.placeholder")} />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{t("becomeSupplier.sections.offering")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label={t("becomeSupplier.fields.industry.label")} name="industry" value={form.industry} onChange={onChange} options={INDUSTRY_OPTIONS} optionPrefix="becomeSupplier.industries" placeholder={t("becomeSupplier.fields.industry.placeholder")} required />
                <Field label={t("becomeSupplier.fields.subIndustry.label")} name="subIndustry" value={form.subIndustry} onChange={onChange} placeholder={t("becomeSupplier.fields.subIndustry.placeholder")} />
              </div>
              <div className="mt-4">
                <Label>{t("becomeSupplier.fields.products.label")}</Label>
                <textarea
                  name="products" value={form.products} onChange={onChange} required rows={3}
                  placeholder={t("becomeSupplier.fields.products.placeholder")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t("becomeSupplier.fields.certifications.label")} name="certifications" value={form.certifications} onChange={onChange} placeholder={t("becomeSupplier.fields.certifications.placeholder")} />
                <Field label={t("becomeSupplier.fields.exportMarkets.label")} name="exportMarkets" value={form.exportMarkets} onChange={onChange} placeholder={t("becomeSupplier.fields.exportMarkets.placeholder")} />
                <Field label={t("becomeSupplier.fields.leadTime.label")} name="leadTimeDays" value={form.leadTimeDays} onChange={onChange} type="number" placeholder={t("becomeSupplier.fields.leadTime.placeholder")} />
                <Field label={t("becomeSupplier.fields.paymentTerms.label")} name="paymentTerms" value={form.paymentTerms} onChange={onChange} placeholder={t("becomeSupplier.fields.paymentTerms.placeholder")} />
                <Field label={t("becomeSupplier.fields.incoterms.label")} name="incoterms" value={form.incoterms} onChange={onChange} placeholder={t("becomeSupplier.fields.incoterms.placeholder")} />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{t("becomeSupplier.sections.contact")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t("becomeSupplier.fields.contactName.label")} name="contactName" value={form.contactName} onChange={onChange} required />
                <Field label={t("becomeSupplier.fields.contactRole.label")} name="contactRole" value={form.contactRole} onChange={onChange} placeholder={t("becomeSupplier.fields.contactRole.placeholder")} />
                <Field label={t("becomeSupplier.fields.contactEmail.label")} name="contactEmail" value={form.contactEmail} onChange={onChange} type="email" required />
                <Field label={t("becomeSupplier.fields.contactPhone.label")} name="contactPhone" value={form.contactPhone} onChange={onChange} placeholder={t("becomeSupplier.fields.contactPhone.placeholder")} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm sm:text-base inline-flex items-center justify-center gap-2 transition"
              >
                {submitting ? t("becomeSupplier.actions.submitting") : (<>{t("becomeSupplier.actions.submitButton")} <ArrowRight className="w-4 h-4" /></>)}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-3">
                {t("becomeSupplier.actions.footnote")}
              </p>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                {t("becomeSupplier.footer.noCharge")}
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
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, optionPrefix, placeholder, required = false }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[] | { value: string; key: string }[];
  optionPrefix?: string;
  placeholder?: string; required?: boolean;
}) {
  const { t } = useTranslation();
  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, key: o } : o
  );
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
        <option value="">{placeholder || t("becomeSupplier.fields.select")}</option>
        {normalized.map(({ value: optValue, key }) => (
          <option key={optValue} value={optValue}>
            {optionPrefix ? t(`${optionPrefix}.${key}`) : optValue}
          </option>
        ))}
      </select>
    </div>
  );
}
