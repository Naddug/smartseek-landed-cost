import { activityTickerItems } from "@/data/marketing/home-dossiers";

export function MarketplaceActivity() {
  const items = [...activityTickerItems, ...activityTickerItems];

  return (
    <section
      className="border-b border-ortaq-line bg-ortaq-surface"
      aria-label="Örnek pazar yeri hareketleri"
    >
      <div className="flex items-stretch">
        <div className="flex shrink-0 items-center gap-2 border-r border-ortaq-line px-4">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ortaq-action/80" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ortaq-navy">
            Örnek aktivite
          </span>
        </div>

        <div className="group relative flex-1 overflow-hidden py-3">
          <div className="flex w-max animate-ticker gap-8 group-hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <span
                key={`${item.id}-${i}`}
                className="inline-flex items-center gap-2 whitespace-nowrap text-xs text-ortaq-text-secondary"
              >
                <span className="h-1 w-1 rounded-full bg-ortaq-action" aria-hidden />
                {item.text}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ortaq-surface to-transparent" />
        </div>

        <div className="flex shrink-0 items-center border-l border-ortaq-line px-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ortaq-text-muted">
            Temsili veriler
          </span>
        </div>
      </div>
    </section>
  );
}
