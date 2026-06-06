"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Section";
import { PublicShell } from "@/components/layout/PublicShell";
import { StoryBar } from "@/components/layout/StoryBar";

/**
 * SenaryolarView — Real usage scenarios.
 *
 * Goal: Visitor must immediately recognize a situation they have experienced.
 * Not features. Not software explanations. Real business moments.
 *
 * Language: Real Turkish business conversation. Not startup. Not consultant.
 *
 * 7 scenarios:
 *   1. SGS sonucu bekleniyor, gemi kalkış yaklaşıyor
 *   2. Birden fazla sözleşme versiyonu dolaşıyor
 *   3. LC süreci uzuyor, finans ekibi bilgi bekliyor
 *   4. Sevkiyat tarihi değişiyor, herkes farklı tarih biliyor
 *   5. Alıcı ve satıcı farklı bilgiye sahip
 *   6. Finans ekibi ödeme durumunu takip ediyor
 *   7. Yönetici hangi işlemin takıldığını görmek istiyor
 *
 * Each scenario: situation → current reality (chaotic) → ORTAQ state (clear)
 */

interface Message {
  from: string;
  to?: string;
  via: string;
  text: string;
  viaColor?: string;
}

interface OrtaqRow {
  label: string;
  value: string;
  status: "ok" | "warn" | "action";
}

interface Scenario {
  number: string;
  title: string;
  situation: string;
  chaos: {
    caption: string;
    messages: Message[];
    result: string;
  };
  ortaq: {
    caption: string;
    rows: OrtaqRow[];
    note: string;
  };
}

const viaColors: Record<string, string> = {
  WhatsApp:   "bg-[#075E54]",
  WeChat:     "bg-[#07C160]",
  "E-posta":  "bg-[#0078D4]",
  Email:      "bg-[#0078D4]",
  Telefon:    "bg-gray-500",
  Phone:      "bg-gray-500",
};

