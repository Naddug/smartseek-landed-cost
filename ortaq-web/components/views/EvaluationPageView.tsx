"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

const stages = [
  {
    key: "1",
    title: "Ön eleme",
    text: "Sektör uygunluğu, faaliyet süresi, üretim veya ihracat kanıtı, temel finansal tablo.",
    reject: "Tek kişilik danışmanlık, spekülatif projeler, belgesiz iddialar.",
  },
  {
    key: "2",
    title: "Operasyonel inceleme",
    text: "Fabrika veya üretim tesisi ziyareti, makine parkı, sipariş defteri, tedarik zinciri.",
    reject: "Sadece ofis adresi, üretimsiz aracı yapılar.",
  },
  {
    key: "3",
    title: "Hukuk ve sicil",
    text: "Ticaret sicili, MERSİS, vergi uyumu, ortaklık yapısı, dava ve icra taraması.",
    reject: "Sicil uyumsuzluğu, açıklanmamış ortaklık ilişkileri.",
  },
  {
    key: "4",
    title: "Finansal inceleme",
    text: "Gelir trendi, borç yapısı, nakit akışı, sermaye kullanım planının tutarlılığı.",
    reject: "Doğrulanamayan projeksiyonlar, tutarsız kullanım planı.",
  },
  {
    key: "5",
    title: "Kurucu görüşmesi",
    text: "Yüz yüze veya video mülakat. Operasyonel bilgi, hedefler, risk farkındalığı.",
    reject: "Yanıltıcı beyan, basın baskısı, gerçek dışı büyüme iddiası.",
  },
  {
    key: "6",
    title: "Komite ve platform",
    text: "Finans, saha ve hukuk oylaması. Lisanslı kitle fonlama platformu nihai onay.",
    reject: "Komite red kararı veya platform uygun bulmaması.",
  },
] as const;

export function EvaluationPageView() {
  return (
    <PublicShell stickyCta={false}>
      <Section spacing="hero">
        <Container narrow>
          <p className={typography.kicker}>Seçim süreci</p>
          <h1 className={cn(typography.h1, "mt-3")}>Şirketler nasıl değerlendirilir?</h1>
          <p className={cn(typography.lead, "mt-5 max-w-prose")}>
            Her başvuru kabul edilmez. ORTAQ yalnızca üretim yapan, belgelenebilir ve uzun vadeli
            ekonomik mantığı olan şirketleri dosyalar.
          </p>
          <p className={cn(typography.body, "mt-4 max-w-prose")}>
            Aşağıdaki aşamalar simüle edilmiş süreçtir. Canlı kampanya açılmadan önce tüm kapılar
            geçilmelidir.
          </p>
        </Container>
      </Section>

      <Section tone="alt" spacing="stage">
        <Container narrow>
          <ol className="space-y-8">
            {stages.map((s) => (
              <li key={s.key} className="border-l-2 border-ortaq-gold/50 pl-5">
                <span className={typography.caption}>Aşama {s.key}</span>
                <h2 className={cn(typography.h3, "mt-1")}>{s.title}</h2>
                <p className={cn(typography.body, "mt-3")}>{s.text}</p>
                <p className={cn(typography.bodySm, "mt-3 text-ortaq-ink-soft")}>
                  <span className="font-medium text-ortaq-ink">Red gerekçesi örneği:</span> {s.reject}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section spacing="compact" className="border-t border-ortaq-border">
        <Container narrow>
          <p className={typography.body}>
            Örnek dosya:{" "}
            <Link href="/sirket/karat-parca-konya" className={typography.link}>
              Karat Parça Makina
            </Link>{" "}
            — Konya, saha doğrulaması aşamasında.
          </p>
          <Link href="/sirket/karat-parca-konya" className="mt-6 inline-block">
            <Button variant="dark">Değerlendirme dosyasını inceleyin</Button>
          </Link>
        </Container>
      </Section>
    </PublicShell>
  );
}
