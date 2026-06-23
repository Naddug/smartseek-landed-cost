import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

interface PageShellProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  children?: React.ReactNode;
}

export function PageShell({
  title,
  description,
  eyebrow,
  action,
  emptyTitle = "Bu bölüm yakında",
  emptyDescription = "İçerik bir sonraki sprintte eklenecek.",
  children,
}: PageShellProps) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        eyebrow={eyebrow}
        action={action}
      />
      {children ?? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </>
  );
}
