# ORTAQ Ana Sayfa — Dönüşüm Odaklı Denetim ve Metin Revizyonu

Hedef: tasarım değil, ikna. Her bölüm saniyeler içinde "bunu neden umursamalıyım?" sorusuna cevap vermeli. Aşağıdaki tüm metin değişiklikleri `locales/tr.json` içindeki mevcut anahtarlara birebir eşlenmiştir; yapıyı bozmaz, yalnızca zayıf metni değiştirir.

---

## 1. Dört bakış açısından denetim

### A. Üretici (fabrika sahibi)
- **Hemen net olan:** ORTAQ'ın yurtdışı satışla ilgilendiği. "Doğru partner, kayıt, dosya" üçlüsü anlaşılıyor.
- **Kafa karıştıran:** Başvurudan sonra ne olduğu yok. "Eşleşme" nasıl oluyor, ne kadar sürüyor, bana maliyeti ne? Belirsiz.
- **Zayıf duran:** "Yatırıma hazır şirket dosyanız olur" — bu bir vaat, kanıt değil. Kaç üretici dahil edildi? Bir örnek yok.
- **Şüphe yaratan:** Bedava mı, komisyon mu, peşin ücret mi? Para konusu hiç konuşulmuyor. Üretici "beni nasıl bağlayacaklar?" diye düşünür.
- **Güven veren:** Uyum dili ve "para ORTAQ'ta toplanmaz" netliği iyi.
- **Eksik:** Üretici için ayrı bir süreç hattı (başvuru → inceleme → partner → kayıt → kampanya), giriş kriterleri, süre, maliyet modeli.

### B. Yatırımcı
- **Hemen net olan:** Borsa hissesi değil; üretim şirketine ortaklık. Gelir paylaşımı / öz sermaye ayrımı var.
- **Kafa karıştıran:** "Nasıl çıkarım, paramı ne zaman geri alırım?" Likidite ve çıkış hiç anlatılmıyor.
- **Zayıf duran:** Para kazanma mekaniği soyut. Somut bir senaryo (örn. "şirket X TL ciro yaparsa payınız Y olur") yok.
- **Şüphe yaratan:** Hiç sayı yok. Hiç tamamlanmış dosya yok. "Şirket bilgileri sicil kaydı tamamlanınca paylaşılır" ifadesi şirketin henüz kurulmadığını ima ediyor — bu ciddi bir güven kaybı.
- **Güven veren:** SPK / lisanslı platform / emanet hesabı / MKK dili profesyonel.
- **Eksik:** Çıkış senaryoları, gerçek dosya örneği, ORTAQ'ın kazanç modeli (çıkar çatışmasını çözmek için), risk-getiri çerçevesi.

### C. ITÜ Çekirdek jüri üyesi
- **Hemen net olan:** Pazar boşluğu (borsada görünmeyen sanayi katmanı) iyi çerçevelenmiş.
- **Kafa karıştıran:** İş modeli. "ORTAQ nasıl para kazanıyor?" sorusunun cevabı sayfada hiç yok. Jüri bunu ilk 60 saniyede sorar.
- **Zayıf duran:** Çekilebilirlik (traction) kanıtı sıfır. Ekip yok, danışman yok, partner adı yok, pilot yok.
- **Şüphe yaratan:** Savunulabilirlik (moat) belirsiz. "Lisanslı partnerle ilişki" bir avantaj olabilir ama anlatılmamış.
- **Güven veren:** Regülasyon farkındalığı yüksek; "biz aracı kurum değiliz" konumlaması olgun.
- **Eksik:** İş modeli, traction metrikleri, ekip, neden şimdi, neden biz.

### D. İlk kez gelen ziyaretçi
- **Hemen net olan:** Bir tür yatırım/üretim platformu olduğu.
- **Kafa karıştıran:** "Tam olarak ne yapıyorlar?" Hero felsefeyle açılıyor, eylemle değil. İlk ekranda somut bir "şu işi yapıyoruz" cümlesi yok.
- **Zayıf duran:** Soyutluk. "Ekonominin gerçek hareketi fabrika zemininde olur" güzel ama bana ne sağladığını söylemiyor.
- **Şüphe yaratan:** Sayı, isim, kanıt yokluğu. Yeni ve boş bir site hissi.
- **Güven veren:** Görsel ciddiyet, sade dil.
- **Eksik:** Tek cümlelik net tanım, sosyal kanıt, "kimim ben burada" yönlendirmesi (üretici miyim, yatırımcı mıyım).

---

## 2. En yüksek kaldıraçlı 10 değişiklik

