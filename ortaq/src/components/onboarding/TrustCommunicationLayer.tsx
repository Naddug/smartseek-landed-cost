import { StatusBadge } from "@ortaq/components/trust/StatusBadge";
import type { TrustStatus } from "@ortaq/components/trust/StatusBadge";
import { cn } from "@ortaq/lib/cn";

type TrustCommunicationLayerProps = {
  status: TrustStatus;
  context: string;
  className?: string;
};

/** Small trust context: status + plain explanation. */
export function TrustCommunicationLayer({ status, context, className }: TrustCommunicationLayerProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <StatusBadge status={status} />
      <span className="text-xs leading-[1.5] text-ortaq-ink-soft">{context}</span>
    </div>
  );
}
