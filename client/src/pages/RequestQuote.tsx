import { useEffect, useState } from "react";
import { FileText, CheckCircle, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";

const PRODUCT_CATEGORIES = [
  "Strategic Metals (Antimony, Tungsten, Cobalt, etc.)",
  "Base Metals (Copper, Aluminium, Zinc, Nickel, Lead)",
  "Steel & Alloys",
  "Rare Earths & Critical Minerals",
  "Chemicals & Polymers",
  "Industrial Machinery",
  "Electronics & Components",
  "Textiles & Apparel",
  "Food & Agriculture",
  "Other",
];

const UNITS = ["kg", "tons (MT)", "lbs", "pcs", "sets", "boxes", "containers (20ft)", "containers (40ft)", "litres", "m³", "meters"];

const CURRENCIES = ["USD", "EUR", "GBP", "CHF", "CNY", "JPY"];

const INCOTERMS = ["EXW", "FCA", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DDP"];

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
        specifications: prev.specifications || `Preferred supplier to invite: ${supplier}`,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="lg" variant="light" className="w-10 h-10" />
          <span className="text-white/70 text-sm font-medium">{t("rfq.header.badge")}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{t("rfq.header.title")}</h1>
        <p className="text-blue-100 mb-2">{t("rfq.header.subtitle")}</p>
        <p className="text-blue-200/80 text-xs flex flex-wrap gap-x-3 gap-y-1 items-center">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {t("rfq.header.pointOperator")}</span>
          <span>·</span>
          <span>{t("rfq.header.pointNoAccount")}</span>
          <span>·</span>
          <span>{t("rfq.header.pointTurnaround")}</span>
          <span>·</span>
          <Link href="/methodology" className="underline underline-offset-2 hover:text-white">{t("rfq.header.linkMethodology")}</Link>
        </p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">RFQ received</h2>
            <p className="text-gray-700 mb-4">
              A SmartSeek sourcing operator will route your request to relevant verified suppliers. Quotes are returned to <strong>{form.buyerEmail}</strong> typically within 1–3 business days.
            </p>
            {submittedRfqId && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-5 text-left text-sm">
                <p className="text-slate-500 text-xs mb-1">Your RFQ ID</p>
                <p className="font-mono text-slate-900 break-all">{submittedRfqId}</p>
                <Link
                  href={`/rfq-status?id=${encodeURIComponent(submittedRfqId)}&email=${encodeURIComponent(form.buyerEmail)}`}
                  className="inline-block mt-2 text-blue-700 underline underline-offset-2 text-xs"
                >
                  Track this RFQ →
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
              Submit another request
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">How it works</p>
              <p>Submit your product requirements below. Our team will share your RFQ with relevant verified suppliers. You&apos;ll receive competitive quotes via email within 1–3 business days—no account required. Your data is never shared with third parties.</p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="buyerName"
                    value={form.buyerName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="buyerEmail"
                    value={form.buyerEmail}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="buyerPhone"
                    value={form.buyerPhone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    name="buyerCompany"
                    value={form.buyerCompany}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="buyerCountry"
                    value={form.buyerCountry}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. United States"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={form.productName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. LED strip lights"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                  <select
                    name="productCategory"
                    value={form.productCategory}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HS Code</label>
                  <input
                    type="text"
                    name="hsCode"
                    value={form.hsCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional, e.g. 8110.10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin preference</label>
                  <input
                    type="text"
                    name="originPreference"
                    value={form.originPreference}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. EU, ex-China, Turkey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Quantity Range (optional)</label>
                  <input
                    type="text"
                    name="targetQuantityRange"
                    value={form.targetQuantityRange}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 20–50 MT per month"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Price</label>
                  <input
                    type="number"
                    name="targetPrice"
                    value={form.targetPrice}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                  <textarea
                    name="specifications"
                    value={form.specifications}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe your product requirements, dimensions, materials, certifications, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Requirements (optional)</label>
                  <input
                    type="text"
                    name="certificationRequirements"
                    value={form.certificationRequirements}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. ISO 9001, REACH, RoHS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms (optional)</label>
                  <input
                    type="text"
                    name="paymentTerms"
                    value={form.paymentTerms}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 30% TT advance, 70% against B/L"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Logistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incoterm</label>
                  <select
                    name="incoterm"
                    value={form.incoterm}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select incoterm</option>
                    {INCOTERMS.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country (optional)</label>
                  <input
                    type="text"
                    name="destinationCountry"
                    value={form.destinationCountry}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Thailand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Port</label>
                  <input
                    type="text"
                    name="destinationPort"
                    value={form.destinationPort}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Los Angeles"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired Delivery Date</label>
                  <input
                    type="text"
                    name="deliveryDate"
                    value={form.deliveryDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Q2 2025 or specific date"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
                  <input
                    type="file"
                    onChange={handleAttachmentChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Attachment UI is captured for operator context. For sensitive files, our team will provide a secure upload channel by email.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 text-base font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <FileText className="w-4 h-4" /> Submit Request for Quotation
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-500">
                By submitting, you agree to our{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline underline-offset-2">
                  Terms of Service
                </Link>
                . RFQs are reviewed by a sourcing operator before routing.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