1. **Hero'ya somut tanım ekle.** Felsefe ikinci satıra insin; ilk cümle ne yaptığınızı söylesin. (Açıklık + dönüşüm)
2. **"ORTAQ nasıl kazanır?" bölümü ekle.** En büyük güven açığı bu. İş modelini gizlemek şüphe üretir. (Güven + yatırımcı/jüri güveni)
3. **"Yatırımcı nasıl kazanır?" bölümünü somut senaryoya çevir.** Soyut "gelir paylaşımı" yerine sayısal örnek + çıkış. (Algılanan değer)
4. **Üretici için ayrı süreç hattı ekle.** "Başvurudan sonra ne olur" sorusunu adımlarla cevapla. (Üretici başvuruları)
5. **Traction/kanıt şeridi ekle.** İncelenen şirket sayısı, hazırlanan dosya, partner ağı büyüklüğü — küçük de olsa gerçek sayı. (Güven)
6. **"Sicil kaydı tamamlanınca paylaşılır" ifadesini kaldır veya değiştir.** Bu cümle şirketin var olmadığını ima ediyor; doğrudan zarar veriyor. (Güven)
7. **"Neden borsa değil?" netleştir.** Tek satır ima yerine somut karşılaştırma. (Algılanan değer)
8. **"Neden fuar / neden danışman değil?" karşılaştırmasını derinleştir.** Mevcut tablo yüzeysel; maliyet ve sonuç farkını göster. (Algılanan değer)
9. **Çıkış ve likidite bölümü ekle.** "Param kilitli mi, ne zaman çıkarım?" yatırımcının bir numaralı korkusu. (Yatırımcı güveni)
10. **Güven ve uyum bölümüne görünür kurumsal kanıt ekle.** Emanet bankası, lisanslı partner kategorisi, ekip/danışman. (Güven + jüri güveni)

---

## 3. On soruya dürüst değerlendirme

| # | Soru | Şu an net mi? | Durum |
|---|------|----------------|-------|
| 1 | Üretici neden katılmalı? | Kısmen | Faydalar var, ama "sonra ne olur" ve maliyet eksik |
| 2 | Başvurudan sonra ne olur? | Hayır | Üretici tarafı için adım adım anlatım yok |
| 3 | İhracatı nasıl büyütüyor? | Kısmen | "Partner + kayıt" var ama mekanik sığ |
| 4 | Neden fuardan iyi? | Kısmen | Tablo var ama yüzeysel, kanıtsız |
| 5 | Neden danışmandan iyi? | Hayır | Danışman karşılaştırması hiç yok |
| 6 | Yatırımcı nasıl kazanır? | Kısmen | Yapı var, somut senaryo + çıkış yok |
| 7 | ORTAQ nasıl kazanır? | **Hayır** | Tamamen eksik — en kritik açık |
| 8 | Neden crowdfunding değil? | Kısmen | "Para burada toplanmaz" var, fark net değil |
| 9 | Neden hisse almaktan farklı? | Kısmen | "Borsa fiyat izletir" ima düzeyinde |
| 10 | Lisanslı partner neden önemli? | Kısmen | Bahsediliyor ama "sizi koruyan kim" çerçevesi zayıf |

---

## 4. Metin revizyonları (zayıf kısımlar)

Her revizyon için: (1) eskisi neden zayıf, (2) yenisi neden daha iyi dönüştürür, (3) hangi itirazı kaldırır.

### 4.1 Hero — `homeProduct.heroPlate`

**Eski:**
> headline: "Ekonominin gerçek hareketi, fabrika zemininde olur."
> body: "Türk üreticiler yeni pazarlara açılsın diye buradayız. Doğru partneri bulur, ticareti kayda geçiririz, büyümeye hazır dosya sunarız."
> closing: "Borsa fiyat izletir. Burada gerçek üretim şirketine ortak olursunuz."

1. **Neden zayıf:** İlk cümle felsefe. Ziyaretçi "ne yapıyorsunuz" cevabını ikinci paragrafa kadar alamıyor. Soyut açılış dönüşümü düşürür.
2. **Neden daha iyi:** Önce ne yaptığınızı söyler, sonra felsefeyle anlam katar. Eylem + sebep sırası.
3. **Hangi itiraz:** "Bu site tam olarak ne işe yarıyor anlamadım."

**Yeni (tr.json değişikliği):**
```json
"kicker": "Türkiye'nin üretim katmanı",
"headline": "Üreten şirketleri inceleriz, ihracatını büyütürüz, yatırıma açarız.",
"body": "Türk üreticiyi doğru yurtdışı partnerle buluştururuz, ticareti kayda geçiririz ve denetlenmiş bir büyüme dosyasına dönüştürürüz.",
"closing": "Borsada fiyat hareketini izlersiniz. Burada üreten şirketin kendisine ortak olursunuz.",
"cta": "Yatırım dosyalarını incele →"
```

