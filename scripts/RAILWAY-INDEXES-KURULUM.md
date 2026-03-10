# Railway'de Trigram İndekslerini Kurma

Railway'de SQL arayüzü olmadığı için **uygulama içinden** indeksler oluşturulur.

## Yöntem: Admin endpoint

1. **Deploy** edin (git push ile)
2. Tarayıcıda açın:
   ```
   https://smartseek-landed-cost-production.up.railway.app/api/admin/run-trigram-indexes?secret=smartseek-index-2025
   ```
3. Sayfa yüklenene kadar bekleyin (5–20 dakika sürebilir; 25M satırda her indeks 5–15 dk)
4. Timeout olursa **aynı URL'yi tekrar açın** — zaten oluşan indeksler atlanır (`IF NOT EXISTS`)
5. Tüm indeksler `OK` veya `SKIP` olana kadar tekrarlayın

---

## Alternatif: TablePlus / DBeaver / pgAdmin

1. Railway → Projeniz → **Variables** → `DATABASE_URL` kopyalayın
2. TablePlus, DBeaver veya pgAdmin ile bu adrese bağlanın
3. `scripts/add-supplier-trigram-indexes-production.sql` içindeki SQL'leri çalıştırın
