import { StatusBadge } from "@ortaq/components/trust/StatusBadge";

type IllustrativeLabelProps = {
  className?: string;
};

export function IllustrativeLabel({ className }: IllustrativeLabelProps) {
  return <StatusBadge status="illustrative" className={className} />;
}
