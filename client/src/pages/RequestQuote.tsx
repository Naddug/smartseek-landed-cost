import { useState } from "react";
import { FileText, CheckCircle } from "lucide-react";

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Textiles",
  "Machinery",
  "Chemicals",
  "Food & Agriculture",
];

const UNITS = ["pcs", "kg", "tons", "meters", "sets", "boxes"];

const CURRENCIES = ["USD", "EUR", "GBP"];

const INCOTERMS = ["FOB", "CIF", "EXW", "DDP"];

export default function RequestQuote() {
  const [submitted, setSubmitted] = useState(false);
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
    quantity: "",
    unit: "pcs",
    targetPrice: "",
    currency: "USD",
    specifications: "",
    incoterm: "",
    destinationPort: "",
    deliveryDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!form.buyerName.trim() || !form.buyerEmail.trim() || !form.productName.trim() || !form.quantity.trim()) {
      setError("Please fill in required fields: Name, Email, Product Name, and Quantity.");
      setIsSubmitting(false);
      return;
    }

    const quantity = parseInt(form.quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be a positive number.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/rfqs", {
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
          quantity,
          unit: form.unit,
          targetPrice: form.targetPrice ? parseFloat(form.targetPrice) : undefined,
          currency: form.currency,
          specifications: form.specifications.trim() || undefined,
          incoterm: form.incoterm || undefined,
          destinationPort: form.destinationPort.trim() || undefined,
          deliveryDate: form.deliveryDate || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit RFQ");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerBlock = (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="text-white/80 text-sm font-medium">SmartSeek Request for Quotation</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Request for Quotation</h1>
        <p className="text-blue-100 mb-2">Submit your sourcing inquiry to receive quotes from verified suppliers</p>
        <p className="text-blue-200/90 text-sm">No account required • Quotes within 1–3 business days • 100,000+ verified suppliers</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted Successfully</h2>
            <p className="text-gray-700 mb-6">
              Thank you for your inquiry. Our team will share your RFQ with relevant suppliers, and you can expect to receive quotes within 1–3 business days at <strong>{form.buyerEmail}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  buyerName: "",
                  buyerEmail: "",
                  buyerPhone: "",
                  buyerCompany: "",
                  buyerCountry: "",
                  productName: "",
                  productCategory: "",
                  quantity: "",
                  unit: "pcs",
                  targetPrice: "",
                  currency: "USD",
                  specifications: "",
                  incoterm: "",
                  destinationPort: "",
                  deliveryDate: "",
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
