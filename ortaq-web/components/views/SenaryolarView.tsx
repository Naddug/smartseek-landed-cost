"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { StoryBar } from "@/components/layout/StoryBar";

/**
 * SenaryolarView — Phase 8: 15 visual-first scenarios.
 *
 * Design principle: A visitor should understand the scenario BEFORE reading.
 * Each card opens with a storyboard strip (4 emoji frames) that shows the
 * situation unfolding — before any prose appears.
 *
 * Structure per card:
 *   1. Storyboard strip — 4 visual frames showing the problem sequence
 *   2. Category badge + scenario number + title
 *   3. One-sentence situation
 *   4. Chaos (current reality) vs ORTAQ (what changes) — side by side
 *      ORTAQ panel styled as actual product UI mockup
 *
 * 6 categories:
 *   Belge / Ödeme / Onay / Zamanlama / İletişim / Portföy
 */

/* ─── Types ──────────────────────────────────────────────────────────────── */

type B = { tr: string; en: string };
const b = (tr: string, en: string): B => ({ tr, en });
type Lang = "tr" | "en";

interface StoryFrame {
  icon: string;
  label: B;
  tone: "start" | "mid" | "warn" | "hot";
}

interface ChaosMsg {
  from: string;
  via: "WhatsApp" | "Email" | "Phone";
  text: B;
}

interface OrtaqRow {
  label: B;
  value: B;
  status: "ok" | "warn" | "action";
}

interface Scenario {
  id: string;
  num: string;
  cat: B;
  catColor: string; // tailwind bg + text
  title: B;
  sub: B;
  storyboard: StoryFrame[];
  chaos: {
    caption: B;
    msgs: ChaosMsg[];
    result: B;
  };
  ortaq: {
    caption: B;
    dealLabel: B;
    stage: B;
    rows: OrtaqRow[];
    note: B;
  };
}

/* ─── Scenario data ──────────────────────────────────────────────────────── */

