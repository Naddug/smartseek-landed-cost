import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  name: string;
  role: string;
  className?: string;
}

export function ProfileHeader({ name, role, className }: ProfileHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ortaq-surface-alt font-heading text-lg font-semibold text-ortaq-navy">
        {name.charAt(0).toUpperCase()}
      </div>
      <div>
        <h2 className="font-heading text-lg font-semibold text-ortaq-navy">{name}</h2>
        <p className="text-sm text-ortaq-text-muted">{role}</p>
      </div>
    </div>
  );
}
