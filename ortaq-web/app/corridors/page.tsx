import type { Metadata } from "next";
import { CorridorsPageView } from "@/components/views/CorridorsPageView";

export const metadata: Metadata = {
  title: "Faaliyet Koridorları — ORTAQ",
  description:
    "Türkiye'den ASEAN, Körfez ve Avrupa'ya sınır ötesi ticaret koridorları. Her koridor için belge gereksinimleri, tipik süreler ve iş akışı.",
};

export default function CorridorsPage() {
  return <CorridorsPageView />;
}
