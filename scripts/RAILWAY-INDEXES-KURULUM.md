# Railway'de Trigram İndekslerini Kurma

Railway'de SQL arayüzü olmadığı için **uygulama içinden** indeksler oluşturulur.

## Yöntem 1: Admin sayfası (önerilen)

1. **Deploy** edin (git push ile)
2. Tarayıcıda açın:
   ```
   https://smartseek-landed-cost-production.up.railway.app/admin-indexes?secret=smartseek-index-2025
   ```
3. Her indeks için **"Oluştur"** butonuna tıklayın (tek tek; her biri 5–15 dk sürebilir)
4. Timeout olursa sayfayı yenileyip **"Durumu yenile"** ile devam edin — zaten oluşanlar atlanır

## Yöntem 2: API endpoint (tek tek)

```
?index=0  → extension (hızlı)
?index=1  → companyName
?index=2  → products
...
?index=7  → country
```

Örnek: `.../api/admin/run-trigram-indexes?secret=smartseek-index-2025&index=1`

## Alternatif: TablePlus / DBeaver / pgAdmin

1. Railway → Projeniz → **Variables** → `DATABASE_URL` kopyalayın
2. TablePlus, DBeaver veya pgAdmin ile bu adrese bağlanın
3. `scripts/add-supplier-trigram-indexes-production.sql` içindeki SQL'leri çalıştırın