export function SenaryolarView() {
  const { i18n } = useTranslation();
  const isTR = (i18n.language ?? "tr").startsWith("tr");

  const scenarios: Scenario[] = isTR ? [

    /* ── 1 ─────────────────────────────────────────────────── */
    {
      number: "01",
      title: "SGS sonucu bekleniyor. Gemi 3 gün sonra kalkıyor.",
      situation:
        "Sevkiyat için SGS muayene raporu gerekiyor. Alıcı onaylamamış. Gemi 3 gün sonra kalkıyor. Siz ne zaman onaylayacaklarını, onlar ne zaman gemi kalkacağını bilmiyor.",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "CEO", to: "Operasyon", via: "WhatsApp", text: "SGS onayı geldi mi?" },
          { from: "Operasyon", to: "Alıcı", via: "E-posta", text: "SGS raporunu onayladınız mı? Gemi 3 gün sonra kalkıyor." },
          { from: "Alıcı", to: "Operasyon", via: "E-posta", text: "Hangi SGS raporu? Bize ulaşmadı." },
          { from: "Operasyon", to: "CEO", via: "WhatsApp", text: "Raporu göndermemişiz. Tekrar gönderiyorum." },
        ],
        result: "Gün kaybedildi. Gemi kaçabilir. Kimse kimin sorumlu olduğunu bilmiyordu.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "SGS Raporu",    value: "TÜV Thailand · yüklendi",         status: "ok"     },
          { label: "Alıcı Onayı",   value: "Bekleniyor · 2 gündür açılmadı",  status: "warn"   },
          { label: "Gemi Kalkışı",  value: "3 gün sonra · 28 Haziran",        status: "action" },
          { label: "Sıradaki",      value: "Alıcı onayını takip et",          status: "action" },
        ],
        note: "Alıcı SGS raporunu açmadığını ORTAQ kaydından görüyorsunuz. Aramadan önce bunu biliyorsunuz.",
      },
    },

    /* ── 2 ─────────────────────────────────────────────────── */
    {
      number: "02",
      title: "Alıcı SPA v10 diyor. Siz SPA v12 diyorsunuz.",
      situation:
        "Sözleşme müzakere edildi. Birkaç revizyon yapıldı. Alıcı eski bir versiyona atıfta bulunarak ödeme tutarını sorguluyor. Siz v12 imzalı diyorsunuz, alıcı v10 güncel diye ısrar ediyor.",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "Alıcı", to: "Siz", via: "E-posta", text: "SPA madde 7.2 uyarınca fiyat X dolar olmalı." },
          { from: "Siz", to: "Alıcı", via: "E-posta", text: "Hayır, son revizyon v12'de fiyat Y dolar." },
          { from: "Alıcı", to: "Siz", via: "E-posta", text: "Bende v12 yok. Bize sadece v10 geldi." },
          { from: "Hukuk", to: "Siz", via: "WhatsApp", text: "v12'yi ne zaman gönderdik? İspatımız var mı?" },
        ],
        result: "Anlaşmazlık. Zaman kaybı. Ödeme gecikiyor. Kim ne zaman ne göndermiş belli değil.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "SPA v10",    value: "Eski sürüm · geçersiz",                     status: "warn" },
          { label: "SPA v11",    value: "Eski sürüm · geçersiz",                     status: "warn" },
          { label: "SPA v12",    value: "Geçerli sürüm · her iki taraf imzalı",      status: "ok"   },
          { label: "Gönderim",   value: "v12 · 10 Haziran 14:33 · iki tarafa",       status: "ok"   },
        ],
        note: "Hangi versiyonun geçerli olduğu, kim ne zaman imzaladığı — ORTAQ kaydında tartışmasız.",
      },
    },

    /* ── 3 ─────────────────────────────────────────────────── */
    {
      number: "03",
      title: "LC süreci uzuyor. Finans ekibi ne zaman ödeme geleceğini bilmiyor.",
      situation:
        "SGS onaylandı. Sözleşme imzalı. Ama alıcı tarafın bankası LC'yi hâlâ açmamış. Finans ekibiniz ödemeyi bütçeye koymak istiyor ama ne zaman geleceği belli değil. Her sabah aynı soru: LC açıldı mı?",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "Finans", to: "Satış", via: "WhatsApp", text: "LC açıldı mı? Bütçeye yazacağım." },
          { from: "Satış",  to: "Alıcı",  via: "E-posta", text: "LC süreci nerede?" },
          { from: "Alıcı",  to: "Satış",  via: "E-posta", text: "Bankamız işliyor, bu hafta tamamlanır." },
          { from: "Satış",  to: "Finans", via: "WhatsApp", text: "Bu hafta diyorlar ama kesin değil." },
        ],
        result: "Her gün aynı soru. Her gün belirsiz cevap. Finans planlaması yapılamıyor.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "SGS",         value: "Onaylandı · 18 Haziran",             status: "ok"     },
          { label: "LC Durumu",   value: "HSBC Dubai · işlemde",               status: "warn"   },
          { label: "Tahmini",     value: "Bu hafta içinde · alıcı bildirdi",   status: "warn"   },
          { label: "Sıradaki",    value: "LC belgesi geldikçe kayda girecek",  status: "action" },
        ],
        note: "Finans ekibi satışa sormadan LC durumunu görüyor. Satış alıcıya yazmadan önceki durumu biliyor.",
      },
    },

    /* ── 4 ─────────────────────────────────────────────────── */
    {
      number: "04",
      title: "Sevkiyat tarihi değişti. Herkes farklı tarih biliyor.",
      situation:
        "Gemi kalkış tarihi değişti. Armatör yeni tarih bildirdi. Lojistik güncelledi ama bunu satışa, satış alıcıya, alıcı kendi deposuna söyledi mi? Zincirin neresinde bilgi koptu?",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "Lojistik", to: "Satış",   via: "WhatsApp", text: "Gemi 28 değil 2 Temmuz kalkıyor." },
          { from: "Alıcı",    to: "Siz",     via: "E-posta",  text: "Neden gümrük 28 Haziran yazmış? BL'de tarih yanlış." },
          { from: "Siz",      to: "Lojistik", via: "WhatsApp", text: "BL taslağı güncellenmedimi? Alıcı 28 sanıyor." },
          { from: "Lojistik", to: "Siz",     via: "WhatsApp", text: "BL taslağını Pazar günü güncelledim ama kim gönderdi?" },
        ],
        result: "Yanlış BL gümrüğe girdi. Alıcı ceza kesildi sanıyor. Düzeltme için fazladan gün kaybı.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "BL Taslak v2", value: "Geçerli · 2 Temmuz kalkışı",                   status: "ok"   },
          { label: "BL Taslak v1", value: "Eski · 28 Haziran kalkışı · geçersiz",         status: "warn" },
          { label: "Alıcıya",      value: "v2 gönderildi · 22 Haziran 09:14",             status: "ok"   },
          { label: "Gümrük",       value: "v2 üzerinden işlem yapacak",                   status: "ok"   },
        ],
        note: "Tarih değişikliği kayıta girildiğinde BL versiyonu güncellendi ve alıcıya otomatik bildirim yapıldı.",
      },
    },

    /* ── 5 ─────────────────────────────────────────────────── */
    {
      number: "05",
      title: "Alıcı ve satıcı farklı bir bilgiye sahip.",
      situation:
        "Fiyat müzakeresi sırasında alıcı bir rakam üzerinden hareket ediyor, siz başka bir rakam üzerinden. İkisi de kendi e-postasını doğru sanıyor. Hangisi geçerli? Kim son teklife olumlu yanıt verdi?",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "Alıcı", to: "Siz", via: "E-posta",  text: "FCO'daki fiyat üzerinden sipariş veriyorum: $980/ton." },
          { from: "Siz",   to: "Alıcı", via: "E-posta", text: "Hayır, revize FCO $1.020/ton'du. Revizeyi kabul etmiştiniz." },
          { from: "Alıcı", to: "Siz", via: "E-posta",  text: "Hangi revize? Bize gelmedi. Elimizdeki son belge $980." },
          { from: "Siz",   to: "Hukuk", via: "WhatsApp", text: "Revize FCO gönderildi mi? İspatı var mı elimizde?" },
        ],
        result: "Fiyat anlaşmazlığı. İşlem askıya alındı. Güven sorunu yaratıldı.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "FCO v1",  value: "$980/ton · Alıcı kabul etmedi",           status: "warn" },
          { label: "FCO v2",  value: "$1.020/ton · Revize · 12 Haziran",        status: "warn" },
          { label: "FCO v3",  value: "$1.020/ton · Alıcı onayladı · 14 Haziran",status: "ok"   },
          { label: "Geçerli", value: "FCO v3 · her iki taraf kabul",            status: "ok"   },
        ],
        note: "Her teklifin tarihi, versiyonu ve kimin onayladığı kayıtta. Anlaşmazlık dakikalar içinde çözülüyor.",
      },
    },

    /* ── 6 ─────────────────────────────────────────────────── */
    {
      number: "06",
      title: "Finans, ödeme durumunu takip etmeye çalışıyor.",
      situation:
        "İşlem kapandı. Şimdi soru şu: ödeme geldi mi? LC'ye dayalı ödeme mi, havale mi? Banka dokümanları tamam mı? Finans ekibi operasyona soruyor, operasyon satışa soruyor. Cevap zinciri uzuyor.",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "Finans",    to: "Operasyon", via: "WhatsApp", text: "Ödeme bilgisi var mı? LC sunuldu mu bankaya?" },
          { from: "Operasyon", to: "Satış",     via: "WhatsApp", text: "Alıcıdan ödeme nerede?" },
          { from: "Satış",     to: "Alıcı",     via: "E-posta",  text: "LC sunumunu yaptınız mı?" },
          { from: "Alıcı",     to: "Satış",     via: "E-posta",  text: "HSBC Dubai'ye 3 gün önce gönderdik." },
        ],
        result: "3 gün önce gönderilmiş ama siz bugün öğrendiniz. Muhasebe kayıtları gecikiyor.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "LC Sunumu",    value: "HSBC Dubai · 19 Haziran",          status: "ok"   },
          { label: "Banka",        value: "İnceleme süreci · 5-7 iş günü",   status: "warn" },
          { label: "Ödeme",        value: "Tahmini 26-28 Haziran",           status: "warn" },
          { label: "Muhasebe",     value: "Gelince otomatik güncellenir",    status: "ok"   },
        ],
        note: "Finans ekibi satışı ve operasyonu aramadan ödeme sürecini takip ediyor. Hepsi kayıtta.",
      },
    },

    /* ── 7 ─────────────────────────────────────────────────── */
    {
      number: "07",
      title: "Yönetici hangi işlemin takıldığını görmek istiyor.",
      situation:
        "Genel müdür sabah masasına oturdu. 12 aktif işlem var. Hangisi ilerliyor? Hangisi takılı? Hangisine bugün müdahale gerekiyor? Bu soruları cevaplamak için ya birini araması ya da toplantı yapması gerekiyor.",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "GM",        to: "Satış",     via: "WhatsApp", text: "Hanım, hangi işlemler var bugün?" },
          { from: "Satış",     to: "GM",         via: "WhatsApp", text: "Çelik işi bekleniyor, tekstil kapandı, kahve zor görünüyor." },
          { from: "GM",        to: "Operasyon", via: "WhatsApp", text: "Kahvede ne sorun var?" },
          { from: "Operasyon", to: "GM",         via: "WhatsApp", text: "SGS muayene için numune gitmedi daha." },
        ],
        result: "GM sabah 3 kişiyi aradı. Hâlâ tam tablo yok. Toplantı saati geliyor.",
      },
      ortaq: {
        caption: "ORTAQ'ta tablo:",
        rows: [
          { label: "Çelik · Alman alıcı",    value: "SGS bekleniyor · alıcı tarafta",  status: "warn"   },
          { label: "Kahve · Japon alıcı",     value: "Numune gönderilmedi · bizde",     status: "action" },
          { label: "Tekstil · Körfez alıcı",  value: "Kapandı · ödeme alındı",          status: "ok"     },
          { label: "Makine · Taylandlı alıcı",value: "Sözleşme imzalanıyor",            status: "warn"   },
        ],
        note: "GM sabah 08:30'da kimseyi aramadan 12 işlemin durumunu görüyor. Hangisine müdahale lazım — belli.",
      },
    },

    /* ── 8 ─────────────────────────────────────────────────── */
    {
      number: "08",
      title: "BL taslağı eksik. Alıcı gümrük işlemini başlatamıyor.",
      situation:
        "Sevkiyat yapıldı. Alıcı gümrük belgelerini hazırlamak istiyor ama BL taslağı hâlâ gelmedi. Kim kesiyor? Ne zaman teslim edilecek? Armatör mi bekliyor, banka mı? Alıcı her gün soruyor.",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "Alıcı",     to: "Siz",      via: "E-posta",  text: "BL taslağını gönderecek misiniz? Gümrük bekliyor." },
          { from: "Siz",       to: "Lojistik", via: "WhatsApp", text: "BL taslağı ne zaman geliyor? Alıcı şikayet ediyor." },
          { from: "Lojistik",  to: "Siz",      via: "WhatsApp", text: "Armatöre sorduk, bugün çıkar dediler. Neden gecikti bilmiyoruz." },
          { from: "Alıcı",     to: "Siz",      via: "E-posta",  text: "Hâlâ gelmedi. Depo tutma ücreti başladı." },
        ],
        result: "Alıcı depo masrafı ödüyor. BL'nin neden geciktiği bilinmiyor. Sizi aracı konumuna düşürdü.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "BL Taslak",     value: "Armatörde · hazırlanıyor",          status: "warn"   },
          { label: "Tahmini",       value: "Bugün 17:00 · armatör bildirdi",   status: "warn"   },
          { label: "Alıcıya bilgi", value: "Tahmini tarih iletildi",           status: "ok"     },
          { label: "Depo",          value: "1 gün · gecikme nedeni kayıtta",   status: "action" },
        ],
        note: "BL sürecinin nerede olduğu ve neden geciktiği kayıtta. Alıcıya sormadan önce cevabınız hazır.",
      },
    },

    /* ── 9 ─────────────────────────────────────────────────── */
    {
      number: "09",
      title: "Numune süreci uzadı. Sipariş onayı verilemiyor.",
      situation:
        "Alıcı numune istedi. Tedarikçi gönderdi mi? Alıcı aldı mı? Onayladı mı? Bu adımların her biri farklı kişide, farklı kanalda yürüyor. Sipariş onayı numune onayına bağlı ama süreç nerede durdu belli değil.",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "Satış",     to: "Tedarikçi", via: "WhatsApp", text: "Numune gönderildi mi? Alıcı bekliyor." },
          { from: "Tedarikçi", to: "Satış",     via: "WhatsApp", text: "Kargoya verdik, takip numarası ekte." },
          { from: "Satış",     to: "Alıcı",     via: "E-posta",  text: "Numune yolda, takip numarası: XYZ987." },
          { from: "Alıcı",     to: "Satış",     via: "E-posta",  text: "Numune geldi ama renk uyuşmuyor. Ne yapacağız?" },
        ],
        result: "Numune onaylanmadı. Siparişin devamı belirsiz. Tedarikçi yeni numune mi gönderecek bilinmiyor.",
      },
      ortaq: {
        caption: "ORTAQ'ta durum:",
        rows: [
          { label: "Numune 1",    value: "Gönderildi · alıcı reddetti · renk",     status: "action" },
          { label: "Numune 2",    value: "Tedarikçide hazırlanıyor",               status: "warn"   },
          { label: "Red nedeni",  value: "Renk uyumsuzluğu · alıcı notu kayıtta", status: "warn"   },
          { label: "Sipariş",     value: "Numune onayına bağlı · beklemede",      status: "action" },
        ],
        note: "Numune 1'in neden reddedildiği ve numune 2'nin nerede olduğu aynı kayıtta. Tedarikçiye tekrar açıklamak zorunda kalmıyorsunuz.",
      },
    },

    /* ── 10 ────────────────────────────────────────────────── */
    {
      number: "10",
      title: "Aynı anda 10 aktif işlem. Hangi birinden başlayacaksınız?",
      situation:
        "Sabah masanıza oturdunuz. 10 aktif işlem var. Bazıları SGS bekliyor. Bazılarında ödeme bu haftaya geliyor. Bir tanesi 3 gündür yanıtsız. Nereden başlayacağınızı bilmiyorsunuz çünkü hepsi farklı yerlerde yürüyor.",
      chaos: {
        caption: "Şu an olanlar:",
        messages: [
          { from: "GM",        to: "Satış",      via: "WhatsApp", text: "Bugün öncelikli işlem hangisi?" },
          { from: "Satış",     to: "GM",          via: "WhatsApp", text: "Çelik işi acil. Bir de tekstil zor görünüyor." },
          { from: "Finans",    to: "Siz",         via: "E-posta",  text: "Hangi işlemlerde ödeme bu ay bekleniyor?" },
          { from: "Operasyon", to: "Siz",         via: "WhatsApp", text: "3 farklı işlemde SGS onayı bekliyoruz." },
        ],
        result: "Her sabah aynı toplantı, aynı sorular, aynı belirsizlik. Karar vermek için bilgi toplamak zaman alıyor.",
      },
      ortaq: {
        caption: "ORTAQ'ta tablo:",
        rows: [
          { label: "Acil",        value: "2 işlem · 24 saattir yanıt yok",      status: "action" },
          { label: "Bu hafta",    value: "3 işlemde ödeme bekleniyor",          status: "warn"   },
          { label: "SGS bekliyor",value: "3 işlem · hepsinde alıcı tarafta",   status: "warn"   },
          { label: "İlerliyor",   value: "2 işlem · takip yeterli",            status: "ok"     },
        ],
        note: "10 işlemin durumu, hangisinin acil olduğu ve sıranın kimde olduğu sabah 5 dakikada görünüyor.",
      },
    },

  ] : [

    /* ── 1 EN ─────────────────────────────────────────────── */
    {
      number: "01",
      title: "SGS result pending. Vessel departs in 3 days.",
      situation:
        "SGS inspection report is required for shipment. Buyer has not approved it. Vessel departs in 3 days. You do not know when they will approve, they do not know when the vessel departs.",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "CEO",       to: "Operations", via: "WhatsApp", text: "Has the SGS approval arrived?" },
          { from: "Operations",to: "Buyer",       via: "Email",    text: "Have you approved the SGS report? Vessel departs in 3 days." },
          { from: "Buyer",     to: "Operations",  via: "Email",    text: "Which SGS report? We did not receive it." },
          { from: "Operations",to: "CEO",          via: "WhatsApp", text: "We did not send it. Resending now." },
        ],
        result: "A day was lost. The vessel may be missed. Nobody knew who was responsible.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "SGS Report",    value: "TÜV Thailand · uploaded",          status: "ok"     },
          { label: "Buyer Approval",value: "Pending · not opened for 2 days",  status: "warn"   },
          { label: "Vessel",        value: "3 days · June 28",                 status: "action" },
          { label: "Next",          value: "Follow up on buyer approval",      status: "action" },
        ],
        note: "You can see from the ORTAQ record that the buyer has not opened the SGS report. You know this before calling.",
      },
    },

    /* ── 2 EN ─────────────────────────────────────────────── */
    {
      number: "02",
      title: "Buyer says SPA v10. You say SPA v12.",
      situation:
        "Contract was negotiated. Several revisions were made. The buyer is questioning the payment amount by referring to an old version. You say v12 is signed, the buyer insists v10 is current.",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "Buyer",  to: "You",   via: "Email",    text: "Per SPA clause 7.2, price should be X dollars." },
          { from: "You",    to: "Buyer", via: "Email",    text: "No, the last revision in v12 has the price at Y dollars." },
          { from: "Buyer",  to: "You",   via: "Email",    text: "I do not have v12. Only v10 was sent to us." },
          { from: "Legal",  to: "You",   via: "WhatsApp", text: "When did we send v12? Do we have proof?" },
        ],
        result: "Dispute. Time lost. Payment delayed. Nobody knows who sent what and when.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "SPA v10",   value: "Old version · superseded",                    status: "warn" },
          { label: "SPA v11",   value: "Old version · superseded",                    status: "warn" },
          { label: "SPA v12",   value: "Current version · signed by both parties",    status: "ok"   },
          { label: "Sent",      value: "v12 · June 10 at 14:33 · to both parties",   status: "ok"   },
        ],
        note: "Which version is current, who signed when — indisputable in the ORTAQ record.",
      },
    },

    /* ── 3 EN ─────────────────────────────────────────────── */
    {
      number: "03",
      title: "LC process is dragging. Finance does not know when payment will arrive.",
      situation:
        "SGS was approved. Contract is signed. But the buyer's bank has still not opened the LC. Your finance team wants to budget the payment but does not know when it will arrive. Every morning the same question: has the LC been opened?",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "Finance", to: "Sales",  via: "WhatsApp", text: "Has the LC been opened? I need to record it in the budget." },
          { from: "Sales",   to: "Buyer",  via: "Email",    text: "Where is the LC process?" },
          { from: "Buyer",   to: "Sales",  via: "Email",    text: "Our bank is processing it, will be done this week." },
          { from: "Sales",   to: "Finance",via: "WhatsApp", text: "They say this week but it is not confirmed." },
        ],
        result: "Same question every day. Vague answer every day. Finance cannot plan.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "SGS",        value: "Approved · June 18",               status: "ok"     },
          { label: "LC Status",  value: "HSBC Dubai · in process",          status: "warn"   },
          { label: "Estimated",  value: "This week · buyer informed",       status: "warn"   },
          { label: "Next",       value: "LC document will be entered on arrival", status: "action" },
        ],
        note: "Finance sees the LC status without calling sales. Sales knows the current status before writing to the buyer.",
      },
    },

    /* ── 4 EN ─────────────────────────────────────────────── */
    {
      number: "04",
      title: "Shipment date changed. Everyone knows a different date.",
      situation:
        "The vessel departure date changed. The carrier notified logistics. Logistics updated their records but did they tell sales, did sales tell the buyer, did the buyer tell their own warehouse? Where in the chain did the information break?",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "Logistics", to: "Sales",     via: "WhatsApp", text: "Vessel is July 2, not June 28." },
          { from: "Buyer",     to: "You",        via: "Email",    text: "Why does the BL say June 28? Date is wrong." },
          { from: "You",       to: "Logistics",  via: "WhatsApp", text: "Was the BL draft updated? Buyer thinks it is still June 28." },
          { from: "Logistics", to: "You",        via: "WhatsApp", text: "I updated the draft on Sunday but who sent it?" },
        ],
        result: "Wrong BL went to customs. Buyer thinks a penalty was issued. Extra days lost for correction.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "BL Draft v2", value: "Current · July 2 departure",          status: "ok"   },
          { label: "BL Draft v1", value: "Old · June 28 departure · superseded", status: "warn" },
          { label: "Sent to buyer",value: "v2 sent · June 22 at 09:14",         status: "ok"   },
          { label: "Customs",      value: "Will process using v2",               status: "ok"   },
        ],
        note: "When the date change was entered in the record, the BL version updated and the buyer was notified.",
      },
    },

    /* ── 5 EN ─────────────────────────────────────────────── */
    {
      number: "05",
      title: "Buyer and seller have different information.",
      situation:
        "During price negotiation, the buyer is working from one figure, you from another. Both believe their own email is correct. Which is valid? Who said yes to the last offer?",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "Buyer", to: "You",   via: "Email",    text: "Placing order at the price in the FCO: $980/ton." },
          { from: "You",   to: "Buyer", via: "Email",    text: "No, the revised FCO was $1,020/ton. You accepted the revision." },
          { from: "Buyer", to: "You",   via: "Email",    text: "Which revision? We did not receive it. Latest document we have is $980." },
          { from: "You",   to: "Legal", via: "WhatsApp", text: "Was the revised FCO sent? Do we have proof?" },
        ],
        result: "Price dispute. Deal suspended. Trust damaged.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "FCO v1",    value: "$980/ton · buyer rejected",            status: "warn" },
          { label: "FCO v2",    value: "$1,020/ton · Revised · June 12",       status: "warn" },
          { label: "FCO v3",    value: "$1,020/ton · Buyer approved · June 14",status: "ok"   },
          { label: "Current",   value: "FCO v3 · accepted by both parties",    status: "ok"   },
        ],
        note: "Every offer's date, version and who approved it is in the record. Dispute resolved in minutes.",
      },
    },

    /* ── 6 EN ─────────────────────────────────────────────── */
    {
      number: "06",
      title: "Finance is trying to track payment status.",
      situation:
        "The deal closed. Now the question: has payment arrived? LC-based or wire transfer? Are the bank documents in order? Finance asks operations, operations asks sales. The answer chain grows.",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "Finance",    to: "Operations", via: "WhatsApp", text: "Any payment info? Has LC been presented to the bank?" },
          { from: "Operations", to: "Sales",      via: "WhatsApp", text: "Where is payment from the buyer?" },
          { from: "Sales",      to: "Buyer",      via: "Email",    text: "Have you made the LC presentation?" },
          { from: "Buyer",      to: "Sales",      via: "Email",    text: "We sent it to HSBC Dubai 3 days ago." },
        ],
        result: "It was sent 3 days ago but you just found out today. Accounting records are delayed.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "LC Presentation", value: "HSBC Dubai · June 19",          status: "ok"   },
          { label: "Bank",            value: "Review process · 5-7 business days", status: "warn" },
          { label: "Payment",         value: "Estimated June 26-28",          status: "warn" },
          { label: "Accounting",      value: "Will auto-update when received", status: "ok"   },
        ],
        note: "Finance tracks the payment process without calling sales or operations. Everything is in the record.",
      },
    },

    /* ── 7 EN ─────────────────────────────────────────────── */
    {
      number: "07",
      title: "Manager wants to see which deal is stuck.",
      situation:
        "The general manager sat down at their desk in the morning. There are 12 active deals. Which ones are moving? Which are stuck? Which need attention today? To answer these questions they either call someone or hold a meeting.",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "GM",        to: "Sales",      via: "WhatsApp", text: "What deals do we have going on today?" },
          { from: "Sales",     to: "GM",          via: "WhatsApp", text: "Steel deal is pending, textile closed, coffee looks problematic." },
          { from: "GM",        to: "Operations",  via: "WhatsApp", text: "What is the problem with coffee?" },
          { from: "Operations",to: "GM",           via: "WhatsApp", text: "Sample for SGS inspection has not been sent yet." },
        ],
        result: "GM called 3 people before 09:00. Still no complete picture. Meeting time has arrived.",
      },
      ortaq: {
        caption: "ORTAQ overview:",
        rows: [
          { label: "Steel · German buyer",    value: "SGS pending · buyer side",      status: "warn"   },
          { label: "Coffee · Japanese buyer",  value: "Sample not sent · our side",    status: "action" },
          { label: "Textile · Gulf buyer",     value: "Closed · payment received",     status: "ok"     },
          { label: "Machine · Thai buyer",     value: "Contract being signed",         status: "warn"   },
        ],
        note: "GM sees the status of all 12 deals at 08:30 without calling anyone. Which needs attention — clear.",
      },
    },

    /* ── 8 EN ─────────────────────────────────────────────── */
    {
      number: "08",
      title: "BL draft is missing. Buyer cannot start customs clearance.",
      situation:
        "Shipment was made. The buyer wants to prepare customs documents but the BL draft has still not arrived. Who is cutting it? When will it be delivered? Is it with the carrier or the bank? The buyer asks every day.",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "Buyer",    to: "You",       via: "Email",    text: "Are you going to send the BL draft? Customs is waiting." },
          { from: "You",      to: "Logistics", via: "WhatsApp", text: "When is the BL draft coming? Buyer is complaining." },
          { from: "Logistics",to: "You",       via: "WhatsApp", text: "We asked the carrier, they said today. Not sure why it is late." },
          { from: "Buyer",    to: "You",       via: "Email",    text: "Still nothing. Demurrage charges have started." },
        ],
        result: "Buyer is paying demurrage. Nobody knows why the BL is late. You are stuck in the middle.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "BL Draft",      value: "With carrier · being prepared",      status: "warn"   },
          { label: "Estimated",     value: "Today 17:00 · carrier informed",    status: "warn"   },
          { label: "Buyer notified",value: "Estimated time communicated",       status: "ok"     },
          { label: "Demurrage",     value: "1 day · reason noted in record",    status: "action" },
        ],
        note: "Where the BL process is and why it is delayed is in the record. You have the answer before the buyer asks.",
      },
    },

    /* ── 9 EN ─────────────────────────────────────────────── */
    {
      number: "09",
      title: "Sample process dragging. Cannot confirm the order.",
      situation:
        "The buyer requested a sample. Did the supplier send it? Did the buyer receive it? Did they approve it? Each of these steps is with a different person on a different channel. Order confirmation depends on sample approval but nobody knows where the process stopped.",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "Sales",    to: "Supplier", via: "WhatsApp", text: "Was the sample sent? Buyer is waiting." },
          { from: "Supplier", to: "Sales",    via: "WhatsApp", text: "We gave it to the courier, tracking number attached." },
          { from: "Sales",    to: "Buyer",    via: "Email",    text: "Sample is on the way, tracking: XYZ987." },
          { from: "Buyer",    to: "Sales",    via: "Email",    text: "Sample arrived but the colour does not match. What do we do?" },
        ],
        result: "Sample not approved. Order continuation unclear. Not known if supplier will send a new sample.",
      },
      ortaq: {
        caption: "Status in ORTAQ:",
        rows: [
          { label: "Sample 1",     value: "Sent · rejected by buyer · colour",    status: "action" },
          { label: "Sample 2",     value: "Being prepared at supplier",           status: "warn"   },
          { label: "Rejection",    value: "Colour mismatch · buyer note on record",status: "warn"  },
          { label: "Order",        value: "Pending sample approval",              status: "action" },
        ],
        note: "Why sample 1 was rejected and where sample 2 is — in the same record. No need to explain everything to the supplier again.",
      },
    },

    /* ── 10 EN ────────────────────────────────────────────── */
    {
      number: "10",
      title: "Ten active deals at once. Where do you start?",
      situation:
        "You sat down at your desk in the morning. There are 10 active deals. Some are waiting for SGS. Some have payments expected this week. One has had no response for 3 days. You do not know where to start because everything is running in different places.",
      chaos: {
        caption: "What is happening now:",
        messages: [
          { from: "GM",        to: "Sales",      via: "WhatsApp", text: "Which deal is the priority today?" },
          { from: "Sales",     to: "GM",          via: "WhatsApp", text: "Steel deal is urgent. Textile also looks difficult." },
          { from: "Finance",   to: "You",         via: "Email",    text: "Which deals have payments expected this month?" },
          { from: "Operations",to: "You",         via: "WhatsApp", text: "We have SGS approval pending on 3 different deals." },
        ],
        result: "Same meeting every morning, same questions, same uncertainty. Gathering information to make decisions takes time.",
      },
      ortaq: {
        caption: "ORTAQ overview:",
        rows: [
          { label: "Urgent",       value: "2 deals · no response for 24 hours",  status: "action" },
          { label: "This week",    value: "3 deals with payment expected",       status: "warn"   },
          { label: "SGS pending",  value: "3 deals · all on buyer side",        status: "warn"   },
          { label: "Moving",       value: "2 deals · monitoring sufficient",    status: "ok"     },
        ],
        note: "Status of all 10 deals, which are urgent and whose turn it is — visible in 5 minutes every morning.",
      },
    },

  ];

  return (
    <PublicShell stickyCta={false}>
      <StoryBar />

      <div className="bg-ortaq-surface">

        {/* Page header */}
        <div className="border-b border-ortaq-border bg-white">
          <Container wide>
            <div className="py-10 sm:py-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ortaq-trust">
                {isTR ? "Kullanım Senaryoları" : "Use Cases"}
              </p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-bold tracking-[-0.03em] text-ortaq-ink sm:text-[2.5rem] leading-[1.05]">
                {isTR
                  ? <>Bu durumlardan birini<br /><span className="text-ortaq-trust">yaşadınız mı?</span></>
                  : <>Have you experienced<br /><span className="text-ortaq-trust">any of these situations?</span></>
                }
              </h1>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ortaq-ink-muted">
                {isTR
                  ? "ORTAQ tam olarak bu durumlarda kullanılır. Gerçek ticari işlemlerde karşılaşılan gerçek problemler."
                  : "ORTAQ is used exactly in these situations. Real problems encountered in real commercial transactions."}
              </p>

              {/* Quick-jump pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {scenarios.map((s) => (
                  <a
                    key={s.number}
                    href={`#s${s.number}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ortaq-border bg-white px-3 py-1.5 text-[0.5rem] font-semibold text-ortaq-ink-soft transition-colors hover:border-ortaq-trust/40 hover:text-ortaq-trust"
                  >
                    <span className="font-mono text-ortaq-trust">{s.number}</span>
                    <span>{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Scenarios */}
        <Container wide>
          <div className="divide-y divide-ortaq-border py-2">
            {scenarios.map((s) => (
              <ScenarioBlock key={s.number} s={s} isTR={isTR} />
            ))}
          </div>
        </Container>

        {/* CTA */}
        <div className="border-t border-ortaq-border bg-ortaq-ink">
          <Container wide>
            <div className="py-12 text-center sm:py-16">
              <h2 className="text-[1.625rem] font-bold tracking-[-0.03em] text-ortaq-cream sm:text-[2rem]">
                {isTR
                  ? "Bu durumlardan biriyle mi karşı karşıyasınız?"
                  : "Are you facing one of these situations?"}
              </h2>
              <p className="mt-3 text-[0.9375rem] text-ortaq-cream/70">
                {isTR
                  ? "Demo isteyin. Aktif bir işleminizi getirin. 30 dakika."
                  : "Request a demo. Bring one active deal. 30 minutes."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ortaq-trust px-7 text-[0.9375rem] font-bold text-white shadow-sm transition-all hover:bg-ortaq-trust-soft active:scale-[0.98]"
                >
                  {isTR ? "Demo İsteyin" : "Request Demo"}
                </Link>
                <Link
                  href="/neden-ortaq"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ortaq-cream/20 px-5 text-[0.9375rem] font-medium text-ortaq-cream/80 transition-colors hover:border-ortaq-cream/40 hover:text-ortaq-cream"
                >
                  {isTR ? "Neden ORTAQ →" : "Why ORTAQ →"}
                </Link>
              </div>
            </div>
          </Container>
        </div>

      </div>
    </PublicShell>
  );
}

