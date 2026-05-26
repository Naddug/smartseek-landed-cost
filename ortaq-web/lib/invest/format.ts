const TR = "tr-TR";
const EN = "en-GB";

export function formatTryCompact(amount: number, locale: string): string {
  const loc = locale.startsWith("tr") ? TR : EN;
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    const formatted = new Intl.NumberFormat(loc, { maximumFractionDigits: 1 }).format(val);
    return `₺${formatted}M`;
  }
  if (amount >= 1_000) {
    const val = amount / 1_000;
    const formatted = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(val);
    return `₺${formatted}K`;
  }
  return new Intl.NumberFormat(loc, { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);
}
