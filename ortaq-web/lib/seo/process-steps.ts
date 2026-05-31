/** HowTo schema steps — mirrors live /nasil-calisir process (evidence → introduction → room). */
export const PROCESS_HOWTO_STEPS = [
  { name: "Belgeler yüklenir", text: "Üretici belgelerini yükler." },
  { name: "Belgeler incelenir", text: "Kanıt dosyalanır ve incelenir." },
  { name: "Profil oluşturulur", text: "Dosyalanan kanıt ve eksikler profilde görünür." },
  { name: "Keşfedilebilir hale gelir", text: "Zorunlu belgeler tamamlandığında profil keşifte görünür." },
  { name: "Karşılıklı tanıştırma olur", text: "Sermaye partneri talep yazar; üretici kabul ederse tanıştırma açılır." },
  { name: "Görüşme odası açılır", text: "Karşılıklı kabul sonrası yapılandırılmış görüşme ortamı açılır." },
] as const;