const SCENARIOS: Scenario[] = [
  /* ══ 01 SGS PENDING ═══════════════════════════════════════════════════════ */
  {
    id: "sgs-bekleniyor",
    num: "01",
    cat: b("Belge", "Document"),
    catColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: b(
      "SGS onayı bekleniyor. Gemi 3 gün sonra kalkıyor.",
      "SGS approval pending. Vessel departs in 3 days.",
    ),
    sub: b(
      "Muayene raporu yüklendi — ama alıcı açmadı. Gemi kalkıyor.",
      "Inspection report uploaded — but buyer hasn't opened it. Vessel is departing.",
    ),
    storyboard: [
      { icon: "📄", label: b("SGS raporu yüklendi", "SGS report uploaded"), tone: "start" },
      { icon: "🚢", label: b("Gemi 3 gün sonra", "Vessel departs in 3 days"), tone: "mid" },
      { icon: "👁", label: b("Alıcı henüz açmamış", "Buyer hasn't opened it"), tone: "warn" },
      { icon: "❓", label: b("Onay gelecek mi?", "Will approval come?"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "CEO", via: "WhatsApp", text: b("SGS onayı geldi mi?", "Has the SGS approval arrived?") },
        { from: "Ops", via: "Email", text: b("SGS raporunu onayladınız mı? Gemi 3 gün sonra kalkıyor.", "Have you approved the SGS report? Vessel departs in 3 days.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Hangi SGS raporu? Bize ulaşmadı.", "Which SGS report? We did not receive it.") },
        { from: "Ops", via: "WhatsApp", text: b("Raporu göndermemişiz. Tekrar gönderiyorum.", "We hadn't sent it. Resending now.") },
      ],
      result: b(
        "Gün kaybedildi. Gemi kaçabilir. Kimse kimin sorumlu olduğunu bilmiyordu.",
        "A day lost. Vessel may be missed. Nobody knew who was responsible.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Çelik Alım · Alman alıcı · €450.000", "Steel Purchase · German buyer · €450,000"),
      stage: b("SGS Muayene", "SGS Inspection"),
      rows: [
        { label: b("SGS Raporu", "SGS Report"), value: b("TÜV Thailand · yüklendi", "TÜV Thailand · uploaded"), status: "ok" },
        { label: b("Alıcı Onayı", "Buyer Approval"), value: b("Bekleniyor · 2 gündür açılmadı", "Pending · not opened for 2 days"), status: "warn" },
        { label: b("Gemi Kalkışı", "Vessel Departure"), value: b("3 gün sonra · 28 Haziran", "In 3 days · June 28"), status: "action" },
        { label: b("Sıradaki adım", "Next step"), value: b("Alıcı onayını takip et", "Follow up on buyer approval"), status: "action" },
      ],
      note: b(
        "Alıcı SGS raporunu açmamış — ORTAQ kaydından görüyorsunuz. Aramadan önce bunu biliyorsunuz.",
        "Buyer hasn't opened the SGS report — visible in ORTAQ. You know this before calling.",
      ),
    },
  },

  /* ══ 02 INSPECTION PENDING ════════════════════════════════════════════════ */
  {
    id: "muayene-bekleniyor",
    num: "02",
    cat: b("Onay", "Approval"),
    catColor: "bg-purple-50 text-purple-700 border-purple-200",
    title: b(
      "Muayene tarihi onaylanmadı. Sevkiyat bekliyor.",
      "Inspection date not confirmed. Shipment on hold.",
    ),
    sub: b(
      "Üretim tamamlandı, muayene şirketi randevu vermedi, gemi günü yaklaşıyor.",
      "Production complete, inspection company hasn't confirmed a date, vessel day approaching.",
    ),
    storyboard: [
      { icon: "🏭", label: b("Üretim tamamlandı", "Production complete"), tone: "start" },
      { icon: "📋", label: b("Muayene istendi", "Inspection requested"), tone: "mid" },
      { icon: "📅", label: b("Tarih hâlâ belirsiz", "Date still unknown"), tone: "warn" },
      { icon: "⏸", label: b("Sevkiyat bekliyor", "Shipment on hold"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Ops", via: "WhatsApp", text: b("Muayene randevusu aldık mı?", "Have we booked the inspection appointment?") },
        { from: "Lojistik / Logistics", via: "Phone", text: b("SGS'i aradık, bu hafta dolu dediler.", "We called SGS, they said they're fully booked this week.") },
        { from: "CEO", via: "WhatsApp", text: b("Muayene olmadan sevkiyat yapamayız. Kaç gün ertelenir?", "We can't ship without inspection. How many days delay?") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Neden sevkiyat gecikiyor? Sözleşmede tarih var.", "Why is shipment delayed? There's a date in the contract.") },
      ],
      result: b(
        "Muayene bekleme nedenini alıcıya açıklamak zorunda kalındı. Güven sorunu.",
        "Had to explain inspection wait to buyer. Trust issue created.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Tekstil Sevkiyatı · İtalyan alıcı · $120.000", "Textile Shipment · Italian buyer · $120,000"),
      stage: b("Pre-Shipment Muayene", "Pre-Shipment Inspection"),
      rows: [
        { label: b("Üretim", "Production"), value: b("Tamamlandı · 14 Haziran", "Completed · June 14"), status: "ok" },
        { label: b("Muayene Talebi", "Inspection Request"), value: b("SGS İstanbul · 15 Haziran", "SGS Istanbul · June 15"), status: "ok" },
        { label: b("Randevu", "Appointment"), value: b("Bekleniyor · en geç 20 Haziran", "Pending · latest June 20"), status: "warn" },
        { label: b("Gemi Son Gün", "Vessel Cutoff"), value: b("23 Haziran · 3 gün kaldı", "June 23 · 3 days left"), status: "action" },
      ],
      note: b(
        "SGS randevu bekleme süreci kayıtta. Alıcı gecikme nedenini görebilir — sizi aramak zorunda değil.",
        "SGS appointment wait is in the record. Buyer can see why there's a delay — no need to call you.",
      ),
    },
  },

  /* ══ 03 LC DELAYED ════════════════════════════════════════════════════════ */
  {
    id: "lc-gecikmesi",
    num: "03",
    cat: b("Ödeme", "Payment"),
    catColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: b(
      "LC süreci uzuyor. Finans ekibi ne zaman ödeme geleceğini bilmiyor.",
      "LC process dragging. Finance doesn't know when payment will arrive.",
    ),
    sub: b(
      "Sözleşme imzalı, SGS onaylı — ama alıcının bankası LC'yi hâlâ açmamış.",
      "Contract signed, SGS approved — but buyer's bank still hasn't opened the LC.",
    ),
    storyboard: [
      { icon: "✅", label: b("Sözleşme imzalı", "Contract signed"), tone: "start" },
      { icon: "🏦", label: b("LC açılması bekleniyor", "Waiting for LC"), tone: "mid" },
      { icon: "⏰", label: b("2 haftadır haber yok", "No news for 2 weeks"), tone: "warn" },
      { icon: "💰", label: b("Finans planlayamıyor", "Finance can't plan"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Finans / Finance", via: "WhatsApp", text: b("LC açıldı mı? Bütçeye yazacağım.", "Has the LC been opened? I need to record it in the budget.") },
        { from: "Satış / Sales", via: "Email", text: b("LC süreci nerede?", "Where is the LC process?") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Bankamız işliyor, bu hafta tamamlanır.", "Our bank is processing it, will be done this week.") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("Bu hafta diyorlar ama kesin değil.", "They say this week but not confirmed.") },
      ],
      result: b(
        "Her gün aynı soru. Her gün belirsiz cevap. Finans planlaması yapılamıyor.",
        "Same question every day. Vague answer every day. Finance cannot plan.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Makine İhracatı · UAE alıcı · $780.000", "Machinery Export · UAE buyer · $780,000"),
      stage: b("LC Süreci", "LC Process"),
      rows: [
        { label: b("SGS Onayı", "SGS Approval"), value: b("Onaylandı · 18 Haziran", "Approved · June 18"), status: "ok" },
        { label: b("LC Durumu", "LC Status"), value: b("HSBC Dubai · işlemde", "HSBC Dubai · in process"), status: "warn" },
        { label: b("Alıcı Bilgisi", "Buyer Info"), value: b("Bu hafta içinde · 21 Haziran iletildi", "This week · communicated June 21"), status: "warn" },
        { label: b("Finans Notu", "Finance Note"), value: b("Bütçeye yaklaşık hafta sonu yazılacak", "Budget entry approx. end of week"), status: "warn" },
      ],
      note: b(
        "Finans ekibi satışı aramadan LC durumunu görüyor. Satış alıcıya yazmadan önceki durumu biliyor.",
        "Finance sees LC status without calling sales. Sales knows current status before writing to buyer.",
      ),
    },
  },

  /* ══ 04 WRONG CONTRACT VERSION ════════════════════════════════════════════ */
  {
    id: "yanlis-sozlesme-versiyonu",
    num: "04",
    cat: b("Belge", "Document"),
    catColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: b(
      "Alıcı SPA v10 diyor. Siz SPA v12 diyorsunuz.",
      "Buyer says SPA v10. You say SPA v12.",
    ),
    sub: b(
      "Birden fazla revizyon yapıldı — alıcı eski versiyon üzerinden ödeme yapmaya çalışıyor.",
      "Multiple revisions made — buyer is trying to pay based on an old version.",
    ),
    storyboard: [
      { icon: "📝", label: b("v10 gönderildi", "v10 sent"), tone: "start" },
      { icon: "📝", label: b("v12 imzalandı", "v12 signed"), tone: "mid" },
      { icon: "💳", label: b("Alıcı v10'a göre ödüyor", "Buyer pays per v10"), tone: "warn" },
      { icon: "⚠️", label: b("Fiyat anlaşmazlığı", "Price dispute"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Alıcı / Buyer", via: "Email", text: b("SPA madde 7.2 uyarınca fiyat $980/ton olmalı.", "Per SPA clause 7.2, price should be $980/ton.") },
        { from: "Siz / You", via: "Email", text: b("Hayır, son revizyon v12'de fiyat $1.020/ton.", "No, the last revision in v12 has the price at $1,020/ton.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Bende v12 yok. Sadece v10 geldi.", "I don't have v12. Only v10 was sent to us.") },
        { from: "Hukuk / Legal", via: "WhatsApp", text: b("v12'yi ne zaman gönderdik? İspatımız var mı?", "When did we send v12? Do we have proof?") },
      ],
      result: b(
        "Anlaşmazlık. Zaman kaybı. Ödeme gecikiyor. Kim ne zaman ne gönderdi belli değil.",
        "Dispute. Time lost. Payment delayed. Nobody knows who sent what and when.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Çelik Satışı · Japon alıcı · $1.250.000", "Steel Sale · Japanese buyer · $1,250,000"),
      stage: b("Sözleşme Versiyonu", "Contract Version"),
      rows: [
        { label: b("SPA v10", "SPA v10"), value: b("Eski sürüm · geçersiz", "Old version · superseded"), status: "warn" },
        { label: b("SPA v11", "SPA v11"), value: b("Eski sürüm · geçersiz", "Old version · superseded"), status: "warn" },
        { label: b("SPA v12", "SPA v12"), value: b("Geçerli · iki taraf imzalı", "Current · signed by both"), status: "ok" },
        { label: b("Gönderim Kaydı", "Delivery Record"), value: b("v12 · 10 Haz 14:33 · iki tarafa", "v12 · Jun 10 14:33 · both parties"), status: "ok" },
      ],
      note: b(
        "Hangi versiyonun geçerli olduğu, kim ne zaman imzaladığı — ORTAQ kaydında tartışmasız.",
        "Which version is current, who signed when — indisputable in the ORTAQ record.",
      ),
    },
  },

  /* ══ 05 PAYMENT UNCERTAINTY ═══════════════════════════════════════════════ */
  {
    id: "odeme-belirsizligi",
    num: "05",
    cat: b("Ödeme", "Payment"),
    catColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: b(
      "Ödeme şekli anlaşıldı mı? LC mi, TT mi? Hangi kur?",
      "Was payment method agreed? LC or TT? Which exchange rate?",
    ),
    sub: b(
      "Fiyat netleşti — ama ödeme şekli, kur tarihi ve banka şartları herkes tarafından farklı anlaşıldı.",
      "Price was agreed — but payment method, exchange rate date, and bank terms were understood differently by each party.",
    ),
    storyboard: [
      { icon: "🤝", label: b("Fiyat anlaşıldı", "Price agreed"), tone: "start" },
      { icon: "📋", label: b("LC mi TT mi?", "LC or TT?"), tone: "mid" },
      { icon: "💱", label: b("Kur tarihi belirsiz", "Exchange rate unclear"), tone: "warn" },
      { icon: "🔀", label: b("Herkes farklı anlıyor", "Everyone understood differently"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Alıcı / Buyer", via: "Email", text: b("TT ile ödeyeceğiz, kur imza günü baz alınacak.", "We'll pay by TT, exchange rate on signing date.") },
        { from: "Siz / You", via: "Email", text: b("Hayır, LC ile anlaştık. Kur sevkiyat gününe göre.", "No, we agreed on LC. Rate based on shipment date.") },
        { from: "Finans / Finance", via: "WhatsApp", text: b("Hangisi baz alınacak? Kur farkı $12.000 eder.", "Which rate will be used? Difference is $12,000.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("E-postaya baktım, TT yazıyor.", "I checked the email, it says TT.") },
      ],
      result: b(
        "$12.000 kur farkı anlaşmazlığı. İşlem kapanmadan önce kriz.",
        "$12,000 exchange rate dispute. Crisis before the deal closes.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Kimyasal Madde · Kore alıcı · $340.000", "Chemicals · Korean buyer · $340,000"),
      stage: b("Ödeme Şartları", "Payment Terms"),
      rows: [
        { label: b("Ödeme Şekli", "Payment Method"), value: b("LC · HSBC · her iki taraf onaylı", "LC · HSBC · approved by both"), status: "ok" },
        { label: b("Kur Baz", "Exchange Rate Base"), value: b("Sevkiyat tarihi · her iki taraf onaylı", "Shipment date · both parties confirmed"), status: "ok" },
        { label: b("Banka Şartları", "Bank Terms"), value: b("Net 30 · sözleşme madde 8.3", "Net 30 · contract clause 8.3"), status: "ok" },
        { label: b("Onay Tarihi", "Approval Date"), value: b("12 Haziran · iki taraf imzalı", "June 12 · signed by both"), status: "ok" },
      ],
      note: b(
        "Ödeme şartları sözleşmede ve kayıtta sabit. 'Biz LC demiştik' tartışması dakikada kapanıyor.",
        "Payment terms fixed in contract and record. 'We said LC' dispute closes in minutes.",
      ),
    },
  },

  /* ══ 06 SHIPMENT DATE CHANGE ══════════════════════════════════════════════ */
  {
    id: "sevkiyat-tarihi-degisti",
    num: "06",
    cat: b("Zamanlama", "Schedule"),
    catColor: "bg-orange-50 text-orange-700 border-orange-200",
    title: b(
      "Sevkiyat tarihi değişti. Herkes farklı tarih biliyor.",
      "Shipment date changed. Everyone knows a different date.",
    ),
    sub: b(
      "Armatör yeni tarih bildirdi — lojistik güncelledi ama bilgi zincirde koptu.",
      "Carrier informed of new date — logistics updated but information broke in the chain.",
    ),
    storyboard: [
      { icon: "📅", label: b("28 Haziran planlandı", "June 28 planned"), tone: "start" },
      { icon: "📢", label: b("Armatör erteledi", "Carrier postponed"), tone: "mid" },
      { icon: "📄", label: b("BL güncellenmedi", "BL not updated"), tone: "warn" },
      { icon: "❌", label: b("Alıcı eski tarihi biliyor", "Buyer knows old date"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Lojistik / Logistics", via: "WhatsApp", text: b("Gemi 28 değil 2 Temmuz kalkıyor.", "Vessel is July 2, not June 28.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Neden gümrük 28 Haziran yazmış? BL'de tarih yanlış.", "Why does customs say June 28? BL date is wrong.") },
        { from: "Ops", via: "WhatsApp", text: b("BL taslağı güncellendi mi? Alıcı 28 sanıyor.", "Was the BL draft updated? Buyer thinks it's still June 28.") },
        { from: "Lojistik / Logistics", via: "WhatsApp", text: b("Pazar günü güncelledim ama kim gönderdi?", "I updated it on Sunday but who sent it?") },
      ],
      result: b(
        "Yanlış BL gümrüğe girdi. Düzeltme için fazladan gün kaybı.",
        "Wrong BL submitted to customs. Extra days lost for correction.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Gıda Sevkiyatı · İngiliz alıcı · £280.000", "Food Shipment · UK buyer · £280,000"),
      stage: b("BL Versiyonu", "BL Version"),
      rows: [
        { label: b("BL Taslak v1", "BL Draft v1"), value: b("Eski · 28 Haz kalkışı · geçersiz", "Old · June 28 departure · superseded"), status: "warn" },
        { label: b("BL Taslak v2", "BL Draft v2"), value: b("Geçerli · 2 Temmuz kalkışı", "Current · July 2 departure"), status: "ok" },
        { label: b("Alıcıya İletildi", "Sent to Buyer"), value: b("v2 · 22 Haz 09:14 · okundu", "v2 · Jun 22 09:14 · read"), status: "ok" },
        { label: b("Gümrük", "Customs"), value: b("v2 üzerinden işlem yapacak", "Will process using v2"), status: "ok" },
      ],
      note: b(
        "Tarih değişikliği kayıtta. Alıcı v1'i tekrar açamaz — yalnızca geçerli v2 görünür.",
        "Date change is in the record. Buyer can't reopen v1 — only current v2 is visible.",
      ),
    },
  },

  /* ══ 07 MISSING BL ════════════════════════════════════════════════════════ */
  {
    id: "bl-eksik",
    num: "07",
    cat: b("Belge", "Document"),
    catColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: b(
      "BL taslağı yok. Alıcı gümrük işlemini başlatamıyor.",
      "BL draft missing. Buyer cannot start customs clearance.",
    ),
    sub: b(
      "Sevkiyat yapıldı — ama BL taslağı hâlâ gelmedi ve her gün depo masrafı işliyor.",
      "Shipment made — but BL draft still hasn't arrived and demurrage is running every day.",
    ),
    storyboard: [
      { icon: "✈️", label: b("Sevkiyat yapıldı", "Shipment made"), tone: "start" },
      { icon: "📄", label: b("BL taslağı bekleniyor", "BL draft pending"), tone: "mid" },
      { icon: "🛃", label: b("Gümrük başlayamıyor", "Customs cannot start"), tone: "warn" },
      { icon: "💸", label: b("Her gün depo masrafı", "Demurrage daily"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Alıcı / Buyer", via: "Email", text: b("BL taslağını gönderecek misiniz? Gümrük bekliyor.", "Are you going to send the BL draft? Customs is waiting.") },
        { from: "Ops", via: "WhatsApp", text: b("Armatöre sorduk, bugün çıkar dediler.", "We asked the carrier, they said it comes out today.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Hâlâ gelmedi. Depo tutma ücreti başladı.", "Still nothing. Demurrage charges have started.") },
        { from: "Ops", via: "WhatsApp", text: b("Armatör neden gecikmeli bilmiyoruz.", "We don't know why the carrier is delayed.") },
      ],
      result: b(
        "Alıcı depo masrafı ödüyor. BL neden gecikiyor bilinmiyor. Sizi aracı konumuna düşürdü.",
        "Buyer is paying demurrage. Nobody knows why BL is late. You're stuck in the middle.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Ham Madde · Yunan alıcı · €190.000", "Raw Materials · Greek buyer · €190,000"),
      stage: b("BL Süreci", "BL Process"),
      rows: [
        { label: b("BL Taslak", "BL Draft"), value: b("Armatörde · hazırlanıyor", "With carrier · being prepared"), status: "warn" },
        { label: b("Tahmini Teslim", "Estimated Delivery"), value: b("Bugün 17:00 · armatör bildirdi", "Today 17:00 · carrier informed"), status: "warn" },
        { label: b("Alıcı Bilgi", "Buyer Info"), value: b("Tahmini tarih iletildi · 14:10", "Estimated time communicated · 14:10"), status: "ok" },
        { label: b("Depo Masrafı", "Demurrage"), value: b("1 gün · neden kayıtta", "1 day · reason noted in record"), status: "action" },
      ],
      note: b(
        "BL sürecinin nerede olduğu ve gecikme nedeni kayıtta. Alıcıya sormadan önce cevabınız hazır.",
        "Where the BL process is and the delay reason are in the record. You have the answer before the buyer asks.",
      ),
    },
  },

  /* ══ 08 MISSING APPROVAL ══════════════════════════════════════════════════ */
  {
    id: "onay-eksik",
    num: "08",
    cat: b("Onay", "Approval"),
    catColor: "bg-purple-50 text-purple-700 border-purple-200",
    title: b(
      "Onay zinciri tıkandı. Belge 4 gündür bekliyor.",
      "Approval chain blocked. Document waiting for 4 days.",
    ),
    sub: b(
      "Proforma fatura yayınlandı — satış onayladı, ama finans onayı hâlâ yok.",
      "Proforma invoice issued — sales approved, but finance approval still missing.",
    ),
    storyboard: [
      { icon: "📄", label: b("Belge gönderildi", "Document sent"), tone: "start" },
      { icon: "✅", label: b("Satış onayladı", "Sales approved"), tone: "mid" },
      { icon: "⏸", label: b("Finans onaylamadı", "Finance hasn't approved"), tone: "warn" },
      { icon: "🔒", label: b("İşlem ilerleyemiyor", "Deal cannot proceed"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Ops", via: "WhatsApp", text: b("Proforma onaylandı mı? Alıcıya göndereceğiz.", "Has the proforma been approved? We're going to send it to the buyer.") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("Ben onayladım. Finans da onaylamalı mı?", "I approved it. Does finance need to approve too?") },
        { from: "Finans / Finance", via: "WhatsApp", text: b("Bana kimse sormadı. Ne zaman gönderildi?", "Nobody asked me. When was it sent?") },
        { from: "Ops", via: "Email", text: b("4 gündür bekliyor. Alıcı sürekli soruyor.", "It's been waiting 4 days. Buyer keeps asking.") },
      ],
      result: b(
        "4 gün kayıp. Onay kimin sorumluluğunda belli değildi. Alıcı bekliyor.",
        "4 days lost. Nobody knew whose responsibility the approval was. Buyer waiting.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Tarım Ürünleri · Meksika alıcı · $95.000", "Agricultural Products · Mexican buyer · $95,000"),
      stage: b("Proforma Onayı", "Proforma Approval"),
      rows: [
        { label: b("Proforma Fatura", "Proforma Invoice"), value: b("v1 · 16 Haziran yayınlandı", "v1 · published June 16"), status: "ok" },
        { label: b("Satış Onayı", "Sales Approval"), value: b("✓ Onaylandı · 16 Haz 15:20", "✓ Approved · Jun 16 15:20"), status: "ok" },
        { label: b("Finans Onayı", "Finance Approval"), value: b("⏸ Bekleniyor · 4 gündür", "⏸ Pending · 4 days"), status: "action" },
        { label: b("Alıcıya Gönderim", "Sent to Buyer"), value: b("Finans onayı sonrası", "After finance approval"), status: "warn" },
      ],
      note: b(
        "Finans onayının beklendiği ve 4 gündür açılmadığı kayıtta görünüyor. Finans bildirimsiz fark ediyor.",
        "Finance approval pending and unopened for 4 days is visible in the record. Finance sees it without a notification.",
      ),
    },
  },

  /* ══ 09 MULTIPLE ACTIVE DEALS ════════════════════════════════════════════ */
  {
    id: "coklu-islem",
    num: "09",
    cat: b("Portföy", "Portfolio"),
    catColor: "bg-slate-100 text-slate-700 border-slate-200",
    title: b(
      "10 aktif işlem. Hangisinden başlayacaksınız?",
      "10 active deals. Where do you start?",
    ),
    sub: b(
      "Sabah masanıza oturdunuz — hangisi acil, hangisi takılı, hangi ödeme bu hafta?",
      "You sat down at your desk — which is urgent, which is stuck, which payment is due this week?",
    ),
    storyboard: [
      { icon: "📁", label: b("10 aktif işlem", "10 active deals"), tone: "start" },
      { icon: "❓", label: b("Hangisi acil?", "Which is urgent?"), tone: "mid" },
      { icon: "⏳", label: b("Bilgi toplamak gerekiyor", "Information gathering needed"), tone: "warn" },
      { icon: "📞", label: b("4 kişi aranıyor", "4 people being called"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "GM", via: "WhatsApp", text: b("Bugün öncelikli işlem hangisi?", "Which deal is the priority today?") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("Çelik işi acil. Bir de tekstil zor.", "Steel deal is urgent. Textile also looks difficult.") },
        { from: "Finans / Finance", via: "Email", text: b("Hangi işlemlerde ödeme bu ay bekleniyor?", "Which deals have payments expected this month?") },
        { from: "Ops", via: "WhatsApp", text: b("3 farklı işlemde SGS onayı bekliyoruz.", "We have SGS approval pending on 3 different deals.") },
      ],
      result: b(
        "Her sabah aynı toplantı, aynı sorular, aynı belirsizlik. Karar vermek için bilgi toplamak zaman alıyor.",
        "Same meeting every morning, same questions, same uncertainty. Gathering information to decide takes time.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ portföy görünümü:", "ORTAQ portfolio view:"),
      dealLabel: b("Portföy · 10 Aktif İşlem", "Portfolio · 10 Active Deals"),
      stage: b("Genel Durum", "Overall Status"),
      rows: [
        { label: b("Acil", "Urgent"), value: b("2 işlem · 24s yanıtsız", "2 deals · 24h no response"), status: "action" },
        { label: b("Bu hafta ödeme", "Payment this week"), value: b("3 işlem · €1.2M toplam", "3 deals · €1.2M total"), status: "warn" },
        { label: b("SGS bekliyor", "SGS pending"), value: b("3 işlem · alıcı tarafta", "3 deals · on buyer side"), status: "warn" },
        { label: b("Sorunsuz ilerliyor", "Moving smoothly"), value: b("2 işlem · takip yeterli", "2 deals · monitoring sufficient"), status: "ok" },
      ],
      note: b(
        "10 işlemin durumu, hangisinin acil olduğu ve sıranın kimde olduğu sabah 5 dakikada görünüyor.",
        "Status of all 10 deals, which are urgent, whose turn it is — visible in 5 minutes every morning.",
      ),
    },
  },

  /* ══ 10 INTERNAL CONFUSION ════════════════════════════════════════════════ */
  {
    id: "ic-karisiklik",
    num: "10",
    cat: b("İletişim", "Communication"),
    catColor: "bg-rose-50 text-rose-700 border-rose-200",
    title: b(
      "Kendi ekibiniz farklı bilgilere sahip.",
      "Your own team has different information.",
    ),
    sub: b(
      "Satış, finans ve operasyon aynı işlem hakkında farklı fiyat, farklı tarih, farklı şartlar biliyor.",
      "Sales, finance and operations know different prices, dates and terms for the same deal.",
    ),
    storyboard: [
      { icon: "💼", label: b("Satış: $100/ton", "Sales: $100/ton"), tone: "start" },
      { icon: "💰", label: b("Finans: $97/ton", "Finance: $97/ton"), tone: "mid" },
      { icon: "🔧", label: b("Ops: 30 Tem teslim", "Ops: July 30 delivery"), tone: "warn" },
      { icon: "🤔", label: b("CEO: Hangisi doğru?", "CEO: Which is correct?"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "CEO", via: "WhatsApp", text: b("Bu işlemde fiyat neydi kesin olarak?", "What was the exact price on this deal?") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("$100/ton, son FCO'da böyle yazıyordu.", "$100/ton, that's what the last FCO said.") },
        { from: "Finans / Finance", via: "WhatsApp", text: b("Bende $97 yazıyor, revize FCO'yu görmedim.", "I have $97, I didn't see the revised FCO.") },
        { from: "Ops", via: "WhatsApp", text: b("Teslim tarihi 30 Temmuz mu, 15 Ağustos mu? İkisi de yazıyor bende.", "Delivery date July 30 or August 15? I have both written down.") },
      ],
      result: b(
        "CEO üç farklı versiyon aldı. Doğru bilgiye ulaşmak için 40 dakika harcandı.",
        "CEO received three different versions. 40 minutes spent reaching the correct information.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Plastik Hammadde · Polonya alıcı · €220.000", "Plastic Raw Material · Polish buyer · €220,000"),
      stage: b("Tek Kayıt", "Single Record"),
      rows: [
        { label: b("Geçerli Fiyat", "Current Price"), value: b("$100/ton · FCO v3 · 8 Haz onaylı", "$100/ton · FCO v3 · approved Jun 8"), status: "ok" },
        { label: b("Teslim Tarihi", "Delivery Date"), value: b("15 Ağustos · her iki taraf onaylı", "August 15 · approved by both"), status: "ok" },
        { label: b("Ödeme Şekli", "Payment Method"), value: b("TT 30 gün · sözleşme m. 6", "TT 30 days · contract cl. 6"), status: "ok" },
        { label: b("Tüm ekip görüyor", "All teams see"), value: b("Satış · Finans · Ops · GM", "Sales · Finance · Ops · GM"), status: "ok" },
      ],
      note: b(
        "Ekibin tamamı aynı kaydı görüyor. 'Bende farklı yazıyor' tartışması yoktur.",
        "The entire team sees the same record. There is no 'mine says something different' dispute.",
      ),
    },
  },

  /* ══ 11 SUPPLIER DELAY ════════════════════════════════════════════════════ */
  {
    id: "tedarikci-gecikmesi",
    num: "11",
    cat: b("Zamanlama", "Schedule"),
    catColor: "bg-orange-50 text-orange-700 border-orange-200",
    title: b(
      "Tedarikçi 15 gün gecikiyor. Alıcı bilmiyor.",
      "Supplier is 15 days late. Buyer doesn't know.",
    ),
    sub: b(
      "Üretim gecikmesi var — alıcıya ne zaman, nasıl söylenecek? Kimse karar veremiyor.",
      "Production delay happened — when and how to tell the buyer? Nobody can decide.",
    ),
    storyboard: [
      { icon: "📅", label: b("15 Tem teslim planlandı", "July 15 delivery planned"), tone: "start" },
      { icon: "🏭", label: b("Tedarikçi: 15 gün geç", "Supplier: 15 days late"), tone: "mid" },
      { icon: "🚨", label: b("Alıcı hâlâ bilmiyor", "Buyer still doesn't know"), tone: "warn" },
      { icon: "📧", label: b("Kim ne zaman söyleyecek?", "Who will tell, when?"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Tedarikçi / Supplier", via: "Phone", text: b("Hammadde geç geldi. 15 gün erteleme gerekiyor.", "Raw material came late. Need 15 day delay.") },
        { from: "Ops", via: "WhatsApp", text: b("Alıcıya söyleyelim mi? Ne diyelim?", "Should we tell the buyer? What do we say?") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("Bekleyelim, belki hızlanır. Şimdi söylersek alıcı sinirlenir.", "Let's wait, maybe it speeds up. If we tell now buyer will be angry.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Sevkiyat bu hafta mı? Gümrük randevusu aldım.", "Is shipment this week? I've booked a customs appointment.") },
      ],
      result: b(
        "Alıcı gümrük randevusu aldı. Artık söylemek daha kötü sonuç doğuruyor.",
        "Buyer booked a customs appointment. Now telling them causes worse consequences.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Endüstriyel Ekipman · Çek alıcı · €380.000", "Industrial Equipment · Czech buyer · €380,000"),
      stage: b("Üretim / Sevkiyat", "Production / Shipment"),
      rows: [
        { label: b("Orijinal Teslim", "Original Delivery"), value: b("15 Temmuz · sözleşme tarihi", "July 15 · contract date"), status: "warn" },
        { label: b("Gecikme Nedeni", "Delay Reason"), value: b("Hammadde gecikmesi · kayıtta", "Raw material delay · on record"), status: "warn" },
        { label: b("Revize Teslim", "Revised Delivery"), value: b("30 Temmuz · alıcıya iletildi", "July 30 · communicated to buyer"), status: "ok" },
        { label: b("Alıcı Yanıtı", "Buyer Response"), value: b("Onayladı · gümrük randevusu revize", "Confirmed · customs rebooked"), status: "ok" },
      ],
      note: b(
        "Gecikme kaydı şeffaf. Erken bildirim sayesinde alıcı gümrük randevusunu revize etti — sinirlenmedi.",
        "Delay record is transparent. Early notification let buyer revise customs appointment — no frustration.",
      ),
    },
  },

  /* ══ 12 BUYER NOT RESPONDING ══════════════════════════════════════════════ */
  {
    id: "alici-yanit-vermiyor",
    num: "12",
    cat: b("İletişim", "Communication"),
    catColor: "bg-rose-50 text-rose-700 border-rose-200",
    title: b(
      "Alıcı 5 gündür yanıt vermiyor. İşlem var mı yok mu?",
      "Buyer not responding for 5 days. Is the deal on or off?",
    ),
    sub: b(
      "Son şartlar iletildi, tedarikçi üretim kapasitesi tuttu — ama alıcıdan ses yok.",
      "Final terms sent, supplier production capacity held — but no word from buyer.",
    ),
    storyboard: [
      { icon: "📧", label: b("Son şartlar gönderildi", "Final terms sent"), tone: "start" },
      { icon: "⏰", label: b("2 gün · yanıt yok", "2 days · no reply"), tone: "mid" },
      { icon: "⏰", label: b("5 gün · yanıt yok", "5 days · no reply"), tone: "warn" },
      { icon: "🤔", label: b("İşlem devam ediyor mu?", "Is deal still on?"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Satış / Sales", via: "Email", text: b("Son fiyat teklifimizi ilettik, yanıt bekliyoruz.", "We sent our final price offer, awaiting response.") },
        { from: "CEO", via: "WhatsApp", text: b("Alıcıdan haber var mı? Tedarikçiyi serbest bırakalım mı?", "Any news from buyer? Should we release the supplier?") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("E-posta okudular ama cevap vermediler. LinkedIn'e baktım.", "They read the email but didn't reply. I checked LinkedIn.") },
        { from: "CEO", via: "WhatsApp", text: b("Capacity hold için günlük maliyet var. Karar gerekiyor.", "Daily cost for capacity hold. Decision needed.") },
      ],
      result: b(
        "Tedarikçi kapasitesini 5 gün tuttu. Alıcı vazgeçmişti ama kimse bilmiyordu.",
        "Supplier held capacity for 5 days. Buyer had walked away but nobody knew.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Ahşap Ürünler · İsveç alıcı · SEK 2.4M", "Wood Products · Swedish buyer · SEK 2.4M"),
      stage: b("Teklif / Müzakere", "Offer / Negotiation"),
      rows: [
        { label: b("Son Teklif", "Last Offer"), value: b("SEK 2.4M · 18 Haz 11:30 gönderildi", "SEK 2.4M · sent Jun 18 11:30"), status: "ok" },
        { label: b("Okundu", "Read"), value: b("18 Haz 14:42 · alıcı açtı", "Jun 18 14:42 · buyer opened"), status: "ok" },
        { label: b("Yanıt", "Response"), value: b("5 gündür yok · son temas 18 Haz", "None for 5 days · last contact Jun 18"), status: "action" },
        { label: b("Kapasite Tutma", "Capacity Hold"), value: b("Günlük €800 · 5 gün = €4.000", "€800/day · 5 days = €4,000"), status: "action" },
      ],
      note: b(
        "Alıcının e-postayı okuduğu ama yanıt vermediği kayıtta. 5 gün beklemenin maliyeti görünür. Karar dakikada verilebilir.",
        "Buyer read the email but didn't reply — visible in the record. Cost of 5-day wait is visible. Decision can be made in minutes.",
      ),
    },
  },

  /* ══ 13 SAMPLE APPROVAL ═══════════════════════════════════════════════════ */
  {
    id: "numune-onayi",
    num: "13",
    cat: b("Onay", "Approval"),
    catColor: "bg-purple-50 text-purple-700 border-purple-200",
    title: b(
      "Numune reddedildi. Sipariş askıda. Neden reddedildi?",
      "Sample rejected. Order on hold. Why was it rejected?",
    ),
    sub: b(
      "Alıcı numuneyi reddetti — ama red nedeni net değil, yeni numune süreci baştan mı?",
      "Buyer rejected the sample — but rejection reason is unclear, does the new sample process start over?",
    ),
    storyboard: [
      { icon: "📦", label: b("Numune gönderildi", "Sample sent"), tone: "start" },
      { icon: "🔴", label: b("Alıcı reddetti", "Buyer rejected"), tone: "mid" },
      { icon: "📝", label: b("Red nedeni belirsiz", "Rejection reason unclear"), tone: "warn" },
      { icon: "🔄", label: b("Süreç baştan mı?", "Process start over?"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Satış / Sales", via: "WhatsApp", text: b("Numune gönderildi mi? Alıcı bekliyor.", "Was the sample sent? Buyer is waiting.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Numune geldi ama renk uyuşmuyor. Ne yapacağız?", "Sample arrived but colour doesn't match. What do we do?") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("Tedarikçiye hangi rengi söyledik? Pantone kodu neydi?", "Which colour did we tell the supplier? What was the Pantone code?") },
        { from: "Tedarikçi / Supplier", via: "WhatsApp", text: b("Bize Pantone 286 denildi, onu gönderdik.", "We were told Pantone 286, that's what we sent.") },
      ],
      result: b(
        "Sipariş askıya alındı. Pantone kodu nereden geldi — herkes birbirine bakıyor.",
        "Order suspended. Where the Pantone code came from — everyone looking at each other.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Tekstil · Hollandalı alıcı · €155.000", "Textile · Dutch buyer · €155,000"),
      stage: b("Numune Süreci", "Sample Process"),
      rows: [
        { label: b("Numune 1", "Sample 1"), value: b("Reddedildi · renk uyumsuzluğu", "Rejected · colour mismatch"), status: "action" },
        { label: b("Red Notu", "Rejection Note"), value: b("Alıcı: 'Pantone 286 değil 300 olmalı'", "Buyer: 'Should be Pantone 300 not 286'"), status: "warn" },
        { label: b("Numune 2", "Sample 2"), value: b("Pantone 300 · tedarikçide hazırlanıyor", "Pantone 300 · being prepared at supplier"), status: "warn" },
        { label: b("Sipariş", "Order"), value: b("Numune 2 onayına bağlı · beklemede", "Pending sample 2 approval"), status: "action" },
      ],
      note: b(
        "Numune 1'in neden reddedildiği ve numune 2'de hangi Pantone kodunun kullanılacağı kayıtta. Tedarikçiye tekrar açıklamak gerekmiyor.",
        "Why sample 1 was rejected and which Pantone code sample 2 uses — in the record. No need to explain everything to supplier again.",
      ),
    },
  },

  /* ══ 14 PRICE DISPUTE ════════════════════════════════════════════════════ */
  {
    id: "fiyat-anlasmazligi",
    num: "14",
    cat: b("Ödeme", "Payment"),
    catColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: b(
      "Alıcı eski FCO üzerinden sipariş veriyor.",
      "Buyer is placing order based on old FCO.",
    ),
    sub: b(
      "Üç teklif versiyonu gönderildi — alıcı en eski versiyonu geçerli sayarak sipariş veriyor.",
      "Three offer versions were sent — buyer is treating the oldest as current and placing an order.",
    ),
    storyboard: [
      { icon: "💵", label: b("FCO v1: $980/ton", "FCO v1: $980/ton"), tone: "start" },
      { icon: "💵", label: b("FCO v3: $1.020/ton", "FCO v3: $1,020/ton"), tone: "mid" },
      { icon: "💳", label: b("Alıcı $980 sipariş", "Buyer orders at $980"), tone: "warn" },
      { icon: "⚖️", label: b("Kim haklı?", "Who is right?"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "Alıcı / Buyer", via: "Email", text: b("FCO'daki fiyat üzerinden sipariş veriyorum: $980/ton.", "Placing order at the FCO price: $980/ton.") },
        { from: "Siz / You", via: "Email", text: b("Hayır, revize FCO $1.020/ton'du. Revizeyi kabul etmiştiniz.", "No, the revised FCO was $1,020/ton. You had accepted the revision.") },
        { from: "Alıcı / Buyer", via: "Email", text: b("Hangi revize? Bize gelmedi. Son belge $980.", "Which revision? We didn't receive it. Our last document says $980.") },
        { from: "Hukuk / Legal", via: "WhatsApp", text: b("Revize FCO gönderildi mi? İspatı var mı?", "Was the revised FCO sent? Do we have proof?") },
      ],
      result: b(
        "$40/ton × 1.200 ton = $48.000 fark. İşlem askıya alındı. Güven sorunu.",
        "$40/ton × 1,200 tons = $48,000 difference. Deal suspended. Trust damaged.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ'ta durum:", "Status in ORTAQ:"),
      dealLabel: b("Demir Çelik · Brezilya alıcı · $1.224.000", "Iron & Steel · Brazilian buyer · $1,224,000"),
      stage: b("FCO Versiyonu", "FCO Version"),
      rows: [
        { label: b("FCO v1", "FCO v1"), value: b("$980/ton · alıcı kabul etmedi", "$980/ton · buyer rejected"), status: "warn" },
        { label: b("FCO v2", "FCO v2"), value: b("$1.010/ton · revize · 10 Haz", "$1,010/ton · revised · Jun 10"), status: "warn" },
        { label: b("FCO v3", "FCO v3"), value: b("$1.020/ton · alıcı 14 Haz onayladı", "$1,020/ton · buyer approved Jun 14"), status: "ok" },
        { label: b("Geçerli", "Current"), value: b("FCO v3 · iki taraf kabul · imzalı", "FCO v3 · both accepted · signed"), status: "ok" },
      ],
      note: b(
        "Her teklifin tarihi, versiyonu ve onay durumu kayıtta. 'Bize gelmedi' tartışması dakikada kapanıyor.",
        "Every offer's date, version and approval status is on record. 'We didn't receive it' dispute closes in minutes.",
      ),
    },
  },

  /* ══ 15 EXECUTIVE MORNING REVIEW ═════════════════════════════════════════ */
  {
    id: "yonetici-sabah-ozeti",
    num: "15",
    cat: b("Portföy", "Portfolio"),
    catColor: "bg-slate-100 text-slate-700 border-slate-200",
    title: b(
      "Genel Müdür saat 08:30'da 4 kişiyi aradı. Hâlâ tam tablo yok.",
      "General Manager called 4 people at 08:30. Still no complete picture.",
    ),
    sub: b(
      "12 aktif işlem var. Hangisi ilerliyor? Hangisi takılı? Bugün müdahale gereken var mı?",
      "12 active deals. Which are moving? Which are stuck? Does anything need attention today?",
    ),
    storyboard: [
      { icon: "☕", label: b("GM sabah masasında", "GM at morning desk"), tone: "start" },
      { icon: "📱", label: b("4 kişi arandı", "4 people called"), tone: "mid" },
      { icon: "❓", label: b("Hâlâ tam tablo yok", "Still no complete picture"), tone: "warn" },
      { icon: "⏰", label: b("Toplantı saati geldi", "Meeting time arrived"), tone: "hot" },
    ],
    chaos: {
      caption: b("Şu an olanlar:", "What is happening now:"),
      msgs: [
        { from: "GM", via: "WhatsApp", text: b("Çelik işi nerede? SGS onaylandı mı?", "Where's the steel deal? Was SGS approved?") },
        { from: "Satış / Sales", via: "WhatsApp", text: b("Çelik bekleniyor, kahve işi de zor görünüyor.", "Steel is pending, coffee deal also looks difficult.") },
        { from: "GM", via: "WhatsApp", text: b("Kahvede ne sorun var?", "What's the problem with coffee?") },
        { from: "Ops", via: "WhatsApp", text: b("SGS için numune gitmedi daha.", "Sample for SGS hasn't been sent yet.") },
      ],
      result: b(
        "GM 3 kişiyi aradı. Hâlâ tam tablo yok. Toplantı saati geliyor.",
        "GM called 3 people. Still no complete picture. Meeting time arrived.",
      ),
    },
    ortaq: {
      caption: b("ORTAQ portföy özeti:", "ORTAQ portfolio summary:"),
      dealLabel: b("Portföy · 12 Aktif İşlem", "Portfolio · 12 Active Deals"),
      stage: b("Sabah Özeti", "Morning Summary"),
      rows: [
        { label: b("Çelik · Alman alıcı", "Steel · German buyer"), value: b("SGS bekleniyor · alıcı tarafta", "SGS pending · buyer side"), status: "warn" },
        { label: b("Kahve · Japon alıcı", "Coffee · Japanese buyer"), value: b("Numune gönderilmedi · bizde", "Sample not sent · our side"), status: "action" },
        { label: b("Tekstil · Körfez alıcı", "Textile · Gulf buyer"), value: b("Kapandı · ödeme alındı", "Closed · payment received"), status: "ok" },
        { label: b("Makine · Taylandlı alıcı", "Machinery · Thai buyer"), value: b("Sözleşme imzalanıyor", "Contract being signed"), status: "warn" },
      ],
      note: b(
        "GM sabah 08:30'da kimseyi aramadan 12 işlemin durumunu görüyor. Hangisine müdahale lazım — belli.",
        "GM sees all 12 deals at 08:30 without calling anyone. Which needs attention — clear.",
      ),
    },
  },
];

/* ─── Feature discovery layer — Sprint 3 ─────────────────────────────────
   Each feature maps to a specific /urun module.
   Descriptions are taken verbatim from those module tab descriptions.
   SCENARIO_FEATURES assigns the minimum relevant features per scenario.     */

interface FeatureItem {
  name: B;
  desc: B;
  href: string;
}

/** Canonical feature catalogue — sourced from /urun tab content only. */
const FT = {
  versions: {
    name: b("Versiyon kontrolü", "Version control"),
    desc: b(
      "Hangisi geçerli, kim gördü, alıcıyla ne paylaşıldı — versiyonlar kayıtta.",
      "Which version is current, who saw it, what was shared — on record.",
    ),
    href: "/urun#belge-merkezi",
  },
  docOpen: {
    name: b("Belge açılma takibi", "Document open tracking"),
    desc: b(
      "Kim hangi belgeyi ne zaman açtı — alıcı dahil, geri alınamaz kayıtta.",
      "Who opened which document and when — including buyer, irrevocable record.",
    ),
    href: "/urun#onaylar",
  },
  approval: {
    name: b("Onay akışı", "Approval flow"),
    desc: b(
      "Resmi onay döngüsü. Red ve revizyon zorunlu not gerektirir.",
      "Formal approval cycle. Rejection requires a mandatory note.",
    ),
    href: "/urun#onaylar",
  },
  responsibility: {
    name: b("Sorumluluk takibi", "Responsibility tracking"),
    desc: b(
      "'Sıra kimde' kolonu — kimin harekete geçmesi gerektiği her aşamada görünür.",
      "'Whose turn' column — whose action is needed is visible at every stage.",
    ),
    href: "/urun#portfoy",
  },
  portfolio: {
    name: b("Portföy görünümü", "Portfolio view"),
    desc: b(
      "Sabah 60 saniyede tüm işlemlerin durumu. Risk sırasına göre.",
      "All deal statuses in 60 seconds every morning. Sorted by risk.",
    ),
    href: "/urun#portfoy",
  },
  counterparty: {
    name: b("Karşı Taraf görünümü", "Counterparty view"),
    desc: b(
      "Alıcının tam olarak ne gördüğü. Dahili notlar gerçekten yok — bulanık değil, yok.",
      "Exactly what the buyer sees. Internal notes truly don't exist — not blurred, not there.",
    ),
    href: "/urun#karsi-taraf",
  },
  audit: {
    name: b("Denetim izi", "Audit trail"),
    desc: b(
      "Her olayın kalıcı kaydı. Kim ne zaman ne yaptı — geri alınamaz.",
      "Permanent record of every event. Who did what, when — irrevocable.",
    ),
    href: "/urun#denetim-izi",
  },
  mobile: {
    name: b("Mobil bildirimler", "Mobile alerts"),
    desc: b(
      "30 saniyede son durum. Onay mobilden tamamlanır.",
      "30-second status check. Approvals completed from mobile.",
    ),
    href: "/urun#mobil",
  },
} satisfies Record<string, FeatureItem>;

interface ScenarioFeatureData {
  features: FeatureItem[];
  cta: { label: B; href: string };
}

/**
 * Minimum relevant features per scenario.
 * Rule: only features that directly participated in resolving the scenario.
 * Rule: differentiate across scenarios — avoid identical feature sets.
 */
const SCENARIO_FEATURES: Record<string, ScenarioFeatureData> = {
  /* 01 — Buyer hasn't opened SGS. Vessel departing. */
  "sgs-bekleniyor": {
    features: [FT.docOpen, FT.responsibility],
    cta: {
      label: b("Belge açılma takibini üründe görün →", "See document open tracking in the product →"),
      href: "/urun#onaylar",
    },
  },
  /* 02 — Inspection appointment pending, shipment on hold. */
  "muayene-bekleniyor": {
    features: [FT.approval, FT.responsibility],
    cta: {
      label: b("Onay akışını üründe görün →", "See approval flow in the product →"),
      href: "/urun#onaylar",
    },
  },
  /* 03 — Finance can't see LC status without calling sales. */
  "lc-gecikmesi": {
    features: [FT.responsibility, FT.portfolio],
    cta: {
      label: b("Portföy görünümünü üründe görün →", "See portfolio view in the product →"),
      href: "/urun#portfoy",
    },
  },
  /* 04 — Version dispute. Proof of which SPA was sent. */
  "yanlis-sozlesme-versiyonu": {
    features: [FT.versions, FT.audit],
    cta: {
      label: b("Versiyon kontrolünü üründe görün →", "See version control in the product →"),
      href: "/urun#belge-merkezi",
    },
  },
  /* 05 — Payment terms understood differently. LC vs TT dispute. */
  "odeme-belirsizligi": {
    features: [FT.approval, FT.audit],
    cta: {
      label: b("Onay akışını üründe görün →", "See approval flow in the product →"),
      href: "/urun#onaylar",
    },
  },
  /* 06 — BL date changed, buyer sees only current version. */
  "sevkiyat-tarihi-degisti": {
    features: [FT.versions, FT.counterparty],
    cta: {
      label: b("Versiyon kontrolünü üründe görün →", "See version control in the product →"),
      href: "/urun#belge-merkezi",
    },
  },
  /* 07 — BL missing, demurrage running, delay reason unknown. */
  "bl-eksik": {
    features: [FT.audit, FT.responsibility],
    cta: {
      label: b("Denetim izini üründe görün →", "See audit trail in the product →"),
      href: "/urun#denetim-izi",
    },
  },
  /* 08 — Finance approval missing, document stuck for 4 days. */
  "onay-eksik": {
    features: [FT.approval, FT.docOpen],
    cta: {
      label: b("Onay akışını üründe görün →", "See approval flow in the product →"),
      href: "/urun#onaylar",
    },
  },
  /* 09 — 10 active deals. Which to prioritise? */
  "coklu-islem": {
    features: [FT.portfolio, FT.responsibility],
    cta: {
      label: b("Portföy görünümünü üründe görün →", "See portfolio view in the product →"),
      href: "/urun#portfoy",
    },
  },
  /* 10 — Own team has different prices, dates, terms. */
  "ic-karisiklik": {
    features: [FT.versions, FT.audit],
    cta: {
      label: b("Versiyon kontrolünü üründe görün →", "See version control in the product →"),
      href: "/urun#belge-merkezi",
    },
  },
  /* 11 — Supplier 15 days late. Buyer doesn't know. */
  "tedarikci-gecikmesi": {
    features: [FT.counterparty, FT.audit],
    cta: {
      label: b("Karşı Taraf görünümünü üründe görün →", "See counterparty view in the product →"),
      href: "/urun#karsi-taraf",
    },
  },
  /* 12 — Buyer read the offer, didn't reply for 5 days. */
  "alici-yanit-vermiyor": {
    features: [FT.docOpen, FT.responsibility],
    cta: {
      label: b("Belge açılma takibini üründe görün →", "See document open tracking in the product →"),
      href: "/urun#onaylar",
    },
  },
  /* 13 — Sample rejected. Rejection reason and revision tracked. */
  "numune-onayi": {
    features: [FT.approval, FT.audit],
    cta: {
      label: b("Onay akışını üründe görün →", "See approval flow in the product →"),
      href: "/urun#onaylar",
    },
  },
  /* 14 — FCO version dispute. $48K price difference. */
  "fiyat-anlasmazligi": {
    features: [FT.versions, FT.audit],
    cta: {
      label: b("Versiyon kontrolünü üründe görün →", "See version control in the product →"),
      href: "/urun#belge-merkezi",
    },
  },
  /* 15 — GM calls 4 people at 08:30. Still no complete picture. */
  "yonetici-sabah-ozeti": {
    features: [FT.portfolio, FT.responsibility, FT.mobile],
    cta: {
      label: b("Portföy görünümünü üründe görün →", "See portfolio view in the product →"),
      href: "/urun#portfoy",
    },
  },
};

/* ─── Category filter config ─────────────────────────────────────────────── */

const CATS = [
  { key: "Tümü",      en: "All"          },
  { key: "Belge",     en: "Document"     },
  { key: "Ödeme",     en: "Payment"      },
  { key: "Onay",      en: "Approval"     },
  { key: "Zamanlama", en: "Schedule"     },
  { key: "İletişim",  en: "Communication"},
  { key: "Portföy",   en: "Portfolio"    },
];

/* ─── Status styles ──────────────────────────────────────────────────────── */

const STATUS_STYLE = {
  ok:     { dot: "bg-emerald-400", text: "text-emerald-700 font-bold" },
  warn:   { dot: "bg-amber-400",   text: "text-amber-700 font-semibold" },
  action: { dot: "bg-red-400",     text: "text-red-700 font-bold" },
} as const;

const FRAME_TONE = {
  start: "bg-slate-50 border-slate-200 text-slate-600",
  mid:   "bg-slate-50 border-slate-200 text-slate-700",
  warn:  "bg-amber-50 border-amber-200 text-amber-700",
  hot:   "bg-red-50 border-red-200 text-red-700",
} as const;

const VIA_COLOR: Record<string, string> = {
  WhatsApp: "bg-[#075E54]",
  Email:    "bg-[#0078D4]",
  Phone:    "bg-gray-500",
};

/* ─── Main view ──────────────────────────────────────────────────────────── */

export function SenaryolarView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");
  const L: Lang = isTR ? "tr" : "en";

  const [activeCat, setActiveCat] = useState("Tümü");

  const filtered = activeCat === "Tümü"
    ? SCENARIOS
    : SCENARIOS.filter(s => s.cat.tr === activeCat);

  return (
    <PublicShell stickyCta={false}>
      <StoryBar />

      <div className="bg-[#faf9f7]">

        {/* ── Page header ────────────────────────────────────────────── */}
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {isTR ? "Kullanım Senaryoları" : "Use Cases"}
              </p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink leading-[1.05] sm:text-[2.5rem]">
                {isTR
                  ? <>Bu durumlardan birini<br /><span className="text-ortaq-trust">yaşadınız mı?</span></>
                  : <>Have you experienced<br /><span className="text-ortaq-trust">any of these situations?</span></>
                }
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "15 gerçek ticari senaryo. Her biri tanıdık gelmeli. Her birinde ORTAQ farkı gösterildi."
                  : "15 real commercial scenarios. Each should feel familiar. Each shows what ORTAQ changes."}
              </p>

              {/* Category filter */}
              <div className="mt-6 flex flex-wrap gap-2">
                {CATS.map(cat => {
                  const count = cat.key === "Tümü"
                    ? SCENARIOS.length
                    : SCENARIOS.filter(s => s.cat.tr === cat.key).length;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCat(cat.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.6875rem] font-semibold transition-colors",
                        activeCat === cat.key
                          ? "border-ortaq-trust bg-ortaq-trust/10 text-ortaq-trust"
                          : "border-ortaq-border bg-white text-ortaq-ink-soft hover:border-ortaq-trust/40 hover:text-ortaq-trust",
                      )}
                    >
                      {isTR ? cat.key : cat.en}
                      <span className={cn(
                        "rounded-full px-1.5 py-px text-[0.5rem] font-bold",
                        activeCat === cat.key
                          ? "bg-ortaq-trust/20 text-ortaq-trust"
                          : "bg-ortaq-border text-ortaq-ink-soft",
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>

        {/* ── Scenario cards ─────────────────────────────────────────── */}
        <Container wide>
          <div className="py-6 space-y-6">
            {filtered.map(s => (
              <ScenarioCard
                key={s.id}
                s={s}
                L={L}
                isTR={isTR}
                featureData={SCENARIO_FEATURES[s.id]}
              />
            ))}
          </div>
        </Container>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <div className="border-t border-ortaq-border bg-ortaq-ink">
          <Container wide>
            <div className="py-12 sm:py-16">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[1.5rem] font-bold tracking-[-0.025em] text-ortaq-cream leading-tight sm:text-[1.875rem]">
                    {isTR
                      ? "Bu durumlardan biriyle mi karşı karşıyasınız?"
                      : "Are you facing one of these situations?"}
                  </h2>
                  <p className="mt-2 text-[0.9375rem] text-ortaq-cream/60">
                    {isTR
                      ? "Demo isteyin. Aktif bir işleminizi getirin. 30 dakika."
                      : "Request a demo. Bring one active deal. 30 minutes."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Link
                    href="/neden-ortaq"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.875rem] font-medium text-ortaq-cream/70 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                  >
                    {isTR ? "Neden ORTAQ →" : "Why ORTAQ →"}
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-deep active:scale-[0.98]"
                  >
                    {isTR ? "Demo İsteyin" : "Request Demo"}
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>

      </div>
    </PublicShell>
  );
}

/* ─── Scenario card ──────────────────────────────────────────────────────── */

function ScenarioCard({
  s, L, isTR, featureData,
}: {
  s: Scenario;
  L: Lang;
  isTR: boolean;
  featureData?: ScenarioFeatureData;
}) {
  return (
    <div
      id={s.id}
      className="overflow-hidden rounded-2xl border border-ortaq-border bg-white shadow-sm scroll-mt-24"
    >
      {/* ── Storyboard strip ──────────────────────────────────────── */}
      <div className="border-b border-ortaq-border bg-[#faf9f7] px-5 py-5 sm:px-7">
        <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-0.5">
          {s.storyboard.map((frame, i) => (
            <div key={i} className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <div className={cn(
                "flex flex-col items-center justify-center rounded-xl border px-3 py-3 sm:px-4 text-center min-w-[72px] sm:min-w-[88px]",
                FRAME_TONE[frame.tone],
              )}>
                <span className="text-[1.625rem] leading-none sm:text-[1.875rem]">{frame.icon}</span>
                <span className="mt-1.5 text-[0.5rem] font-semibold leading-tight sm:text-[0.5625rem]">
                  {frame.label[L]}
                </span>
              </div>
              {i < s.storyboard.length - 1 && (
                <span className="shrink-0 text-[0.6875rem] font-bold text-ortaq-ink-soft/30">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Card header ────────────────────────────────────────────── */}
      <div className="px-5 pb-1 pt-5 sm:px-7">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] font-bold text-ortaq-ink-soft/40">{s.num}</span>
          <span className={cn("rounded-full border px-2 py-0.5 text-[0.5rem] font-bold", s.catColor)}>
            {s.cat[L]}
          </span>
        </div>
        <h2 className="text-[1.0625rem] font-bold text-ortaq-ink leading-snug sm:text-[1.25rem]">
          {s.title[L]}
        </h2>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ortaq-ink-muted">
          {s.sub[L]}
        </p>
      </div>

      {/* ── Chaos vs ORTAQ ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:pb-5">

        {/* LEFT — Current reality (chaos) */}
        <div className="overflow-hidden rounded-xl border border-red-100 bg-[#FDF9F8]">
          {/* Header */}
          <div className="border-b border-red-100 bg-red-50 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-red-600">
                {s.chaos.caption[L]}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 p-4">
            {s.chaos.msgs.map((msg, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full bg-ortaq-ink text-[0.33rem] font-bold text-ortaq-cream">
                  {msg.from.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[0.4375rem] font-bold text-ortaq-ink">{msg.from}</span>
                    <span className={cn("rounded px-1 py-px text-[0.35rem] font-bold text-white", VIA_COLOR[msg.via] ?? "bg-gray-500")}>
                      {msg.via}
                    </span>
                  </div>
                  <p className="text-[0.5625rem] leading-snug text-ortaq-ink-soft">{msg.text[L]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="border-t border-red-100 bg-red-50/60 px-4 py-3">
            <div className="flex items-start gap-1.5">
              <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              <p className="text-[0.5625rem] font-semibold leading-snug text-red-700">
                {s.chaos.result[L]}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — ORTAQ UI mockup */}
        <div className="overflow-hidden rounded-xl border border-ortaq-trust/25 bg-white shadow-[0_0_0_1px_rgba(20,90,70,0.06)]">

          {/* Window chrome */}
          <div className="flex items-center gap-1.5 border-b border-ortaq-trust/10 bg-ortaq-trust/[0.04] px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-red-400/60" />
            <span className="h-2 w-2 rounded-full bg-amber-400/60" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
            <span className="ml-2 text-[0.4375rem] text-ortaq-ink-soft/50">ORTAQ</span>
          </div>

          {/* Deal header */}
          <div className="border-b border-ortaq-trust/10 bg-ortaq-trust/[0.03] px-4 py-3">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-ortaq-trust/50">
              {s.ortaq.caption[L]}
            </p>
            <p className="mt-0.5 text-[0.625rem] font-bold text-ortaq-ink leading-snug">
              {s.ortaq.dealLabel[L]}
            </p>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-ortaq-trust/10 px-2 py-0.5">
              <span className="h-1 w-1 rounded-full bg-ortaq-trust" />
              <span className="text-[0.4375rem] font-bold text-ortaq-trust">{s.ortaq.stage[L]}</span>
            </div>
          </div>

          {/* Data rows */}
          <div className="divide-y divide-ortaq-border/40">
            {s.ortaq.rows.map((row, i) => {
              const st = STATUS_STYLE[row.status];
              return (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", st.dot)} />
                    <span className="text-[0.4375rem] text-ortaq-ink-soft truncate">{row.label[L]}</span>
                  </div>
                  <span className={cn("shrink-0 text-right text-[0.5rem]", st.text)}>
                    {row.value[L]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Insight note */}
          <div className="border-t border-ortaq-trust/10 bg-ortaq-trust/[0.04] px-4 py-3">
            <p className="text-[0.5625rem] leading-relaxed text-ortaq-trust font-medium">
              {s.ortaq.note[L]}
            </p>
          </div>
        </div>
      </div>

      {/* ── Feature discovery box — visually attached, dark band ───── */}
      {featureData && (
        <FeatureDiscoveryBox data={featureData} L={L} isTR={isTR} />
      )}
    </div>
  );
}

/* ─── Feature discovery box ──────────────────────────────────────────────── */

function FeatureDiscoveryBox({
  data, L, isTR,
}: {
  data: ScenarioFeatureData;
  L: Lang;
  isTR: boolean;
}) {
  return (
    <div className="border-t border-ortaq-cream/10 bg-ortaq-ink border-l-[3px] border-l-ortaq-trust">
      <div className="px-5 py-4 sm:px-7">

        {/* Header */}
        <p className="mb-3 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
          {isTR ? "ORTAQ burada ne yaptı?" : "What did ORTAQ do here?"}
        </p>

        {/* Feature list */}
        <div className="space-y-2.5">
          {data.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-ortaq-trust" />
              <div className="min-w-0">
                <span className="text-[0.5625rem] font-bold text-ortaq-cream">
                  {feat.name[L]}
                </span>
                <span className="mx-1.5 text-ortaq-cream/20">·</span>
                <span className="text-[0.5rem] leading-snug text-ortaq-cream/50">
                  {feat.desc[L]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4 border-t border-ortaq-cream/[0.07] pt-3">
          <Link
            href={data.cta.href}
            className="text-[0.5625rem] font-semibold text-ortaq-trust/80 transition-colors hover:text-ortaq-trust"
          >
            {data.cta.label[L]}
          </Link>
        </div>

      </div>
    </div>
  );
}
