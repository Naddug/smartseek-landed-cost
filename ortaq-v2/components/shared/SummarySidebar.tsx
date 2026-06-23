interface SummaryItem {
  label: string;
  value?: string;
}

interface SummarySidebarProps {
  title?: string;
  items: SummaryItem[];
  footer?: React.ReactNode;
}

export function SummarySidebar({
  title = "Özet",
  items,
  footer,
}: SummarySidebarProps) {
  return (
    <div className="rounded-xl border border-ortaq-line bg-ortaq-surface p-5">
      <h3 className="font-heading text-sm font-semibold text-ortaq-navy">
        {title}
      </h3>
      <dl className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-ortaq-text-muted">{item.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-ortaq-navy">
              {item.value ?? "—"}
            </dd>
          </div>
        ))}
      </dl>
      {footer && (
        <div className="mt-5 border-t border-ortaq-line pt-4">{footer}</div>
      )}
    </div>
  );
}
