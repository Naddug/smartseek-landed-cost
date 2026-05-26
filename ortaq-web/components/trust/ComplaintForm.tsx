"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";
import { submitComplaint, type ComplaintCategory } from "@/lib/trust/api";

const CATEGORIES: ComplaintCategory[] = [
  "misleading_information",
  "document_missing",
  "technical",
  "other",
];

export function ComplaintForm() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<ComplaintCategory>("other");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ publicRef?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await submitComplaint({
      category,
      description,
      contactEmail: email,
    });
    setLoading(false);
    if ("error" in res) {
      setResult({ error: res.error });
    } else {
      setResult({ publicRef: res.publicRef });
    }
  }

  if (result?.publicRef) {
    return (
      <div className="border-t border-ortaq-border pt-6">
        <p className={typography.body}>{t("trust.complaint.success")}</p>
        <p className={cn(typography.h3, "mt-3 font-mono")}>{result.publicRef}</p>
        <p className={cn(typography.caption, "mt-2")}>{t("trust.complaint.saveRef")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-ortaq-border pt-6 space-y-4">
      <p className={typography.bodySm}>{t("trust.complaint.intro")}</p>

      <div>
        <label htmlFor="complaint-category" className={typography.caption}>
          {t("trust.complaint.category")}
        </label>
        <select
          id="complaint-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
          className="mt-1 w-full border border-ortaq-border bg-ortaq-bg px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`trust.complaint.categories.${c}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="complaint-desc" className={typography.caption}>
          {t("trust.complaint.description")}
        </label>
        <textarea
          id="complaint-desc"
          required
          minLength={20}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border border-ortaq-border bg-ortaq-bg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="complaint-email" className={typography.caption}>
          {t("trust.complaint.email")}
        </label>
        <input
          id="complaint-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border border-ortaq-border bg-ortaq-bg px-3 py-2 text-sm"
        />
      </div>

      {result?.error && <p className={cn(typography.caption, "text-ortaq-risk")}>{result.error}</p>}

      <Button type="submit" variant="secondary" disabled={loading}>
        {loading ? "…" : t("trust.complaint.submit")}
      </Button>
    </form>
  );
}
