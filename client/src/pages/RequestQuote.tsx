import { useEffect, useState } from "react";
import { FileText, CheckCircle, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";
import { FileInput } from "@/components/ui/file-input";

// Category list reflects current sourcing reach: industrial components,
// chemicals, packaging, and machinery sit alongside metals — metals stays
// available as a credibility wedge, not as the default identity.
const CATEGORY_KEYS = [
  "industrialComponents",
  "chemicals",
  "packaging",
  "machinery",
  "electronics",
  "metals",
  "strategicMaterials",
  "construction",
  "textiles",
  "food",
  "other",
] as const;

const CATEGORY_VALUES: Record<(typeof CATEGORY_KEYS)[number], string> = {
  industrialComponents: "Industrial Components & Bearings",
  chemicals: "Chemicals & Polymers",
  packaging: "Packaging & Converting",
  machinery: "Machinery & Industrial Equipment",
  electronics: "Electronics & Components",
  metals: "Metals & Steel",
  strategicMaterials: "Strategic & Critical Materials (Antimony, Tungsten, Rare Earths)",
  construction: "Construction Materials",
  textiles: "Textiles & Apparel",
  food: "Food & Agriculture",
  other: "Other",
};

const UNITS: { key: string; value: string }[] = [
  { key: "kg", value: "kg" },
  { key: "tonsMt", value: "tons (MT)" },
  { key: "lbs", value: "lbs" },
  { key: "pcs", value: "pcs" },
  { key: "sets", value: "sets" },
  { key: "boxes", value: "boxes" },
  { key: "container20ft", value: "containers (20ft)" },
  { key: "container40ft", value: "containers (40ft)" },
  { key: "litres", value: "litres" },
  { key: "cubicM", value: "m³" },
  { key: "meters", value: "meters" },
];

const INCOTERMS = ["EXW", "FCA", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DDP"] as const;

const CURRENCIES = ["USD", "EUR", "GBP", "CHF", "CNY", "JPY"];

const INPUT_CLS =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default function RequestQuote() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submittedRfqId, setSubmittedRfqId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerCompany: "",
    buyerCountry: "",
    productName: "",
    productCategory: "",
    hsCode: "",
    originPreference: "",
    quantity: "",
    targetQuantityRange: "",
    unit: "kg",
    targetPrice: "",
    currency: "USD",
    specifications: "",
    certificationRequirements: "",
    paymentTerms: "",
    incoterm: "",
    destinationCountry: "",
    destinationPort: "",
    deliveryDate: "",
    attachmentName: "",
  });

  // Prefill productName from ?product= query param (set by /search empty state)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("product");
    const supplier = params.get("supplier");
    if (p) {
      setForm((prev) => ({ ...prev, productName: p }));
    }
    if (supplier) {
      setForm((prev) => ({
        ...prev,
        specifications: prev.specifications || t("rfq.form.prefillSupplierNote", { supplier }),
      }));
    }
  }, [t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttachmentChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, attachmentName: file?.name || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!form.buyerName.trim() || !form.buyerEmail.trim() || !form.productName.trim() || !form.quantity.trim()) {
      setError(t("rfq.errors.required"));
      setIsSubmitting(false);
      return;
    }

    const quantity = parseInt(form.quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
      setError(t("rfq.errors.quantityPositive"));
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: form.buyerName.trim(),
          buyerEmail: form.buyerEmail.trim(),
          buyerPhone: form.buyerPhone.trim() || undefined,
          buyerCompany: form.buyerCompany.trim() || undefined,
          buyerCountry: form.buyerCountry.trim() || undefined,
          productName: form.productName.trim(),
          productCategory: form.productCategory || undefined,
          hsCode: form.hsCode.trim() || undefined,
          originPreference: form.originPreference.trim() || undefined,
          quantity,
          unit: form.unit,
          targetPrice: form.targetPrice ? parseFloat(form.targetPrice) : undefined,
          currency: form.currency,
          specifications: form.specifications.trim() || undefined,
          paymentTerms: form.paymentTerms.trim() || undefined,
          incoterm: form.incoterm || undefined,
          destinationCountry: form.destinationCountry.trim() || undefined,
          destinationPort: form.destinationPort.trim() || undefined,
          deliveryDate: form.deliveryDate || undefined,
          deliveryDeadline: form.deliveryDate || undefined,
          notes: [
            form.targetQuantityRange ? `Target quantity range: ${form.targetQuantityRange}` : "",
            form.certificationRequirements ? `Certification requirements: ${form.certificationRequirements}` : "",
            form.attachmentName ? `Attachment provided by buyer (filename): ${form.attachmentName}` : "",
          ]
            .filter(Boolean)
            .join(" | ") || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || t("rfq.errors.submitFailed"));
      }

      if (data && typeof data.id === "string") setSubmittedRfqId(data.id);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("rfq.errors.submitFailedTryAgain"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerBlock = (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-12">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="lg" variant="light" className="w-10 h-10 shrink-0" />
          <span className="text-white/80 text-sm font-medium">{t("rfq.header.badge")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("rfq.header.title")}</h1>
        <p className="text-blue-100 mb-2 text-sm sm:text-base">{t("rfq.header.subtitle")}</p>
        <div className="text-blue-200/90 text-xs sm:text-sm flex flex-col sm:flex-row sm:flex-wrap gap-y-1.5 sm:gap-x-3 sm:gap-y-1 sm:items-center">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 shrink-0" /> {t("rfq.header.pointOperator")}</span>
          <span className="hidden sm:inline">·</span>
          <span>{t("rfq.header.pointNoAccount")}</span>
          <span className="hidden sm:inline">·</span>
          <span>{t("rfq.header.pointTurnaround")}</span>
          <span className="hidden sm:inline">·</span>
          <Link href="/methodology" className="underline underline-offset-2 hover:text-white">{t("rfq.header.linkMethodology")}</Link>
        </div>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {headerBlock}
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("rfq.success.title")}</h2>
            <p className="text-gray-700 mb-4">
              {t("rfq.success.body", { email: form.buyerEmail })}
            </p>
            {submittedRfqId && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-5 text-left text-sm">
                <p className="text-slate-500 text-xs mb-1">{t("rfq.success.rfqIdLabel")}</p>
                <p className="font-mono text-slate-900 break-all">{submittedRfqId}</p>
                <Link
                  href={`/rfq-status?id=${encodeURIComponent(submittedRfqId)}&email=${encodeURIComponent(form.buyerEmail)}`}
                  className="inline-block mt-2 text-blue-700 underline underline-offset-2 text-xs"
                >
                  {t("rfq.success.trackLink")}
                </Link>
              </div>
            )}
            <button
              onClick={() => {
                setSubmitted(false);
                setSubmittedRfqId(null);
                setForm({
                  buyerName: "",
                  buyerEmail: "",
                  buyerPhone: "",
                  buyerCompany: "",
                  buyerCountry: "",
                  productName: "",
                  productCategory: "",
                  hsCode: "",
                  originPreference: "",
                  quantity: "",
                  targetQuantityRange: "",
                  unit: "kg",
                  targetPrice: "",
                  currency: "USD",
                  specifications: "",
                  certificationRequirements: "",
                  paymentTerms: "",
                  incoterm: "",
                  destinationCountry: "",
                  destinationPort: "",
                  deliveryDate: "",
                  attachmentName: "",
                });
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("rfq.success.submitAnother")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {headerBlock}

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">{t("rfq.form.howItWorksTitle")}</p>
              <p>{t("rfq.form.howItWorksBody")}</p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("rfq.form.sectionYourDetails")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.name")}</label>
                  <input type="text" name="buyerName" value={form.buyerName} onChange={handleChange} required className={INPUT_CLS} placeholder={t("rfq.form.placeholders.name")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.email")}</label>
                  <input type="email" name="buyerEmail" value={form.buyerEmail} onChange={handleChange} required className={INPUT_CLS} placeholder={t("rfq.form.placeholders.email")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.phone")}</label>
                  <input type="tel" name="buyerPhone" value={form.buyerPhone} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.phone")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.company")}</label>
                  <input type="text" name="buyerCompany" value={form.buyerCompany} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.company")} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.country")}</label>
                  <input type="text" name="buyerCountry" value={form.buyerCountry} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.country")} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("rfq.form.sectionProduct")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.productName")}</label>
                  <input type="text" name="productName" value={form.productName} onChange={handleChange} required className={INPUT_CLS} placeholder={t("rfq.form.placeholders.productName")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.productCategory")}</label>
                  <select name="productCategory" value={form.productCategory} onChange={handleChange} className={INPUT_CLS}>
                    <option value="">{t("rfq.form.placeholders.selectCategory")}</option>
                    {CATEGORY_KEYS.map((key) => (
                      <option key={key} value={CATEGORY_VALUES[key]}>{t(`rfq.form.categories.${key}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.hsCode")}</label>
                  <input type="text" name="hsCode" value={form.hsCode} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.hsCode")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.originPreference")}</label>
                  <input type="text" name="originPreference" value={form.originPreference} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.originPreference")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.quantity")}</label>
                  <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min={1} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.quantity")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.targetQuantityRange")}</label>
                  <input type="text" name="targetQuantityRange" value={form.targetQuantityRange} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.targetQuantityRange")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.unit")}</label>
                  <select name="unit" value={form.unit} onChange={handleChange} className={INPUT_CLS}>
                    {UNITS.map(({ key, value }) => (
                      <option key={key} value={value}>{t(`rfq.form.units.${key}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.targetPrice")}</label>
                  <input type="number" name="targetPrice" value={form.targetPrice} onChange={handleChange} min={0} step="0.01" className={INPUT_CLS} placeholder={t("rfq.form.placeholders.targetPrice")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.currency")}</label>
                  <select name="currency" value={form.currency} onChange={handleChange} className={INPUT_CLS}>
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.specifications")}</label>
                  <textarea name="specifications" value={form.specifications} onChange={handleChange} rows={4} className={`${INPUT_CLS} resize-none`} placeholder={t("rfq.form.placeholders.specifications")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.certificationRequirements")}</label>
                  <input type="text" name="certificationRequirements" value={form.certificationRequirements} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.certificationRequirements")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.paymentTerms")}</label>
                  <input type="text" name="paymentTerms" value={form.paymentTerms} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.paymentTerms")} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("rfq.form.sectionLogistics")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.incoterm")}</label>
                  <select name="incoterm" value={form.incoterm} onChange={handleChange} className={INPUT_CLS}>
                    <option value="">{t("rfq.form.placeholders.selectIncoterm")}</option>
                    {INCOTERMS.map((term) => (
                      <option key={term} value={term}>{t(`rfq.form.incoterms.${term}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.destinationCountry")}</label>
                  <input type="text" name="destinationCountry" value={form.destinationCountry} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.destinationCountry")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.destinationPort")}</label>
                  <input type="text" name="destinationPort" value={form.destinationPort} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.destinationPort")} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.deliveryDate")}</label>
                  <input type="text" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} className={INPUT_CLS} placeholder={t("rfq.form.placeholders.deliveryDate")} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("rfq.form.labels.attachment")}</label>
                  <FileInput onChange={handleAttachmentChange} />
                  <p className="text-xs text-slate-500 mt-1">{t("rfq.form.attachmentNote")}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white min-h-12 py-3 text-base font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>{t("rfq.form.submitting")}</>
                ) : (
                  <>
                    <FileText className="w-4 h-4" /> {t("rfq.form.submit")}
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-slate-600 leading-relaxed px-1">
                {t("rfq.form.legalPrefix")}{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  {t("rfq.form.privacyPolicy")}
                </Link>{" "}
                {t("rfq.form.and")}{" "}
                <Link href="/terms" className="underline underline-offset-2">
                  {t("rfq.form.termsOfService")}
                </Link>
                . {t("rfq.form.legalSuffix")}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
