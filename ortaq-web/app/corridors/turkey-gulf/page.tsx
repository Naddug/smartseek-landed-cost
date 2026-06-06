import type { Metadata } from "next";
import { CorridorDetailView } from "@/components/views/CorridorDetailView";

export const metadata: Metadata = {
  title: "Türkiye ↔ Körfez Koridoru — ORTAQ",
  description:
    "Türkiye'den BAE, Suudi Arabistan, Katar ve Kuveyt'e ihracat iş akışı. Helal sertifikası, akreditif ve menşe şahadetnamesi gereksinimleri.",
};

export default function TurkeyGulfPage() {
  return <CorridorDetailView corridor="gulf" />;
}
