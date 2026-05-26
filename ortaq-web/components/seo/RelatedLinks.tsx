import Link from "next/link";
import type { RouteKey } from "@/lib/seo/routes";
import { getRelatedLinks } from "@/lib/seo/internal-links";
import { typography } from "@/design/typography";
import { cn } from "@/lib/cn";

type RelatedLinksProps = {
  route: RouteKey;
  title?: string;
};

export function RelatedLinks({ route, title = "İlgili sayfalar" }: RelatedLinksProps) {
  const links = getRelatedLinks(route);
  if (links.length === 0) return null;

  return (
    <nav aria-label={title} className="border-t border-ortaq-border pt-6">
      <h2 className={typography.caption}>{title}</h2>
      <ul className="mt-3 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(typography.bodySm, typography.link, "block min-h-11 py-1")}
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