### 4.2 Why bölümü alt başlığı — `homeLanding.why.subtitle`

**Eski:** "Yurtdışı satış çoğu üreticiye yavaş, pahalı ve belirsiz gelir."

1. **Neden zayıf:** Sadece problemi söylüyor, ORTAQ'ın çözümünü cümleye bağlamıyor.
2. **Neden daha iyi:** Problemi çözüme köprüler; tablo öncesi beklenti kurar.
3. **Hangi itiraz:** "Peki siz bunu nasıl değiştiriyorsunuz?"

**Yeni:**
```json
"subtitle": "Yurtdışı satış çoğu üreticiye yavaş, pahalı ve belirsiz gelir. ORTAQ bu yolu ön elemeyle, doğrulanmış partnerle ve kayıt altında kısaltır."
```

### 4.3 Editorial son satır — `homeLanding.editorial.lines.4`

**Eski:** "Misyonumuz: Türk üreticinin yurtdışına açılmasını kolaylaştırmak."

1. **Neden zayıf:** "Misyonumuz" kalıbı kurumsal dolgu; somut değil.
2. **Neden daha iyi:** Misyonu eyleme ve sonuca bağlar.
3. **Hangi itiraz:** "Bu sadece slogan mı?"

**Yeni:**
```json
"4": "Yaptığımız iş tek cümlede: üreteni doğru alıcıyla buluşturup büyümesini yatırıma açık hale getirmek."
```

### 4.4 Yatırımcı bölümü — `homeLanding.audience.investor` (kazanç mekaniği)

**Eski points:**
> "1": "Satış arttıkça payınız, kampanyadaki oran"
> "2": "Şirkette pay; çıkış koşulları önceden belli"
> "3": "İşlem lisanslı kuruluşta, ORTAQ'ta değil"

1. **Neden zayıf:** Soyut. "Nasıl para kazanırım, ne zaman çıkarım" somut değil. Çıkış belirsiz.
2. **Neden daha iyi:** Kazanç yolunu ve çıkışı somutlaştırır; yatırımcının asıl sorusunu cevaplar.
3. **Hangi itiraz:** "Param ne zaman ve nasıl geri döner?"

**Yeni:**
```json
"lead": "Borsa hissesi değil. Üreten bir şirketin büyümesine iki yoldan ortak olursunuz.",
"points": {
  "1": "Gelir paylaşımı: şirket sattıkça, sözleşmedeki oran üzerinden düzenli pay alırsınız.",
  "2": "Öz sermaye: şirkette pay sahibi olursunuz; satış, yeni tur veya geri alım gibi çıkış koşulları sözleşmede önceden yazılır.",
  "3": "Para ORTAQ'a değil, lisanslı kuruluştaki emanet hesabına yatar; tüm işlem orada görülür."
}
```

### 4.5 Uyum bölümü başlığı — `homeLanding.regulatory.title`

**Eski:** "ORTAQ işlem yapmaz. Yatırım lisanslı platformda açılır."

1. **Neden zayıf:** Doğru ama savunmacı; ziyaretçiyi koruyan tarafı vurgulamıyor.
2. **Neden daha iyi:** Aynı bilgiyi "sizi kim koruyor" çerçevesine çevirir; lisanslı partnerin değerini anlatır.
3. **Hangi itiraz:** "Param güvende mi, beni kim koruyor?"

**Yeni:**
```json
"title": "Paranız ORTAQ'ta durmaz. Yatırım, SPK lisanslı platformda emanet hesabı korumasıyla açılır."
```

---

## 5. Eklenmesi gereken bölümler (yeni metin)

Mevcut yapıya yeni `homeLanding` namespace'leri olarak girer; sıralama: WhyOrtaq sonrası "Neden fuar/danışman değil", InvestObject sonrası "Yatırımcı nasıl kazanır", onun ardından "ORTAQ nasıl kazanır", Audience sonrası "Neden borsa değil", Regulatory bloğuna "Güven ve uyum" güçlendirmesi.

### 5.1 Yatırımcı nasıl kazanır? (`homeLanding.investorReturns`)
Başlık: **Yatırımcı nasıl kazanır?**

