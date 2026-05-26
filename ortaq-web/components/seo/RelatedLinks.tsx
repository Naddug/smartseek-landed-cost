import Link from "next/link";
import type { RouteKey } from "@/lib/seo/routes";
import { getRelatedLinks, type RelatedLink } from "@/lib/seo/internal-links";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type RelatedLinksProps = {
  route?: RouteKey;
  links?: RelatedLink[];
  title?: string;
  compact?: boolean;
};

export function RelatedLinks({ route, links, title = "İlgili sayfalar", compact = false }: RelatedLinksProps) {
  const resolved = links ?? (route ? getRelatedLinks(route) : []);
  if (resolved.length === 0) return null;

  return (
    <nav aria-label={title} className={cn("border-t border-ortaq-border", compact ? "pt-5" : "pt-6")}>
      <h2 className={typography.caption}>{title}</h2>
      <ul className={cn("mt-3", compact ? "grid gap-3 sm:grid-cols-2" : "space-y-3")}>
        {resolved.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                typography.bodySm,
                typography.link,
                "block min-h-11 py-1 font-semibold text-ortaq-ink transition-colors hover:text-ortaq-trust",
              )}
            >
              {link.title}
            </Link>
            <p className={typography.caption}>{link.description}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
}