/* ── Scenario block ───────────────────────────────────────────────────────── */

function ScenarioBlock({ s, isTR }: { s: Scenario; isTR: boolean }) {
  const statusStyle = {
    ok:     { dot: "bg-emerald-400", val: "text-emerald-700 font-bold" },
    warn:   { dot: "bg-amber-400",   val: "text-amber-700 font-semibold" },
    action: { dot: "bg-red-400",     val: "text-red-700 font-bold" },
  } as const;

  return (
    <div id={`s${s.number}`} className="py-10 sm:py-14 scroll-mt-20">

      {/* Scenario header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-[0.625rem] font-bold text-ortaq-trust">{s.number}</span>
          <span className="h-px flex-1 bg-ortaq-border" />
        </div>
        <h2 className="text-[1.25rem] font-bold text-ortaq-ink sm:text-[1.5rem] leading-snug">
          {s.title}
        </h2>
        <p className="mt-2 max-w-2xl text-[0.875rem] leading-relaxed text-ortaq-ink-muted">
          {s.situation}
        </p>
      </div>

      {/* Two-column: chaos vs ORTAQ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* LEFT — chaos */}
        <div className="overflow-hidden rounded-2xl border border-red-100 bg-[#FDF6F5]">
          <div className="border-b border-red-100 bg-red-50 px-5 py-3">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-red-600">
              {s.chaos.caption}
            </p>
          </div>
          <div className="space-y-3 p-4">
            {s.chaos.messages.map((msg, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ortaq-ink text-[0.33rem] font-bold text-ortaq-cream">
                  {msg.from.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[0.4rem] font-bold text-ortaq-ink">{msg.from}</span>
                    {msg.to && <span className="text-[0.375rem] text-ortaq-ink-soft">→ {msg.to}</span>}
                    <span
                      className={cn(
                        "rounded px-1 py-px text-[0.35rem] font-bold text-white",
                        viaColors[msg.via] ?? "bg-gray-500"
                      )}
                    >
                      {msg.via}
                    </span>
                  </div>
                  <p className="text-[0.5375rem] leading-snug text-ortaq-ink-soft">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-red-100 bg-red-50/70 px-5 py-3">
            <div className="flex items-start gap-1.5">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              <p className="text-[0.5rem] font-semibold text-red-700">{s.chaos.result}</p>
            </div>
          </div>
        </div>

        {/* RIGHT — ORTAQ */}
        <div className="overflow-hidden rounded-2xl border border-ortaq-trust/20 bg-white">
          <div className="border-b border-ortaq-trust/15 bg-ortaq-trust/[0.04] px-5 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ortaq-trust" />
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.08em] text-ortaq-trust">
                {s.ortaq.caption}
              </p>
            </div>
          </div>
          <div className="divide-y divide-ortaq-border/50">
            {s.ortaq.rows.map((row, i) => {
              const st = statusStyle[row.status];
              return (
                <div key={i} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", st.dot)} />
                    <span className="text-[0.4375rem] font-semibold text-ortaq-ink-soft truncate">{row.label}</span>
                  </div>
                  <span className={cn("shrink-0 text-right text-[0.5rem]", st.val)}>{row.value}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-ortaq-trust/15 bg-ortaq-trust/[0.04] px-5 py-3.5">
            <p className="text-[0.5rem] leading-relaxed text-ortaq-trust">{s.ortaq.note}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
