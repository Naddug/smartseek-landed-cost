import type { BreadcrumbItem } from "@/types/nav";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";

const SEGMENT_LABELS: Record<string, string> = {
  firsatlarim: "Fırsatlarım",
  eslesmeler: "Eşleşmelerim",
  eslesmelerim: "Eşleşmelerim",
  mesajlar: "Mesajlar",
  kesfet: ORTAQ_COPY.ctas.browseDossiers,
  profilim: "Profilim",
  profil: "Profilim",
  "dosya-olustur": "Yeni Dosya",
};

export function generatePanelBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === "/panel") {
    return [{ label: "Genel Bakış" }];
  }

  if (!pathname.startsWith("/panel/")) {
    return [{ label: "Genel Bakış", href: "/panel" }];
  }

  const rest = pathname.slice("/panel".length);
  const segments = rest.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: "Genel Bakış", href: "/panel" }];

  let builtPath = "/panel";
  segments.forEach((segment, index) => {
    builtPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const prev = segments[index - 1];

    let label = SEGMENT_LABELS[segment];
    if (!label && prev === "firsatlarim") {
      label = ORTAQ_COPY.labels.dossierDetail;
    }
    if (!label) {
      label = segment;
    }

    crumbs.push({
      label,
      href: isLast ? undefined : builtPath,
    });
  });

  return crumbs;
}
