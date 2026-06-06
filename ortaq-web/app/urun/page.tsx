import type { Metadata } from "next";
import { ProductShowcaseView } from "@/components/views/ProductShowcaseView";

export const metadata: Metadata = {
  title: "Ürün — Sekiz Ekranda İşlem Yönetimi | ORTAQ",
  description:
    "İşlem özeti, belge merkezi, onaylar, portföy görünümü, karşı taraf görünümü, denetim izi ve mobil deneyim. Gerçek işlem yönetimi — çelik, makine, tekstil, gıda, kimya.",
};

export default function UrunPage() {
  return <ProductShowcaseView />;
}
