# ORTAQ Implementation Sprint #1 — Rapor

## 1. Yapılan değişiklikler

| # | Madde | Uygulama |
|---|--------|----------|
| 1 | Hero clarity | `gca.hero.clarity` hero başlığının altında vurgulu paragraf |
| 2 | Verification framework | `VerificationFrameworkBlock` — ana sayfa + `/guven` |
| 3 | Founder credibility | 5 maddelik geçmiş listesi (LEGO, Petlas, Yiğit Akü, ABD, ihracat) |
| 4 | Company trust | Footer: e-posta + konum; eksik veriler raporlandı (aşağı) |
| 5 | Category clarity | `CategoryClarityBlock` — ne değil / ne olduğu |
| 6 | Producer trust | Başvuru formu, üretici bölümü, demo belge yükleme |
| 7 | CTA consolidation | Birincil: `/#basvuru`; ikincil: demo sermaye |
| 8 | Demo positioning | `DemoPreviewBanner` tüm demo sayfalarında |
| 9 | Investor readiness | Footer, journey ve regulatory metinlerinde jargon azaltıldı |

## 2. Değişen dosyalar

- `locales/tr.json`
- `components/landing/gca/GcaSections.tsx`
- `components/views/HomePageView.tsx`
- `components/trust/VerificationFrameworkBlock.tsx` (yeni)
- `components/trust/CategoryClarityBlock.tsx` (yeni)
- `components/landing/HomepageFounder.tsx`
- `components/landing/HomepageContact.tsx`
- `components/views/TrustPageView.tsx`
- `components/layout/SiteFooter.tsx`
- `components/demo/DemoPreviewBanner.tsx` (yeni)
- `app/demo/layout.tsx`
- `app/demo/uretici/yukle/page.tsx`

## 3. Öncesi / sonrası etkisi

| Alan | Önce | Sonra |
|------|------|-------|
| Hero | Kısa slogan + maddeler | 10 sn’de tam iş tanımı (clarity paragrafı) |
| Doğrulama | Soyut “doğrulanmış” | 4 inceleme alanı + garanti değil uyarısı |
| Kurucu | Tek paragraf bio | Yapılandırılmış kurumsal geçmiş |
| Kategori | Dağınık uyarılar | Net “değil / budur” blok |
| CTA | Üretici + demo eşit ağırlık | Tek birincil başvuru, ikincil önizleme |
| Demo | Sadece “Önizleme” etiketi | Açık ürün önizlemesi cümlesi |

## 4. ITÜ Çekirdek etkisi

- İş modeli tek cümlede okunuyor (clarity).
- Doğrulama çerçevesi jüri sorularına hazır cevap.
- Kurucu geçmişi somut markalarla listelenmiş (abartısız).

## 5. Family Office etkisi

- “Doğrulanmış ≠ garanti” açık yazılı.
- ORTAQ’ın yatırım platformu olmadığı net.
- Belge gizliliği üretici tarafında güvence.

## 6. Yatırımcı etkisi

- Daha az jargon; daha fazla operasyonel dil.
- Güven sayfasında inceleme alanları görünür.
- Tek net başvuru CTA’sı.

## 7. Build sonucu

```
npm run check     → PASS
npm run build:prod → PASS
```

---

## Ek: Madde bazlı teslim notları

### #1 Hero clarity

- **Dosya:** `locales/tr.json` (`gca.hero.clarity`), `GcaSections.tsx`
- **Eski:** (yoktu — yalnızca headline + sub + bullets)
- **Yeni:** *ORTAQ, ihracatçı üreticilerin belgelerini doğrular; onları nitelikli sermaye partnerleri için keşfedilebilir kılar ve karşılıklı tanıştırma sürecini yönetir.*

### #2 Verification framework

- **Dosyalar:** `VerificationFrameworkBlock.tsx`, `GcaSections.tsx` (`GcaVerification`), `TrustPageView.tsx`
- **Yerleşim:** Ana sayfada hero’dan hemen sonra (yüksek görünürlük); `/guven` üst bölümünde tekrar (due diligence).

### #3 Founder

- **Dosya:** `HomepageFounder.tsx`, `locales/tr.json`
- **Eski:** Tek bio paragrafı (markalar gömülü)
- **Yeni:** Bio + 5 maddelik liste (LEGO, Petlas, Yiğit Akü, ABD, ihracat)

### #4 Company trust — eksik veriler (PLACEHOLDER kullanılmadı)

| Alan | Durum |
|------|--------|
| Ticaret unvanı (A.Ş. / Ltd.) | **Eksik** — kodda yok |
| Sicil no / vergi dairesi | **Eksik** |
| Açık adres | **Eksik** — yalnızca “İstanbul, Türkiye” |
| Telefon | **Eksik** |
| E-posta | **Mevcut:** destek@ortaq.biz |
| Çalışan iletişim | **Mevcut:** destek@ortaq.biz (footer) |

### #5 Category clarity

- **Yerleşim:** Ana sayfa, doğrulama bloğunun altında
- **Metin:** ORTAQ yatırım/crowdfunding/tavsiye değil → doğrulama, keşif, tanıştırma katmanı

### #6 Producer trust

- **Metin:** *Belgeleriniz yalnızca sizin onayladığınız sermaye partnerleriyle paylaşılır.*
- **Konumlar:** `/#basvuru`, `gca.forCompanies`, `/demo/uretici/yukle`

### #7 CTA

- **Önce:** Hero birincil `#for-companies`, farklı etiketler
- **Sonra:** Birincil `/#basvuru` “Başvuru yap”; ikincil `/demo/sermaye` “Sermaye önizlemesi”

### #8 Demo

- **Dosya:** `DemoPreviewBanner.tsx`, `demo.previewNotice`
