"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { FAQ_ITEMS } from "@/lib/seo/faq";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const HOME_FAQ_IDS = [
  "ne-aliyorum",
  "nasil-yatirim",
  "ortaklik-nasil",
  "sermaye-ihtiyaci",
  "gelir-nasil",
  "deger-yaratimi",
  "spk-guven",
  "sirket-secimi",
  "due-diligence",
  "para-nereye",
  "yatirimci-koruma",
  "cikis-nasil",
  "kazanc-garantisi",
] as const;

export function InvestFaq() {
  const { t } = useTranslation();
  const items = FAQ_ITEMS.filter((item) => HOME_FAQ_IDS.includes(item.id as (typeof HOME_FAQ_IDS)[number]));
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section id="sss" className="product-section border-t border-ortaq-border bg-ortaq-surface" aria-labelledby="invest-faq-title">
      <Container wide>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className={typography.label}>{t("homeProduct.invest.faq.label")}</p>
            <h2 id="invest-faq-title" className={cn(typography.h1, "mt-1")}>
              {t("homeProduct.invest.faq.title")}
            </h2>
            <p className={cn(typography.bodySm, "mt-3 max-w-md")}>{t("homeProduct.invest.faq.lead")}</p>
            <div className="mt-5 space-y-2">
              <p className={cn(typography.bodySm, "font-semibold text-ortaq-ink")}>{t("homeProduct.invest.faq.legalTitle")}</p>
              <ul className="space-y-1.5">
                {(["1", "2", "3", "4"] as const).map((key) => (
                  <li key={key} className={cn(typography.caption, "flex items-start gap-2 font-medium text-ortaq-ink-muted")}>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ortaq-trust" />
                    {t(`homeProduct.invest.faq.legal.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/sss" className={cn(typography.bodySm, "mt-5 inline-flex font-semibold text-ortaq-trust hover:underline")}>
              {t("homeProduct.invest.faq.link")} →
            </Link>
          </div>

          <div className="divide-y divide-ortaq-border rounded-ortaq-lg border border-ortaq-border bg-ortaq-surface shadow-[var(--shadow-product)] transition-shadow duration-200 hover:shadow-[var(--shadow-product-hover)]">
            {items.map((item) => {
              const open = openId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    className="flex w-full min-h-11 items-start justify-between gap-4 px-4 py-4 text-left transition-colors duration-200 hover:bg-ortaq-bg-alt/60 sm:px-5"
                    aria-expanded={open}
                    aria-controls={`faq-answer-${item.id}`}
                    onClick={() => setOpenId(open ? null : item.id)}
                  >
                    <span className={cn(typography.h3, "text-[0.9375rem]")}>{item.question}</span>
                    <ChevronDown
                      className={cn("mt-0.5 h-4 w-4 shrink-0 text-ortaq-trust transition-transform", open && "rotate-180")}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    id={`faq-answer-${item.id}`}
                    className={cn("px-5 pb-4", !open && "sr-only")}
                    aria-hidden={!open}
                  >
                    <p className={cn(typography.bodySm, "text-ortaq-ink-muted")}>{item.answer}</p>
                    {item.links && item.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {item.links.map((l) => (
                          <Link key={l.href} href={l.href} className={cn(typography.caption, "font-semibold text-ortaq-trust hover:underline")} tabIndex={open ? undefined : -1}>
                            {l.label} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
