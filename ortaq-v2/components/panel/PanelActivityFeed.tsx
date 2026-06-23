import type { PanelActivityEvent } from "@/types/panel";
import { formatRelativeTimeTr } from "@/lib/panel/format-relative-time";

interface PanelActivityFeedProps {
  events: PanelActivityEvent[];
}

export function PanelActivityFeed({ events }: PanelActivityFeedProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        Henüz kayıtlı aktivite yok. Dosya veya eşleşme hareketi burada görünür.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3 text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
          <div>
            <p className="text-stone-800">{event.label}</p>
            <p className="text-xs text-stone-500">
              {formatRelativeTimeTr(event.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
