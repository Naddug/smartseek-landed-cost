import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type FormState = {
  fullName: string;
  email: string;
  company: string;
  role: string;
  useCase: string;
};

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  company: "",
  role: "",
  useCase: "",
};

export default function Pricing() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Beta Access | SmartSeek";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.fullName.trim() || !form.email.trim()) {
      setError(t("pricing.errors.required"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          company: form.company.trim() || undefined,
          tier_interest: "founding_user",
          source_page: "pricing_beta",
          notes: [form.role.trim() && `Role: ${form.role.trim()}`, form.useCase.trim() && `Use case: ${form.useCase.trim()}`]
            .filter(Boolean)
            .join(" · ") || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t("pricing.errors.submit"));
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("pricing.errors.submit"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            {t("pricing.banner")}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t("pricing.title")}
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-2 leading-relaxed">
            {t("pricing.subtitle")}
          </p>
          <p className="text-slate-500 text-sm">{t("pricing.noCard")}</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            {/* Founding User card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">{t("pricing.foundingUser")}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">{t("pricing.betaOnly")}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{t("pricing.cardTitle")}</h2>
              <p className="text-slate-600 text-sm mb-6">{t("pricing.cardDesc")}</p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                {[
                  t("pricing.feature1"),
                  t("pricing.feature2"),
                  t("pricing.feature3"),
                  t("pricing.feature4"),
                  t("pricing.feature5"),
                  t("pricing.feature6"),
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600">
                {t("pricing.reviewNote")}
              </div>
            </div>

            {/* Application form */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-8 text-white">
              <h2 className="text-xl font-bold mb-2">{t("pricing.requestTitle")}</h2>
              <p className="text-slate-400 text-sm mb-6">{t("pricing.requestDesc")}</p>
              {submitted ? (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-6 text-sm text-emerald-100">
                  <div className="flex items-center gap-2 font-semibold mb-1"><CheckCircle2 className="w-4 h-4" /> {t("pricing.successTitle")}</div>
                  <p className="text-emerald-200/80">{t("pricing.successDesc")}</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-3">
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder={t("pricing.fullName")}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("pricing.workEmail")}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder={t("pricing.company")}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t("pricing.roleOptional")}</option>
                    <option value="procurement">{t("pricing.roleProcurement")}</option>
                    <option value="supply_chain">Supply Chain</option>
                    <option value="founder_ops">Founder / Ops</option>
                    <option value="trader">Trader / Distributor</option>
                    <option value="other">{t("common.other")}</option>
                  </select>
                  <textarea
                    name="useCase"
                    value={form.useCase}
                    onChange={handleChange}
                    placeholder={t("pricing.useCase")}
                    rows={3}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <Button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold">
                    {submitting ? t("pricing.submitting") : (<>{t("pricing.requestAccess")} <ArrowRight className="w-4 h-4 ml-1" /></>)}
                  </Button>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-center pt-1">
                    {t("pricing.footnote")}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-t border-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-900">{t("pricing.trust1")}</div>
            <div className="text-xs text-slate-500 mt-1"><Link href="/verification" className="underline underline-offset-2">{t("publicFooter.verificationStandards")}</Link></div>
          </div>
          <div>
            <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-900">{t("pricing.trust2")}</div>
            <div className="text-xs text-slate-500 mt-1"><Link href="/methodology" className="underline underline-offset-2">{t("publicFooter.methodology")}</Link></div>
          </div>
          <div>
            <CheckCircle2 className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-900">{t("pricing.trust3")}</div>
            <div className="text-xs text-slate-500 mt-1"><Link href="/trust" className="underline underline-offset-2">{t("publicNav.trustVerification")}</Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}