> Kazanç iki yapıdan gelir. Gelir paylaşımında şirket her satış yaptıkça sözleşmedeki oran kadar pay size düzenli olarak akar. Öz sermayede şirketin değeri büyüdükçe payınızın değeri artar; çıkış, sözleşmede yazılı koşullarla (yeni yatırım turu, geri alım veya satış) gerçekleşir.
>
> Örnek çerçeve: gelir paylaşımlı bir kampanyada şirket yıllık 10 milyon TL ihracat cirosuna ulaşır ve sözleşme yatırımcı havuzuna %4 pay tanırsa, o yıl dağıtılacak tutar 400 bin TL olur ve payınız oranında size düşer. Bu bir örnektir, taahhüt değildir; her kampanyanın kendi oranı ve koşulu vardır.
>
> Riski açık söylüyoruz: şirket büyümezse pay da oluşmaz. Bu yüzden her dosya yatırım öncesi sahada doğrulanır.

İtiraz kaldırır: "Tam olarak nasıl ve ne zaman kazanırım?"

### 5.2 ORTAQ nasıl kazanır? (`homeLanding.howWeEarn`)
Başlık: **ORTAQ nasıl kazanır?**

> Yatırımcıdan komisyon almayız ve para toplamayız. Gelirimiz üretici tarafındadır: bir şirketi inceleyip ihracat dosyasını hazırladığımız ve kampanyası lisanslı platformda başarıyla açıldığında hizmet bedeli alırız.
>
> Bu model bilerek seçildi: biz ancak şirket gerçekten yatırıma hazır hale gelir ve süreç ilerlerse kazanırız. Yarım dosyayı öne sürmek bizim de aleyhimizedir. Çıkarımız, sizinkiyle aynı yönde.

İtiraz kaldırır: "Bunlar parayı nereden kazanıyor, gizli bir tuzak mı var?" (Jüri ve yatırımcı için kritik.)

### 5.3 Neden borsa değil? (`homeLanding.notStock`)
Başlık: **Neden borsa değil?**

> Borsada bir şirketin fiyatını izlersiniz; günlük dalgalanma çoğu zaman şirketin gerçek işiyle değil piyasa havasıyla oluşur. Burada fiyatı izlemezsiniz, üretimin kendisine ortak olursunuz. Getiri, spekülasyondan değil şirketin satışından ve büyümesinden doğar.
>
> Fark şudur: borsada likidite yüksek ama bağ zayıftır. Burada bağ doğrudandır, karşılığında likidite sınırlıdır ve çıkış koşulları sözleşmeyle bellidir. İkisi farklı araçtır; biz ikincisini şeffaf kılarız.

İtiraz kaldırır: "Bu hisse senedinden ne farkı var?"

### 5.4 Neden fuar / neden danışman değil? (`homeLanding.notFairNotConsultant`)
Başlık: **Neden fuar veya danışman değil?**

> Fuar bir kez görünürlük verir; takip, doğrulama ve kayıt size kalır, maliyet peşindir ve sonuç belirsizdir. İhracat danışmanı genelde saatlik veya sabit ücret alır; kazansanız da kazanmasanız da öder, kanıt çoğu zaman raporda kalır.
>
> ORTAQ farkı: partneri önceden eleriz, ticari ilerlemeyi tek dosyada kayda geçiririz ve bu dosya yatırıma açılabilir bir varlığa dönüşür. Sonuç bir slayt değil, doğrulanmış bir ticari geçmiştir.

İtiraz kaldırır: "Zaten fuara gidiyorum / danışmanım var, sizin farkınız ne?"

### 5.5 Güven ve uyum (güçlendirme, `homeLanding.regulatory` + traction şeridi)
Mevcut uyum bölümü içerik olarak iyi; eksik olan görünür kanıt. Eklenecek üst şerit:

> Bugüne kadar incelenen şirket: [sayı] · Hazırlanan ihracat dosyası: [sayı] · Doğrulanmış partner ağı: [sayı ülke / [sayı] firma]

(Sayılar gerçek olmalı; küçük olsa bile boş bırakmaktan iyidir.)

---

## 6. Birebir metin değiştirmeleri (kopyala-uygula)

`locales/tr.json` içinde aşağıdaki değerleri değiştir. (EN için `en.json` paraleli ayrıca güncellenmeli.)

