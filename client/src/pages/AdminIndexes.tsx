/**
 * Admin: Trigram indekslerini tek tek oluştur (timeout riskini azaltır)
 * /admin-indexes?secret=smartseek-index-2025
 */
import { useState, useEffect } from "react";

const NAMES = [
  "pg_trgm extension",
  "companyName",
  "products",
  "industry",
  "subIndustry",
  "description",
  "city",
  "country",
];

export default function AdminIndexes() {
  const [status, setStatus] = useState<{
    extensionOk: boolean;
    indexes: { name: string; exists: boolean }[];
    next: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const secret = params.get("secret") || "smartseek-index-2025";

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/run-trigram-indexes?secret=${secret}&status=1`);
      const d = await r.json();
      setStatus(d);
    } catch (e) {
      setMsg("Status alınamadı: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const runIndex = async (idx: number) => {
    setRunning(idx);
    setMsg("");
    try {
      const r = await fetch(`/api/admin/run-trigram-indexes?secret=${secret}&index=${idx}`);
      const d = await r.json();
      setMsg(d.ok ? d.msg : d.error || "Hata");
      await fetchStatus();
    } catch (e) {
      setMsg("İstek hatası (timeout olabilir): " + (e as Error).message);
    } finally {
      setRunning(null);
    }
  };

  const exists = (idx: number) => {
    if (!status) return false;
    if (idx === 0) return status.extensionOk;
    return status.indexes[idx - 1]?.exists ?? false;
  };

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          {loading ? <p>Yükleniyor...</p> : <p>{msg || "Status alınamadı"}</p>}
        </div>
      </div>
    );
  }

  const allDone = status.extensionOk && status.indexes.every((i) => i.exists);

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Trigram İndeksleri</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Her indeks 5–15 dk sürebilir. Tek tek çalıştırın; timeout olursa sayfayı yenileyip devam edin.
      </p>
      {msg && <p className="mb-4 p-2 bg-muted rounded text-sm">{msg}</p>}
      <div className="space-y-2">
        {NAMES.map((name, idx) => (
          <div key={idx} className="flex items-center gap-4 p-2 rounded border">
            <span className="w-6">{idx}.</span>
            <span className="flex-1">{name}</span>
            {exists(idx) ? (
              <span className="text-green-600 text-sm">✓ Var</span>
            ) : (
              <button
                onClick={() => runIndex(idx)}
                disabled={running !== null}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
              >
                {running === idx ? "Çalışıyor..." : "Oluştur"}
              </button>
            )}
          </div>
        ))}
      </div>
      {allDone && (
        <p className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded text-green-800 dark:text-green-200">
          Tüm indeksler oluşturuldu. Tedarikçi araması artık hızlı çalışmalı.
        </p>
      )}
      <button onClick={fetchStatus} className="mt-4 text-sm text-muted-foreground hover:underline">
        Durumu yenile
      </button>
    </div>
  );
}
