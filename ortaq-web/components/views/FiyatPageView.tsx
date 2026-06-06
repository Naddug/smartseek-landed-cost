"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/ui/Section";

/**
 * FiyatPageView — /fiyat
 *
 * Purpose: Honest, transparent pricing page.
 * No fake tiers. No hidden logic. No "contact us" without context.
 *
 * Rules:
 *   - Explain HOW pricing works, even if exact number comes at demo
 *   - Be specific: what's included, what's not
 *   - Acknowledge that SMEs need to know budget before committing to a demo
 *   - No fake "Popular" badges or artificial urgency
 */

export function FiyatPageView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const included = isTR ? [
    "Sınırsız işlem kaydı",
    "Sınırsız belge yükleme",
    "Karşı taraf erişimi (alıcı veya tedarikçi)",
    "Mesajlaşma ve onay geçmişi",
    "Denetim izi (audit trail)",
    "Veri dışa aktarma (PDF ve JSON)",
    "E-posta bildirimleri",
    "Türkçe ve İngilizce arayüz",
  ] : [
    "Unlimited deal records",
    "Unlimited document uploads",
    "Counterparty access (buyer or supplier)",
    "Messaging and approval history",
    "Audit trail",
    "Data export (PDF and JSON)",
    "Email notifications",
    "Turkish and English interface",
  ];

  const notIncluded = isTR ? [
    "ERP entegrasyonu — henüz yok",
    "API erişimi — yol haritasında",
    "Otomatik belge çevirisi — henüz yok",
    "Lojistik takip entegrasyonu — henüz yok",
  ] : [
    "ERP integration — not yet available",
    "API access — on the roadmap",
    "Automatic document translation — not yet available",
    "Logistics tracking integration — not yet available",
  ];

  const faqs = isTR ? [
    {
      q: "Kullanıcı başına ücret var mı?",
      a: "Hayır. Ücret şirketinize aittir, kullanıcı sayısına göre değişmez. Kaç kişi sistemi kullanırsa kullansın ücret sabittir.",
    },
    {
      q: "Karşı tarafım (alıcım veya tedarikçim) de ücret öder mi?",
      a: "Hayır. Siz ödüyorsunuz, karşı taraf ücretsiz olarak erişir. Alıcınızı veya tedarikçinizi işlem kaydına eklemek için ek maliyet yoktur.",
    },
    {
      q: "Demo öncesinde fiyat aralığı öğrenebilir miyim?",
      a: "Evet. destek@ortaq.biz adresine e-posta atın. Şirketinizin büyüklüğünü (çalışan sayısı, aylık aktif işlem sayısı) paylaşın, size tahmini aralığı yazalım.",
    },
    {
      q: "Deneme süresi var mı?",
      a: "Ücretli deneme süresi yoktur. Demo görüşmesinde ürünü canlı olarak görürsünüz — kendi aktif işleminiz üzerinden. Bu 30 dakika çoğunlukla 'deneme süresi'nden daha değerli bilgi verir.",
    },
    {
      q: "Yıllık ödeme indirimi var mı?",
      a: "Evet. Yıllık peşin ödeme için indirim uygulanır. Demo görüşmesinde detaylar netleşir.",
    },
    {
      q: "Sözleşmeyi iptal edersem ne olur?",
      a: "3 aylık minimum taahhüt sonrası herhangi bir dönemde iptal edebilirsiniz. Verilerinizi dışa aktarmanız için 30 gün süre verilir. İptal sonrası veri tutulmaz.",
    },
  ] : [
    {
      q: "Is there a per-user fee?",
      a: "No. Pricing is per company, not per user. However many people use the system, the fee is fixed.",
    },
    {
      q: "Does my counterparty (buyer or supplier) also pay?",
      a: "No. You pay, your counterparty accesses for free. There is no additional cost to add your buyer or supplier to a deal record.",
    },
    {
      q: "Can I learn the price range before a demo?",
      a: "Yes. Email destek@ortaq.biz. Share your company size (number of employees, monthly active deals) and we will send you an estimated range.",
    },
    {
      q: "Is there a free trial?",
      a: "There is no paid trial period. The demo shows you the product live — using your own active deal. This 30 minutes typically gives more useful information than a free trial.",
    },
    {
      q: "Is there an annual payment discount?",
      a: "Yes. Annual upfront payment receives a discount. Details are confirmed during the demo.",
    },
    {
      q: "What happens if I cancel?",
      a: "After the 3-month minimum commitment, you can cancel at any time. You receive 30 days to export your data. Data is not retained after cancellation.",
    },
  ];

  return (
    <PublicShell>

      {/* Header */}
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
              {isTR ? "Fiyatlandırma" : "Pricing"}
            </p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.05] sm:text-[2.5rem]">
              {isTR
                ? <>Sabit aylık ücret.<br /><span className="text-ortaq-trust">Gizli ücret yok.</span></>
                : <>Fixed monthly fee.<br /><span className="text-ortaq-trust">No hidden charges.</span></>}
            </h1>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
              {isTR
                ? "Fiyat, şirketinizin büyüklüğüne göre belirlenir. Demo görüşmesinde net rakam paylaşılır. Sisteme girmeden önce tam olarak ne ödeyeceğinizi bilirsiniz."
                : "Pricing is based on your company size. The exact figure is shared during the demo. You will know exactly what you pay before entering the system."}
            </p>
          </div>
        </Container>
      </section>

      {/* Pricing logic */}
      <section className="border-b border-ortaq-border bg-[#faf9f7]">
        <Container wide>
          <div className="py-12 sm:py-16">

            <div className="grid gap-6 sm:grid-cols-3">
              {(isTR ? [
                {
                  icon: "📋",
                  title: "Şirkete göre fiyat",
                  desc: "Kullanıcı sayısı, belge sayısı veya işlem sayısıyla değişmez. Şirketinizin büyüklüğüne göre sabit aylık ücret.",
                },
                {
                  icon: "🤝",
                  title: "Karşı taraf ücretsiz",
                  desc: "Alıcınız veya tedarikçiniz aynı işlem kaydına erişir — hiçbir ek maliyet olmadan. İki taraf, bir ücret.",
                },
                {
                  icon: "📅",
                  title: "3 ay minimum, sonra aylık",
                  desc: "İlk taahhüt 3 aydır. Sonrasında aylık veya yıllık (indirimli) devam edebilirsiniz.",
                },
              ] : [
                {
                  icon: "📋",
                  title: "Per-company pricing",
                  desc: "Does not change with user count, document count, or deal count. Fixed monthly fee based on company size.",
                },
                {
                  icon: "🤝",
                  title: "Counterparty is free",
                  desc: "Your buyer or supplier accesses the same deal record — with no additional charge. Two parties, one fee.",
                },
                {
                  icon: "📅",
                  title: "3-month minimum, then monthly",
                  desc: "First commitment is 3 months. Afterwards you can continue monthly or annually (with discount).",
                },
              ]).map(item => (
                <div key={item.title} className="rounded-xl border border-ortaq-border bg-white p-6">
                  <span className="text-3xl">{item.icon}</span>
                  <p className="mt-4 text-[0.9375rem] font-bold text-ortaq-ink">{item.title}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* What's included */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">

              <div>
                <p className="mb-4 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-emerald-700">
                  {isTR ? "Dahil olanlar" : "Included"}
                </p>
                <ul className="space-y-2">
                  {included.map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.625rem] text-emerald-700">✓</span>
                      <span className="text-[0.8125rem] text-ortaq-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-4 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-ink-soft">
                  {isTR ? "Henüz dahil değil" : "Not yet included"}
                </p>
                <ul className="space-y-2">
                  {notIncluded.map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ortaq-border text-[0.625rem] text-ortaq-ink-soft">○</span>
                      <span className="text-[0.8125rem] text-ortaq-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-b border-ortaq-border bg-white">
        <Container wide>
          <div className="py-12 sm:py-16">
            <h2 className="mb-8 text-[1.375rem] font-bold tracking-[-0.025em] text-ortaq-ink">
              {isTR ? "Fiyat hakkında sık sorulan sorular" : "Frequently asked questions about pricing"}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {faqs.map(item => (
                <div key={item.q} className="rounded-xl border border-ortaq-border p-5">
                  <p className="text-[0.875rem] font-bold text-ortaq-ink">{item.q}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ortaq-ink">
        <Container wide>
          <div className="py-12 sm:py-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[1.375rem] font-bold tracking-[-0.025em] text-ortaq-cream leading-tight">
                  {isTR
                    ? <>Net rakamı öğrenmek için<br /><span className="text-ortaq-trust">demo isteyin.</span></>
                    : <>To get the exact number,<br /><span className="text-ortaq-trust">request a demo.</span></>}
                </h2>
                <p className="mt-2 text-[0.875rem] text-ortaq-cream/60">
                  {isTR
                    ? "30 dakika. Aktif bir işleminizle. Fiyat görüşmede netleşir."
                    : "30 minutes. With your active deal. Price is confirmed at the meeting."}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <a
                  href="mailto:destek@ortaq.biz"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                >
                  {isTR ? "E-posta ile sor" : "Ask by email"} →
                </a>
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                >
                  {isTR ? "Demo İsteyin →" : "Request Demo →"}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </PublicShell>
  );
}
