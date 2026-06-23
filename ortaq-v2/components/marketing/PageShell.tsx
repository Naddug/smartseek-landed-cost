import { PageHeader } from "@/components/shared/PageHeader";

interface PageShellProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageShell({
  title,
  description,
  eyebrow,
  action,
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
      {children}
    </>
  );
}