| Anahtar | Yeni değer |
|---------|-----------|
| `homeProduct.heroPlate.headline` | Üreten şirketleri inceleriz, ihracatını büyütürüz, yatırıma açarız. |
| `homeProduct.heroPlate.body` | Türk üreticiyi doğru yurtdışı partnerle buluştururuz, ticareti kayda geçiririz ve denetlenmiş bir büyüme dosyasına dönüştürürüz. |
| `homeProduct.heroPlate.closing` | Borsada fiyat hareketini izlersiniz. Burada üreten şirketin kendisine ortak olursunuz. |
| `homeLanding.why.subtitle` | Yurtdışı satış çoğu üreticiye yavaş, pahalı ve belirsiz gelir. ORTAQ bu yolu ön elemeyle, doğrulanmış partnerle ve kayıt altında kısaltır. |
| `homeLanding.editorial.lines.4` | Yaptığımız iş tek cümlede: üreteni doğru alıcıyla buluşturup büyümesini yatırıma açık hale getirmek. |
| `homeLanding.audience.investor.lead` | Borsa hissesi değil. Üreten bir şirketin büyümesine iki yoldan ortak olursunuz. |
| `homeLanding.audience.investor.points.1` | Gelir paylaşımı: şirket sattıkça, sözleşmedeki oran üzerinden düzenli pay alırsınız. |
| `homeLanding.audience.investor.points.2` | Öz sermaye: şirkette pay sahibi olursunuz; satış, yeni tur veya geri alım gibi çıkış koşulları sözleşmede önceden yazılır. |
| `homeLanding.audience.investor.points.3` | Para ORTAQ'a değil, lisanslı kuruluştaki emanet hesabına yatar; tüm işlem orada görülür. |
| `homeLanding.regulatory.title` | Paranız ORTAQ'ta durmaz. Yatırım, SPK lisanslı platformda emanet hesabı korumasıyla açılır. |

**Footer'dan kaldırılacak/değiştirilecek (kritik):**
> "Şirket bilgileri ve sicil kaydı tamamlanınca burada paylaşılır."

Bu cümle şirketin henüz kurulmadığını ima eder ve güveni doğrudan kırar. Tescil tamamlandıysa gerçek bilgiyi (unvan, sicil no, adres) yaz; tamamlanmadıysa cümleyi tümden kaldır ve yerine yalnızca iletişim/adres bırak.

---

## 7. Eksik güven sinyalleri
- İncelenen şirket / hazırlanan dosya / partner ağı sayıları (traction şeridi).
- Lisanslı partner platformunun adı veya kategorisi (gizlilik gerekçesiyle gizleniyorsa "SPK lisanslı kitle fonlama platformu" yerine somut bağ).
- Emanet hesabını tutan banka kategorisi.
- Ekip / kurucu / danışman görünürlüğü (en azından bir isim veya kurumsal geçmiş).
- Gerçek bir dosya örneği veya anonim vaka (kapasite, ihracat kaydı örneği).
- Tescil bilgileri (unvan, sicil, adres) — footer'daki erteleyici cümle yerine.

## 8. Eksik görsel ögeler
- Hero altında ince traction sayı şeridi (3 metrik).
- "Neye yatırım yapıyorum" akışında üretici → dosya → lisanslı platform için basit, etiketli diyagram (mevcut ok yapısı yeterli değil).
- "ORTAQ nasıl kazanır" için para akışı şeması (yatırımcı → emanet → şirket; ORTAQ yalnızca üretici tarafında ücret).
- Bir gerçek/örnek dosya kartı önizlemesi (şirketler sayfasına link veren).
- Rol ayrımı tablosunun ana sayfada görünür hale gelmesi (şu an metinde, görsel değil).

## 9. Eksik ekonomik açıklamalar
- ORTAQ'ın gelir modeli (en kritik eksik).
- Yatırımcı için somut kazanç senaryosu ve çıkış/likidite.
- Borsa ile fark (likidite vs. doğrudan bağ).
- Fuar ve danışmanın maliyet-sonuç karşılaştırması.
- "Para nerede durur" akışının net şeması.
- Gelir paylaşımı ile öz sermaye arasındaki seçim mantığı (yatırımcı hangisini ne zaman tercih eder).

---

## 10. Dürüst özet

Site temiz ve regülasyon dili olgun. Dönüşümü düşüren üç şey: (1) **iş modeli görünmez** — ORTAQ'ın nasıl kazandığı hiç söylenmiyor, bu hem yatırımcı hem jüri için kırmızı bayrak; (2) **kanıt yok** — sıfır sayı, sıfır isim, sıfır örnek, üstüne footer'daki "sicil tamamlanınca" cümlesi şirketin varlığını sorgulatıyor; (3) **somutluk yok** — hero felsefeyle açılıyor, yatırımcı kazancı ve çıkışı soyut kalıyor. Yapıyı koru, yukarıdaki metinleri uygula, üç yeni bölümü (yatırımcı kazancı, ORTAQ kazancı, neden borsa değil) ekle ve gerçek sayılarla bir traction şeridi koy. En yüksek getirili tek hamle: **"ORTAQ nasıl kazanır?" bölümünü eklemek.**
