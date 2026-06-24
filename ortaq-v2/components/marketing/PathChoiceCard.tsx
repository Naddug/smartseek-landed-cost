import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PathChoiceCardBaseProps {
  title: string;
  description: string;
  ctaLabel: string;
  icon?: React.ReactNode;
  className?: string;
}

type PathChoiceCardLinkProps = PathChoiceCardBaseProps & {
  href: string;
  onSelect?: never;
  disabled?: boolean;
};

type PathChoiceCardActionProps = PathChoiceCardBaseProps & {
  href?: never;
  onSelect: () => void;
  disabled?: boolean;
};

export type PathChoiceCardProps = PathChoiceCardLinkProps | PathChoiceCardActionProps;

function CardContent({
  title,
  description,
  ctaLabel,
  icon,
}: PathChoiceCardBaseProps) {
  return (
    <>
      {icon && (
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-ortaq-surface-alt text-ortaq-navy transition-colors group-hover:bg-ortaq-action/10 group-hover:text-ortaq-action">
          {icon}
        </div>
      )}
      <h2 className="font-heading text-xl font-semibold text-ortaq-navy md:text-2xl">
        {title}
      </h2>
      <p className="mt-3 flex-1 text-base leading-relaxed text-ortaq-text-muted">
        {description}
      </p>
      <div className="mt-8">
        <Button className="pointer-events-none" tabIndex={-1}>
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </>
  );
}

export function PathChoiceCard(props: PathChoiceCardProps) {
  const { className, disabled } = props;
  const shellClass = cn(
    "group flex w-full flex-col rounded-2xl border border-ortaq-line bg-ortaq-surface p-8 text-left transition-all hover:border-ortaq-action hover:shadow-md md:p-10",
    disabled && "pointer-events-none opacity-60",
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={shellClass}>
        <CardContent {...props} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={props.onSelect}
      disabled={disabled}
      className={shellClass}
    >
      <CardContent {...props} />
    </button>
  );
}
